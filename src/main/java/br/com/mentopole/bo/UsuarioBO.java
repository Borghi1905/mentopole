package br.com.mentopole.bo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.regex.Pattern;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import br.com.mentopole.dao.InstituicaoDAO;
import br.com.mentopole.dao.RelatoCidadaoDAO;
import br.com.mentopole.dao.UsuarioDAO;
import br.com.mentopole.dto.LoginRequest;
import br.com.mentopole.dto.UsuarioRequest;
import br.com.mentopole.dto.UsuarioResponse;
import br.com.mentopole.exception.AcessoNegadoException;
import br.com.mentopole.model.Usuario;
import jakarta.servlet.http.HttpSession;

@Service
public class UsuarioBO {

    public static final String ATRIBUTO_SESSAO = "usuarioLogado";

    public static final String CIDADAO = "CIDADAO";
    public static final String GESTOR = "GESTOR";
    public static final String ADMINISTRADOR = "ADMINISTRADOR";

    private static final Set<String> PERFIS_VALIDOS = Set.of(CIDADAO, GESTOR, ADMINISTRADOR);
    private static final Pattern PADRAO_EMAIL =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final int TAMANHO_MAX_NOME = 150;
    private static final int TAMANHO_MAX_EMAIL = 150;
    private static final int TAMANHO_MIN_SENHA = 8;
    private static final int TAMANHO_MAX_SENHA = 72; // limite do BCrypt

    private final UsuarioDAO usuarioDAO;
    private final RelatoCidadaoDAO relatoCidadaoDAO;
    private final InstituicaoDAO instituicaoDAO;

    public UsuarioBO(UsuarioDAO usuarioDAO,
                     RelatoCidadaoDAO relatoCidadaoDAO,
                     InstituicaoDAO instituicaoDAO) {
        this.usuarioDAO = usuarioDAO;
        this.relatoCidadaoDAO = relatoCidadaoDAO;
        this.instituicaoDAO = instituicaoDAO;
    }

    public UsuarioResponse inserir(UsuarioRequest request) {
        exigirPerfil(ADMINISTRADOR);
        validar(request);
        validarSenha(request.getSenha());

        String email = normalizarEmail(request.getEmail());
        validarEmailDuplicado(email, null);

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome().trim());
        usuario.setEmail(email);
        usuario.setSenhaHash(criptografarSenha(request.getSenha()));
        usuario.setTipoUsuario(textoVazio(request.getTipoUsuario())
                ? CIDADAO
                : request.getTipoUsuario().trim().toUpperCase());
        usuario.setDataCadastro(LocalDateTime.now());

