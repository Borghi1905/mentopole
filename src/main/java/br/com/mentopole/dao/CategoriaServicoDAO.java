package br.com.mentopole.dao;

import br.com.mentopole.model.CategoriaServico;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class CategoriaServicoDAO {

    private static final String SELECT = "SELECT id_tipo_servico, nome, descricao FROM CATEGORIA_SERVICO";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<CategoriaServico> rowMapper = (rs, rowNum) -> new CategoriaServico(
            getLong(rs, "id_tipo_servico"),
            rs.getString("nome"),
            rs.getString("descricao"));

    public CategoriaServicoDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public CategoriaServico inserir(CategoriaServico categoria) {
        String sql = "INSERT INTO CATEGORIA_SERVICO (nome, descricao) VALUES (?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_TIPO_SERVICO", ps -> {
            ps.setString(1, categoria.getNome());
            ps.setString(2, categoria.getDescricao());
        });
        categoria.setIdTipoServico(id);
        return categoria;
    }

    public boolean alterar(CategoriaServico categoria) {
        String sql = "UPDATE CATEGORIA_SERVICO SET nome = ?, descricao = ? WHERE id_tipo_servico = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, categoria.getNome());
            ps.setString(2, categoria.getDescricao());
            setLong(ps, 3, categoria.getIdTipoServico());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM CATEGORIA_SERVICO WHERE id_tipo_servico = ?", id);
    }

    public Optional<CategoriaServico> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE id_tipo_servico = ?", rowMapper, id).stream().findFirst();
    }

    public List<CategoriaServico> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY id_tipo_servico", rowMapper);
    }

    public Optional<CategoriaServico> buscarPorNome(String nome) {
        return jdbcTemplate.query(SELECT + " WHERE LOWER(nome) = LOWER(?)", rowMapper, nome).stream().findFirst();
    }
}
