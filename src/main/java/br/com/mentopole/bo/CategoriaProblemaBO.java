package br.com.mentopole.bo;

import br.com.mentopole.dao.CategoriaProblemaDAO;
import br.com.mentopole.dao.RelatoCidadaoDAO;
import br.com.mentopole.model.CategoriaProblema;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class CategoriaProblemaBO {

    private final CategoriaProblemaDAO categoriaProblemaDAO;
    private final RelatoCidadaoDAO relatoCidadaoDAO;

    public CategoriaProblemaBO(CategoriaProblemaDAO categoriaProblemaDAO,
                               RelatoCidadaoDAO relatoCidadaoDAO) {
        this.categoriaProblemaDAO = categoriaProblemaDAO;
        this.relatoCidadaoDAO = relatoCidadaoDAO;
    }

    public CategoriaProblema inserir(CategoriaProblema categoria) {
        validar(categoria);
        validarNomeDuplicado(categoria.getNome(), null);
        categoria.setIdCategoria(null);
        return categoriaProblemaDAO.inserir(categoria);
    }

    public CategoriaProblema alterar(Long id, CategoriaProblema categoria) {
        buscarPorId(id); // 404 se não existir
        validar(categoria);
        validarNomeDuplicado(categoria.getNome(), id);
        categoria.setIdCategoria(id);
        if (!categoriaProblemaDAO.alterar(categoria)) {
            throw new NoSuchElementException("Categoria de problema não encontrada: " + id);
        }
        return categoria;
    }

    public void excluir(Long id) {
        buscarPorId(id); // 404 se não existir
        verificarDependencias(id);
        if (!categoriaProblemaDAO.excluir(id)) {
            throw new NoSuchElementException("Categoria de problema não encontrada: " + id);
        }
    }

    public CategoriaProblema buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O id da categoria é obrigatório.");
        }
        return categoriaProblemaDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Categoria de problema não encontrada: " + id));
    }

    public List<CategoriaProblema> listarTodos() {
        return categoriaProblemaDAO.listarTodos();
    }


    private void validar(CategoriaProblema categoria) {
        if (categoria == null) {
            throw new IllegalArgumentException("Os dados da categoria são obrigatórios.");
        }

        String nome = categoria.getNome() == null ? null : categoria.getNome().trim();
        String descricao = categoria.getDescricao() == null ? null : categoria.getDescricao().trim();

        if (nome == null || nome.isEmpty()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }
        if (nome.length() > 100) {
            throw new IllegalArgumentException("O nome da categoria deve ter no máximo 100 caracteres.");
        }
        if (descricao != null && descricao.isEmpty()) {
            descricao = null;
        }
        if (descricao != null && descricao.length() > 4000) {
            throw new IllegalArgumentException("A descrição deve ter no máximo 4000 caracteres.");
        }

        categoria.setNome(nome);
        categoria.setDescricao(descricao);
    }

    private void validarNomeDuplicado(String nome, Long idAtual) {
        categoriaProblemaDAO.buscarPorNome(nome).ifPresent(existente -> {
            if (!Objects.equals(existente.getIdCategoria(), idAtual)) {
                throw new IllegalArgumentException("Já existe uma categoria de problema com o nome: " + nome);
            }
        });
    }

    private void verificarDependencias(Long id) {
        if (relatoCidadaoDAO.existePorCategoria(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir a categoria: existem relatos associados a ela.");
        }
    }
}
