package br.com.mentopole.bo;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import br.com.mentopole.dao.CategoriaServicoDAO;
import br.com.mentopole.dao.ServicoApoioDAO;
import br.com.mentopole.model.CategoriaServico;

@Service
public class CategoriaServicoBO {

    private static final int NOME_MAX = 100;
    private static final int DESCRICAO_MAX = 500;

    private final CategoriaServicoDAO categoriaServicoDAO;
    private final ServicoApoioDAO servicoApoioDAO;

    public CategoriaServicoBO(CategoriaServicoDAO categoriaServicoDAO,
                              ServicoApoioDAO servicoApoioDAO) {
        this.categoriaServicoDAO = categoriaServicoDAO;
        this.servicoApoioDAO = servicoApoioDAO;
    }

    public CategoriaServico inserir(CategoriaServico categoria) {
        validar(categoria);
        validarNomeDuplicado(categoria.getNome(), null);
        return categoriaServicoDAO.inserir(categoria);
    }

    public CategoriaServico alterar(Long id, CategoriaServico categoria) {
        buscarPorId(id); // 404 se não existir
        validar(categoria);
        validarNomeDuplicado(categoria.getNome(), id);

        categoria.setIdTipoServico(id);
        if (!categoriaServicoDAO.alterar(categoria)) {
            throw new NoSuchElementException("Categoria de serviço não encontrada: " + id);
        }
        return categoria;
    }

    public void excluir(Long id) {
        buscarPorId(id); // 404 se não existir
        verificarDependencias(id);

        if (!categoriaServicoDAO.excluir(id)) {
            throw new NoSuchElementException("Categoria de serviço não encontrada: " + id);
        }
    }

    public CategoriaServico buscarPorId(Long id) {
        return categoriaServicoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Categoria de serviço não encontrada: " + id));
    }

    public List<CategoriaServico> listarTodos() {
        return categoriaServicoDAO.listarTodos();
    }

    private void validar(CategoriaServico categoria) {
        if (categoria == null) {
            throw new IllegalArgumentException("Dados da categoria não informados.");
        }
        if (categoria.getNome() == null || categoria.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome da categoria é obrigatório.");
        }
        if (categoria.getNome().trim().length() > NOME_MAX) {
            throw new IllegalArgumentException("Nome deve ter no máximo " + NOME_MAX + " caracteres.");
        }
        if (categoria.getDescricao() != null && categoria.getDescricao().length() > DESCRICAO_MAX) {
            throw new IllegalArgumentException("Descrição deve ter no máximo " + DESCRICAO_MAX + " caracteres.");
        }
        categoria.setNome(categoria.getNome().trim());
    }

    private void validarNomeDuplicado(String nome, Long idAtual) {
        Optional<CategoriaServico> existente = categoriaServicoDAO.buscarPorNome(nome);
        if (existente.isPresent() && !existente.get().getIdTipoServico().equals(idAtual)) {
            throw new DataIntegrityViolationException("Já existe uma categoria de serviço com este nome.");
        }
    }

    private void verificarDependencias(Long id) {
        if (servicoApoioDAO.existePorCategoria(id)) {
            throw new DataIntegrityViolationException(
                    "Categoria possui serviços de apoio associados e não pode ser excluída.");
        }
    }
}