        return paraResponse(usuarioDAO.inserir(usuario));
    }

    public UsuarioResponse registrar(UsuarioRequest request) {
        validar(request);
        validarSenha(request.getSenha());

        String email = normalizarEmail(request.getEmail());
        validarEmailDuplicado(email, null);

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome().trim());
        usuario.setEmail(email);
        usuario.setSenhaHash(criptografarSenha(request.getSenha()));
        usuario.setTipoUsuario(CIDADAO);
        usuario.setDataCadastro(LocalDateTime.now());

        return paraResponse(usuarioDAO.inserir(usuario));
    }

    public UsuarioResponse alterar(Long id, UsuarioRequest request) {
        exigirPerfil(ADMINISTRADOR);
        Usuario atual = usuarioDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado."));
        Usuario logado = usuarioLogado();

        validar(request);
        String email = normalizarEmail(request.getEmail());
        validarEmailDuplicado(email, id);

        String novoTipo = textoVazio(request.getTipoUsuario())
                ? atual.getTipoUsuario()
                : request.getTipoUsuario().trim().toUpperCase();
        validarAlteracaoPerfil(atual, novoTipo, logado);

        atual.setNome(request.getNome().trim());
        atual.setEmail(email);
        atual.setTipoUsuario(novoTipo);

        if (!textoVazio(request.getSenha())) {
            validarSenha(request.getSenha());
            atual.setSenhaHash(criptografarSenha(request.getSenha()));
        }

        if (!usuarioDAO.alterar(atual)) {
            throw new NoSuchElementException("Usuário não encontrado.");
        }
        return paraResponse(atual);
    }

    public void excluir(Long id) {
        exigirPerfil(ADMINISTRADOR);
        usuarioDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado."));
        verificarDependencias(id);
        if (!usuarioDAO.excluir(id)) {
            throw new NoSuchElementException("Usuário não encontrado.");
        }
    }

    public UsuarioResponse buscarPorId(Long id) {
        exigirPerfil(ADMINISTRADOR);
        Usuario usuario = usuarioDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado."));
        return paraResponse(usuario);
    }

    public List<UsuarioResponse> listarTodos() {
        exigirPerfil(ADMINISTRADOR);
        return usuarioDAO.listarTodos().stream().map(this::paraResponse).toList();
    }

    public Usuario autenticar(LoginRequest login) {
        validarLogin(login);
        String email = normalizarEmail(login.getEmail());

        Usuario usuario = usuarioDAO.buscarPorEmail(email).orElse(null);
        if (usuario == null || !senhaConfere(login.getSenha(), usuario.getSenhaHash())) {
            throw new SecurityException("E-mail ou senha inválidos.");
        }
        return usuario;
    }

    public void exigirPerfil(String... perfisPermitidos) {
        Usuario logado = usuarioLogado();
        for (String perfil : perfisPermitidos) {
            if (perfil.equals(logado.getTipoUsuario())) {
                return;
            }
        }
        throw new AcessoNegadoException("Seu perfil não tem permissão para esta operação.");
    }

    public UsuarioResponse perfilAtual() {
        return paraResponse(usuarioLogado());
    }

    public UsuarioResponse paraResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setTipoUsuario(usuario.getTipoUsuario());
        response.setDataCadastro(usuario.getDataCadastro());
        return response;
    }

    private void validar(UsuarioRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dados do usuário não informados.");
        }
        if (textoVazio(request.getNome())) {
            throw new IllegalArgumentException("O nome é obrigatório.");
        }
        if (request.getNome().trim().length() > TAMANHO_MAX_NOME) {
            throw new IllegalArgumentException("O nome deve ter no máximo " + TAMANHO_MAX_NOME + " caracteres.");
        }
        validarFormatoEmail(request.getEmail());
        if (!textoVazio(request.getTipoUsuario())
                && !PERFIS_VALIDOS.contains(request.getTipoUsuario().trim().toUpperCase())) {
            throw new IllegalArgumentException("Tipo de usuário inválido. Use CIDADAO, GESTOR ou ADMINISTRADOR.");
        }
    }

    private void validarFormatoEmail(String email) {
        if (textoVazio(email)) {
            throw new IllegalArgumentException("O e-mail é obrigatório.");
        }
        String normalizado = email.trim();
        if (normalizado.length() > TAMANHO_MAX_EMAIL || !PADRAO_EMAIL.matcher(normalizado).matches()) {
            throw new IllegalArgumentException("E-mail em formato inválido.");
        }
    }

    private void validarEmailDuplicado(String email, Long idAtual) {
        usuarioDAO.buscarPorEmail(email).ifPresent(existente -> {
            if (idAtual == null || !existente.getIdUsuario().equals(idAtual)) {
                throw new DataIntegrityViolationException("E-mail já cadastrado.");
            }
        });
    }

    private void validarSenha(String senha) {
        if (textoVazio(senha)) {
            throw new IllegalArgumentException("A senha é obrigatória.");
        }
        if (senha.length() < TAMANHO_MIN_SENHA) {
            throw new IllegalArgumentException("A senha deve ter no mínimo " + TAMANHO_MIN_SENHA + " caracteres.");
        }
        if (senha.length() > TAMANHO_MAX_SENHA) {
            throw new IllegalArgumentException("A senha deve ter no máximo " + TAMANHO_MAX_SENHA + " caracteres.");
        }
        boolean temLetra = senha.chars().anyMatch(Character::isLetter);
        boolean temDigito = senha.chars().anyMatch(Character::isDigit);
        if (!temLetra || !temDigito) {
            throw new IllegalArgumentException("A senha deve conter letras e números.");
        }
    }

    private void validarAlteracaoPerfil(Usuario atual, String novoTipo, Usuario logado) {
        if (!PERFIS_VALIDOS.contains(novoTipo)) {
            throw new IllegalArgumentException("Tipo de usuário inválido. Use CIDADAO, GESTOR ou ADMINISTRADOR.");
        }
        boolean mudouPerfil = !novoTipo.equals(atual.getTipoUsuario());
        boolean proprioUsuario = atual.getIdUsuario().equals(logado.getIdUsuario());
        if (mudouPerfil && proprioUsuario) {
            throw new AcessoNegadoException("Você não pode alterar o seu próprio perfil.");
        }
    }

    private void validarLogin(LoginRequest login) {
        if (login == null || textoVazio(login.getEmail()) || textoVazio(login.getSenha())) {
            throw new IllegalArgumentException("Informe e-mail e senha.");
        }
    }


    private String criptografarSenha(String senha) {
        return BCrypt.hashpw(senha, BCrypt.gensalt());
    }

    private boolean senhaConfere(String senha, String hash) {
        if (senha == null || hash == null) {
            return false;
        }
        try {
            return BCrypt.checkpw(senha, normalizarPrefixoBcrypt(hash));
        } catch (IllegalArgumentException e) {
            return false; // hash inválido/corrompido no banco: trata como credencial errada
        }
    }

    private String normalizarPrefixoBcrypt(String hashOriginal) {
        // trim: se a coluna for CHAR(n), o Oracle devolve o hash preenchido com espacos e o checkpw falharia.
        String hash = hashOriginal.trim();
        if (hash.length() > 4 && hash.charAt(0) == '$' && hash.charAt(1) == '2' && hash.charAt(3) == '$') {
            char versao = hash.charAt(2);
            if (versao == 'y' || versao == 'b' || versao == 'x') {
                return "$2a$" + hash.substring(4);
            }
        }
        return hash;
    }


    private Usuario usuarioLogado() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attrs) {
            HttpSession sessao = attrs.getRequest().getSession(false);
            if (sessao != null && sessao.getAttribute(ATRIBUTO_SESSAO) instanceof Usuario usuario) {
                // Relê o usuário no banco a cada requisição: se o perfil (ou o próprio usuário) mudou
                // depois do login, a sessão passa a refletir o estado atual sem precisar sair e entrar.
                Usuario atual = usuarioDAO.buscarPorId(usuario.getIdUsuario()).orElse(null);
                if (atual == null) {
                    sessao.invalidate();
                    throw new SecurityException("Autenticação necessária.");
                }
                sessao.setAttribute(ATRIBUTO_SESSAO, atual);
                return atual;
            }
        }
        throw new SecurityException("Autenticação necessária.");
    }

    private void verificarDependencias(Long id) {
        if (relatoCidadaoDAO.existePorUsuario(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir: o usuário possui relatos vinculados.");
        }
        if (instituicaoDAO.existePorUsuario(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir: o usuário é responsável por uma instituição.");
        }
    }

    private String normalizarEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private boolean textoVazio(String texto) {
        return texto == null || texto.isBlank();
    }
}