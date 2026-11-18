package br.com.mentopole.bo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import br.com.mentopole.dao.CategoriaProblemaDAO;
import br.com.mentopole.dao.RegiaoDAO;
import br.com.mentopole.dao.RelatoCidadaoDAO;
import br.com.mentopole.dao.UsuarioDAO;
import br.com.mentopole.dto.RelatoRequest;
import br.com.mentopole.dto.RelatoResponse;
import br.com.mentopole.exception.AcessoNegadoException;
import br.com.mentopole.model.CategoriaProblema;
import br.com.mentopole.model.Regiao;
import br.com.mentopole.model.RelatoCidadao;
import br.com.mentopole.model.Usuario;
import jakarta.servlet.http.HttpSession;


@Service
public class RelatoCidadaoBO {

    public static final String PENDENTE = "PENDENTE";
    public static final String VALIDADO = "VALIDADO";
    public static final String REJEITADO = "REJEITADO";

    private static final Set<String> STATUS_VALIDOS = Set.of(PENDENTE, VALIDADO, REJEITADO);
    private static final Set<String> STATUS_MODERACAO = Set.of(VALIDADO, REJEITADO);
    private static final int TAMANHO_MAX_DESCRICAO = 4000;

    private final RelatoCidadaoDAO relatoCidadaoDAO;
    private final RegiaoDAO regiaoDAO;
    private final CategoriaProblemaDAO categoriaProblemaDAO;
    private final UsuarioDAO usuarioDAO;
    private final UsuarioBO usuarioBO;

    public RelatoCidadaoBO(RelatoCidadaoDAO relatoCidadaoDAO,
                           RegiaoDAO regiaoDAO,
                           CategoriaProblemaDAO categoriaProblemaDAO,
                           UsuarioDAO usuarioDAO,
                           UsuarioBO usuarioBO) {
        this.relatoCidadaoDAO = relatoCidadaoDAO;
        this.regiaoDAO = regiaoDAO;
        this.categoriaProblemaDAO = categoriaProblemaDAO;
        this.usuarioDAO = usuarioDAO;
        this.usuarioBO = usuarioBO;
    }

    public RelatoResponse inserir(RelatoRequest request) {
        Usuario logado = usuarioLogado();
        validar(request);

        Usuario autor = usuarioDAO.buscarPorId(logado.getIdUsuario())
                .orElseThrow(() -> new SecurityException("Autenticação necessária."));

        RelatoCidadao relato = paraModelo(request);
        validarAssociados(relato);
        relato.setAutor(autor);
        relato.setValidador(null);
        relato.setStatus(PENDENTE);
        relato.setDataRelato(LocalDateTime.now());

        return paraResponse(relatoCidadaoDAO.inserir(relato));
    }


    public RelatoResponse alterar(Long id, RelatoRequest request) {
        Usuario logado = usuarioLogado();
        RelatoCidadao atual = relatoCidadaoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Relato não encontrado."));
        validarPermissaoEdicao(atual, logado);
        validar(request);

        RelatoCidadao novo = paraModelo(request);
        validarAssociados(novo);
        novo.setIdRelato(atual.getIdRelato());
        novo.setAutor(atual.getAutor());
        novo.setValidador(atual.getValidador());
        novo.setStatus(atual.getStatus());
        novo.setDataRelato(atual.getDataRelato());

        if (!relatoCidadaoDAO.alterar(novo)) {
            throw new NoSuchElementException("Relato não encontrado.");
        }
        return paraResponse(novo);
    }

    public RelatoResponse alterarStatus(Long id, String novoStatus) {
        usuarioBO.exigirPerfil(UsuarioBO.ADMINISTRADOR);
        Usuario logado = usuarioLogado();
        RelatoCidadao atual = relatoCidadaoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Relato não encontrado."));

        String status = novoStatus == null ? null : novoStatus.trim().toUpperCase();
        validarStatus(status);
        validarModeracao(atual, status, logado);

        atual.setStatus(status);
        atual.setValidador(logado);

        if (!relatoCidadaoDAO.alterar(atual)) {
            throw new NoSuchElementException("Relato não encontrado.");
        }
        return paraResponse(atual);
    }

    public void excluir(Long id) {
        Usuario logado = usuarioLogado();
        RelatoCidadao atual = relatoCidadaoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Relato não encontrado."));
        validarPermissaoEdicao(atual, logado);

        if (!relatoCidadaoDAO.excluir(id)) {
            throw new NoSuchElementException("Relato não encontrado.");
        }
    }

    public RelatoResponse buscarPorId(Long id) {
        usuarioLogado();
        RelatoCidadao relato = relatoCidadaoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Relato não encontrado."));
        return paraResponse(relato);
    }

    public List<RelatoResponse> listarTodos() {
        usuarioLogado();
        return relatoCidadaoDAO.listarTodos().stream().map(this::paraResponse).toList();
    }

