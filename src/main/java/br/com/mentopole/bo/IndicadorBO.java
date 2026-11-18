package br.com.mentopole.bo;

import br.com.mentopole.dao.DadoTerritorialDAO;
import br.com.mentopole.dao.IndicadorDAO;
import br.com.mentopole.model.Indicador;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class IndicadorBO {

    private final IndicadorDAO indicadorDAO;
    private final DadoTerritorialDAO dadoTerritorialDAO;

    public IndicadorBO(IndicadorDAO indicadorDAO, DadoTerritorialDAO dadoTerritorialDAO) {
        this.indicadorDAO = indicadorDAO;
        this.dadoTerritorialDAO = dadoTerritorialDAO;
    }

    public Indicador inserir(Indicador indicador) {
        validar(indicador);
        indicador.setIdIndicador(null);
        return indicadorDAO.inserir(indicador);
    }

    public Indicador alterar(Long id, Indicador indicador) {
        buscarPorId(id); // 404 se não existir
        validar(indicador);
        indicador.setIdIndicador(id);
        if (!indicadorDAO.alterar(indicador)) {
            throw new NoSuchElementException("Indicador não encontrado: " + id);
        }
        return indicador;
    }

    public void excluir(Long id) {
        buscarPorId(id); // 404 se não existir
        verificarDependencias(id);
        if (!indicadorDAO.excluir(id)) {
            throw new NoSuchElementException("Indicador não encontrado: " + id);
        }
    }

    public Indicador buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O id do indicador é obrigatório.");
        }
        return indicadorDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Indicador não encontrado: " + id));
    }

    public List<Indicador> listarTodos() {
        return indicadorDAO.listarTodos();
    }


    private void validar(Indicador indicador) {
        if (indicador == null) {
            throw new IllegalArgumentException("Os dados do indicador são obrigatórios.");
        }

        String nome = limpar(indicador.getNome());
        String descricao = limpar(indicador.getDescricao());
        String categoria = limpar(indicador.getCategoria());
        String unidade = limpar(indicador.getUnidadeMedida());

        if (nome == null) {
            throw new IllegalArgumentException("O nome do indicador é obrigatório.");
        }
        if (nome.length() > 150) {
            throw new IllegalArgumentException("O nome do indicador deve ter no máximo 150 caracteres.");
        }
        if (descricao == null) {
            throw new IllegalArgumentException("A descrição do indicador é obrigatória.");
        }
        if (descricao.length() > 500) {
            throw new IllegalArgumentException("A descrição do indicador deve ter no máximo 500 caracteres.");
        }
        if (categoria != null && categoria.length() > 80) {
            throw new IllegalArgumentException("A categoria deve ter no máximo 80 caracteres.");
        }
        if (unidade == null) {
            throw new IllegalArgumentException("A unidade de medida é obrigatória.");
        }
        if (unidade.length() > 40) {
            throw new IllegalArgumentException("A unidade de medida deve ter no máximo 40 caracteres.");
        }

        indicador.setNome(nome);
        indicador.setDescricao(descricao);
        indicador.setCategoria(categoria);
        indicador.setUnidadeMedida(unidade);
    }

    private void verificarDependencias(Long id) {
        if (dadoTerritorialDAO.existePorIndicador(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir o indicador: existem dados territoriais associados a ele.");
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
