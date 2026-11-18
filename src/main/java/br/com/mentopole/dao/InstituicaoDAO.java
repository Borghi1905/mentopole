package br.com.mentopole.dao;

import br.com.mentopole.model.Instituicao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class InstituicaoDAO {

    private static final String SELECT =
            "SELECT i.id_instituicao, i.nome, i.tipo_instituicao, i.telefone, i.email, "
                    + "u.id_usuario AS usu_id, u.nome AS usu_nome "
                    + "FROM INSTITUICAO i "
                    + "JOIN USUARIO u ON u.id_usuario = i.ID_USUARIO";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Instituicao> rowMapper = (rs, rowNum) -> new Instituicao(
            getLong(rs, "id_instituicao"),
            rs.getString("nome"),
            rs.getString("tipo_instituicao"),
            rs.getString("telefone"),
            rs.getString("email"),
            usuarioResumido(rs, "usu_id", "usu_nome"));

    public InstituicaoDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Instituicao inserir(Instituicao instituicao) {
        String sql = "INSERT INTO INSTITUICAO (nome, tipo_instituicao, telefone, email, ID_USUARIO) "
                + "VALUES (?, ?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_INSTITUICAO", ps -> {
            ps.setString(1, instituicao.getNome());
            ps.setString(2, instituicao.getTipoInstituicao());
            ps.setString(3, instituicao.getTelefone());
            ps.setString(4, instituicao.getEmail());
            setLong(ps, 5, instituicao.getUsuario() == null ? null : instituicao.getUsuario().getIdUsuario());
        });
        instituicao.setIdInstituicao(id);
        return instituicao;
    }

    public boolean alterar(Instituicao instituicao) {
        String sql = "UPDATE INSTITUICAO SET nome = ?, tipo_instituicao = ?, telefone = ?, email = ?, "
                + "ID_USUARIO = ? WHERE id_instituicao = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, instituicao.getNome());
            ps.setString(2, instituicao.getTipoInstituicao());
            ps.setString(3, instituicao.getTelefone());
            ps.setString(4, instituicao.getEmail());
            setLong(ps, 5, instituicao.getUsuario() == null ? null : instituicao.getUsuario().getIdUsuario());
            setLong(ps, 6, instituicao.getIdInstituicao());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM INSTITUICAO WHERE id_instituicao = ?", id);
    }

    public Optional<Instituicao> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE i.id_instituicao = ?", rowMapper, id).stream().findFirst();
    }

    public List<Instituicao> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY i.id_instituicao", rowMapper);
    }

    public boolean existePorUsuario(Long idUsuario) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM INSTITUICAO WHERE ID_USUARIO = ?", idUsuario);
    }
}