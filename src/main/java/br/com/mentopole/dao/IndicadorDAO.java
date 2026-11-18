package br.com.mentopole.dao;

import br.com.mentopole.model.Indicador;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class IndicadorDAO {

    private static final String SELECT =
            "SELECT id_indicador, nome, descricao, categoria, unidade_medida FROM INDICADOR";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Indicador> rowMapper = (rs, rowNum) -> new Indicador(
            getLong(rs, "id_indicador"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getString("categoria"),
            rs.getString("unidade_medida"));

    public IndicadorDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Indicador inserir(Indicador indicador) {
        String sql = "INSERT INTO INDICADOR (nome, descricao, categoria, unidade_medida) VALUES (?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_INDICADOR", ps -> {
            ps.setString(1, indicador.getNome());
            ps.setString(2, indicador.getDescricao());
            ps.setString(3, indicador.getCategoria());
            ps.setString(4, indicador.getUnidadeMedida());
        });
        indicador.setIdIndicador(id);
        return indicador;
    }

    public boolean alterar(Indicador indicador) {
        String sql = "UPDATE INDICADOR SET nome = ?, descricao = ?, categoria = ?, unidade_medida = ? "
                + "WHERE id_indicador = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, indicador.getNome());
            ps.setString(2, indicador.getDescricao());
            ps.setString(3, indicador.getCategoria());
            ps.setString(4, indicador.getUnidadeMedida());
            setLong(ps, 5, indicador.getIdIndicador());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM INDICADOR WHERE id_indicador = ?", id);
    }

    public Optional<Indicador> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE id_indicador = ?", rowMapper, id).stream().findFirst();
    }

    public List<Indicador> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY id_indicador", rowMapper);
    }
}
