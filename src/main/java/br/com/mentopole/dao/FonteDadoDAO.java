package br.com.mentopole.dao;

import br.com.mentopole.model.FonteDado;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class FonteDadoDAO {

    private static final String SELECT =
            "SELECT id_fonte, nome, descricao, url, data_consulta FROM FONTE_DADO";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<FonteDado> rowMapper = (rs, rowNum) -> new FonteDado(
            getLong(rs, "id_fonte"),
            rs.getString("nome"),
            rs.getString("descricao"),
            rs.getString("url"),
            getDateTime(rs, "data_consulta"));

    public FonteDadoDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public FonteDado inserir(FonteDado fonte) {
        String sql = "INSERT INTO FONTE_DADO (nome, descricao, url, data_consulta) VALUES (?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_FONTE", ps -> {
            ps.setString(1, fonte.getNome());
            ps.setString(2, fonte.getDescricao());
            ps.setString(3, fonte.getUrl());
            setDateTime(ps, 4, fonte.getDataConsulta());
        });
        fonte.setIdFonte(id);
        return fonte;
    }

    public boolean alterar(FonteDado fonte) {
        String sql = "UPDATE FONTE_DADO SET nome = ?, descricao = ?, url = ?, data_consulta = ? WHERE id_fonte = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, fonte.getNome());
            ps.setString(2, fonte.getDescricao());
            ps.setString(3, fonte.getUrl());
            setDateTime(ps, 4, fonte.getDataConsulta());
            setLong(ps, 5, fonte.getIdFonte());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM FONTE_DADO WHERE id_fonte = ?", id);
    }

    public Optional<FonteDado> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE id_fonte = ?", rowMapper, id).stream().findFirst();
    }

    public List<FonteDado> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY id_fonte", rowMapper);
    }
}
