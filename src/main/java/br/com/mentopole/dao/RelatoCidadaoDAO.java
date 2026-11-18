package br.com.mentopole.dao;

import br.com.mentopole.model.CategoriaProblema;
import br.com.mentopole.model.RelatoCidadao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class RelatoCidadaoDAO {

    private static final String SELECT =
            "SELECT rc.id_relato, rc.descricao, rc.latitude, rc.longitude, rc.data_relato, rc.status, "
                    + "r.id_regiao, r.nome AS reg_nome, r.bairro, r.cidade, r.estado, r.cep, "
                    + "cp.id_categoria, cp.nome AS cat_nome, cp.descricao AS cat_descricao, "
                    + "a.id_usuario AS autor_id, a.nome AS autor_nome, "
                    + "v.id_usuario AS val_id, v.nome AS val_nome "
                    + "FROM RELATO_CIDADAO rc "
                    + "JOIN REGIAO r ON r.id_regiao = rc.ID_REGIAO "
                    + "JOIN CATEGORIA_PROBLEMA cp ON cp.id_categoria = rc.ID_CATEGORIA "
                    + "JOIN USUARIO a ON a.id_usuario = rc.ID_USUARIO_AUTOR "
                    + "LEFT JOIN USUARIO v ON v.id_usuario = rc.ID_USUARIO_VALIDADOR";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<RelatoCidadao> rowMapper = (rs, rowNum) -> new RelatoCidadao(
            getLong(rs, "id_relato"),
            rs.getString("descricao"),
            getDouble(rs, "latitude"),
            getDouble(rs, "longitude"),
            getDateTime(rs, "data_relato"),
            rs.getString("status"),
            regiao(rs),
            new CategoriaProblema(getLong(rs, "id_categoria"), rs.getString("cat_nome"), rs.getString("cat_descricao")),
            usuarioResumido(rs, "autor_id", "autor_nome"),
            usuarioResumido(rs, "val_id", "val_nome"));

    public RelatoCidadaoDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public RelatoCidadao inserir(RelatoCidadao relato) {
        String sql = "INSERT INTO RELATO_CIDADAO (descricao, latitude, longitude, data_relato, status, "
                + "ID_REGIAO, ID_CATEGORIA, ID_USUARIO_AUTOR, ID_USUARIO_VALIDADOR) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_RELATO", ps -> {
            ps.setString(1, relato.getDescricao());
            setDouble(ps, 2, relato.getLatitude());
            setDouble(ps, 3, relato.getLongitude());
            setDateTime(ps, 4, relato.getDataRelato());
            ps.setString(5, relato.getStatus());
            setLong(ps, 6, relato.getRegiao() == null ? null : relato.getRegiao().getIdRegiao());
            setLong(ps, 7, relato.getCategoriaProblema() == null ? null : relato.getCategoriaProblema().getIdCategoria());
            setLong(ps, 8, relato.getAutor() == null ? null : relato.getAutor().getIdUsuario());
            setLong(ps, 9, relato.getValidador() == null ? null : relato.getValidador().getIdUsuario());
        });
        relato.setIdRelato(id);
        return relato;
    }

    public boolean alterar(RelatoCidadao relato) {
        String sql = "UPDATE RELATO_CIDADAO SET descricao = ?, latitude = ?, longitude = ?, status = ?, "
                + "ID_REGIAO = ?, ID_CATEGORIA = ?, ID_USUARIO_VALIDADOR = ? "
                + "WHERE id_relato = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, relato.getDescricao());
            setDouble(ps, 2, relato.getLatitude());
            setDouble(ps, 3, relato.getLongitude());
            ps.setString(4, relato.getStatus());
            setLong(ps, 5, relato.getRegiao() == null ? null : relato.getRegiao().getIdRegiao());
            setLong(ps, 6, relato.getCategoriaProblema() == null ? null : relato.getCategoriaProblema().getIdCategoria());
            setLong(ps, 7, relato.getValidador() == null ? null : relato.getValidador().getIdUsuario());
            setLong(ps, 8, relato.getIdRelato());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM RELATO_CIDADAO WHERE id_relato = ?", id);
    }

    public Optional<RelatoCidadao> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE rc.id_relato = ?", rowMapper, id).stream().findFirst();
    }

    public List<RelatoCidadao> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY rc.id_relato", rowMapper);
    }

    public boolean existePorUsuario(Long idUsuario) {
        Integer total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM RELATO_CIDADAO WHERE ID_USUARIO_AUTOR = ? OR ID_USUARIO_VALIDADOR = ?",
                Integer.class, idUsuario, idUsuario);
        return total != null && total > 0;
    }

    public boolean existePorRegiao(Long idRegiao) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM RELATO_CIDADAO WHERE ID_REGIAO = ?", idRegiao);
    }

    public boolean existePorCategoria(Long idCategoria) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM RELATO_CIDADAO WHERE ID_CATEGORIA = ?", idCategoria);
    }
}