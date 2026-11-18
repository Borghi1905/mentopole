package br.com.mentopole.bo;

import br.com.mentopole.dao.DadoTerritorialDAO;
import br.com.mentopole.dao.FonteDadoDAO;
import br.com.mentopole.model.FonteDado;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class FonteDadoBO {

    private final FonteDadoDAO fonteDadoDAO;
    private final DadoTerritorialDAO dadoTerritorialDAO;

    public FonteDadoBO(FonteDadoDAO fonteDadoDAO, DadoTerritorialDAO dadoTerritorialDAO) {
        this.fonteDadoDAO = fonteDadoDAO;
        this.dadoTerritorialDAO = dadoTerritorialDAO;
    }

    public FonteDado inserir(FonteDado fonte) {
        validar(fonte);
        fonte.setIdFonte(null);
        fonte.setDataConsulta(LocalDateTime.now());
        return fonteDadoDAO.inserir(fonte);
    }

    public FonteDado alterar(Long id, FonteDado fonte) {
        FonteDado atual = buscarPorId(id);
        validar(fonte);
        fonte.setIdFonte(id);
        fonte.setDataConsulta(atual.getDataConsulta());
        if (!fonteDadoDAO.alterar(fonte)) {
            throw new NoSuchElementException("Fonte de dado não encontrada: " + id);
        }
        return fonte;
    }

    public void excluir(Long id) {
        buscarPorId(id);
        verificarDependencias(id);
        if (!fonteDadoDAO.excluir(id)) {
            throw new NoSuchElementException("Fonte de dado não encontrada: " + id);
        }
    }

    public FonteDado buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O id da fonte de dado é obrigatório.");
        }
        return fonteDadoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Fonte de dado não encontrada: " + id));
    }

    public List<FonteDado> listarTodos() {
        return fonteDadoDAO.listarTodos();
    }


    private void validar(FonteDado fonte) {
        if (fonte == null) {
            throw new IllegalArgumentException("Os dados da fonte são obrigatórios.");
        }

        String nome = limpar(fonte.getNome());
        String descricao = limpar(fonte.getDescricao());
        String url = limpar(fonte.getUrl());

        if (nome == null) {
            throw new IllegalArgumentException("O nome da fonte é obrigatório.");
        }
        if (nome.length() > 150) {
            throw new IllegalArgumentException("O nome da fonte deve ter no máximo 150 caracteres.");
        }
        if (descricao != null && descricao.length() > 500) {
            throw new IllegalArgumentException("A descrição da fonte deve ter no máximo 500 caracteres.");
        }
        validarUrl(url);

        fonte.setNome(nome);
        fonte.setDescricao(descricao);
        fonte.setUrl(url);
    }

    private void validarUrl(String url) {
        if (url == null) {
            return;
        }
        if (url.length() > 500) {
            throw new IllegalArgumentException("A URL deve ter no máximo 500 caracteres.");
        }
        try {
            URI uri = new URI(url);
            String esquema = uri.getScheme();
            boolean esquemaValido = "http".equalsIgnoreCase(esquema) || "https".equalsIgnoreCase(esquema);
            if (!esquemaValido || uri.getHost() == null) {
                throw new IllegalArgumentException("URL inválida. Use um endereço http:// ou https://.");
            }
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("URL inválida. Use um endereço http:// ou https://.");
        }
    }

    private void verificarDependencias(Long id) {
        if (dadoTerritorialDAO.existePorFonte(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir a fonte: existem dados territoriais associados a ela.");
        }
    }

    private String limpar(String valor) {
        if (valor == null) {
            return null;
        }
        String s = valor.trim();
        return s.isEmpty() ? null : s;
    }
}