    private void validar(RelatoRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados do relato não informados.");
        }
        if (request.getDescricao() == null || request.getDescricao().isBlank()) {
            throw new IllegalArgumentException("A descrição é obrigatória.");
        }
        if (request.getDescricao().trim().length() > TAMANHO_MAX_DESCRICAO) {
            throw new IllegalArgumentException(
                    "A descrição deve ter no máximo " + TAMANHO_MAX_DESCRICAO + " caracteres.");
        }
        validarCoordenadas(request.getLatitude(), request.getLongitude());
        if (request.getIdRegiao() == null) {
            throw new IllegalArgumentException("A região é obrigatória.");
        }
        if (request.getIdCategoriaProblema() == null) {
            throw new IllegalArgumentException("A categoria do problema é obrigatória.");
        }
    }

    private void validarCoordenadas(Double latitude, Double longitude) {
        if (latitude == null && longitude == null) {
            return;
        }
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Informe latitude e longitude juntas.");
        }
        if (latitude.isNaN() || latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude deve estar entre -90 e 90.");
        }
        if (longitude.isNaN() || longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude deve estar entre -180 e 180.");
        }
    }

    private void validarStatus(String status) {
        if (status == null || !STATUS_VALIDOS.contains(status)) {
            throw new IllegalArgumentException("Status inválido. Use PENDENTE, VALIDADO ou REJEITADO.");
        }
    }

    private void validarAssociados(RelatoCidadao relato) {
        Regiao regiao = regiaoDAO.buscarPorId(relato.getRegiao().getIdRegiao())
                .orElseThrow(() -> new IllegalArgumentException("A região informada não existe."));
        CategoriaProblema categoria = categoriaProblemaDAO
                .buscarPorId(relato.getCategoriaProblema().getIdCategoria())
                .orElseThrow(() -> new IllegalArgumentException("A categoria de problema informada não existe."));
        relato.setRegiao(regiao);
        relato.setCategoriaProblema(categoria);
    }

    private void validarModeracao(RelatoCidadao atual, String novoStatus, Usuario logado) {
        if (!STATUS_MODERACAO.contains(novoStatus)) {
            throw new IllegalArgumentException("A moderação aceita apenas VALIDADO ou REJEITADO.");
        }
        if (atual.getAutor() != null && atual.getAutor().getIdUsuario().equals(logado.getIdUsuario())) {
            throw new AcessoNegadoException("Você não pode validar ou rejeitar o seu próprio relato.");
        }
    }

    private void validarPermissaoEdicao(RelatoCidadao atual, Usuario logado) {
        if (UsuarioBO.ADMINISTRADOR.equals(logado.getTipoUsuario())) {
            return;
        }
        boolean ehAutor = atual.getAutor() != null
                && atual.getAutor().getIdUsuario().equals(logado.getIdUsuario());
        if (!ehAutor) {
            throw new AcessoNegadoException("Somente o autor ou um administrador pode alterar este relato.");
        }
        if (!PENDENTE.equals(atual.getStatus())) {
            throw new AcessoNegadoException("Relatos já moderados não podem mais ser alterados pelo autor.");
        }
    }

    private RelatoCidadao paraModelo(RelatoRequest request) {
        Regiao regiao = new Regiao();
        regiao.setIdRegiao(request.getIdRegiao());

        CategoriaProblema categoria = new CategoriaProblema();
        categoria.setIdCategoria(request.getIdCategoriaProblema());

        RelatoCidadao relato = new RelatoCidadao();
        relato.setDescricao(request.getDescricao().trim());
        relato.setLatitude(request.getLatitude());
        relato.setLongitude(request.getLongitude());
        relato.setRegiao(regiao);
        relato.setCategoriaProblema(categoria);
        return relato;
    }

    private RelatoResponse paraResponse(RelatoCidadao relato) {
        RelatoResponse response = new RelatoResponse();
        response.setIdRelato(relato.getIdRelato());
        response.setDescricao(relato.getDescricao());
        response.setLatitude(relato.getLatitude());
        response.setLongitude(relato.getLongitude());
        response.setDataRelato(relato.getDataRelato());
        response.setStatus(relato.getStatus());
        response.setRegiao(relato.getRegiao());
        response.setCategoriaProblema(relato.getCategoriaProblema());
        response.setAutorNome(relato.getAutor() != null ? relato.getAutor().getNome() : null);
        response.setValidadorNome(relato.getValidador() != null ? relato.getValidador().getNome() : null);
        return response;
    }

    private Usuario usuarioLogado() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attrs) {
            HttpSession sessao = attrs.getRequest().getSession(false);
            if (sessao != null && sessao.getAttribute(UsuarioBO.ATRIBUTO_SESSAO) instanceof Usuario usuario) {
                return usuario;
            }
        }
        throw new SecurityException("Autenticação necessária.");
    }
}