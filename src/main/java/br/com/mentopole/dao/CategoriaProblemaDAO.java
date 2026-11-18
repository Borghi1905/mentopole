package br.com.mentopole.dao;

import br.com.mentopole.model.CategoriaProblema;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class CategoriaProblemaDAO {

    private static final String SELECT = "SELECT id_categoria, nome, descricao FROM CATEGORIA_PROBLEMA";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<CategoriaProblema> rowMapper = (rs, rowNum) -> new CategoriaProblema(
            getLong(rs, "id_categoria"),
            rs.getString("nome"),
            rs.getString("descricao"));

    public CategoriaProblemaDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public CategoriaProblema inserir(CategoriaProblema categoria) {
        String sql = "INSERT INTO CATEGORIA_PROBLEMA (nome, descricao) VALUES (?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_CATEGORIA", ps -> {
            ps.setString(1, categoria.getNome());
            ps.setString(2, categoria.getDescricao());
        });
        categoria.setIdCategoria(id);
        return categoria;
    }

    public boolean alterar(CategoriaProblema categoria) {
        String sql = "UPDATE CATEGORIA_PROBLEMA SET nome = ?, descricao = ? WHERE id_categoria = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, categoria.getNome());
            ps.setString(2, categoria.getDescricao());
            setLong(ps, 3, categoria.getIdCategoria());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM CATEGORIA_PROBLEMA WHERE id_categoria = ?", id);
    }

    public Optional<CategoriaProblema> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE id_categoria = ?", rowMapper, id).stream().findFirst();
    }

    public List<CategoriaProblema> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY id_categoria", rowMapper);
    }

    public Optional<CategoriaProblema> buscarPorNome(String nome) {
        return jdbcTemplate.query(SELECT + " WHERE LOWER(nome) = LOWER(?)", rowMapper, nome).stream().findFirst();
    }
}
