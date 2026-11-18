package br.com.mentopole.dao;

import br.com.mentopole.model.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class UsuarioDAO {

    private static final String SELECT =
            "SELECT id_usuario, nome, email, senha_hash, tipo_usuario, data_cadastro FROM USUARIO";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Usuario> rowMapper = (rs, rowNum) -> new Usuario(
            getLong(rs, "id_usuario"),
            rs.getString("nome"),
            rs.getString("email"),
            rs.getString("senha_hash"),
            rs.getString("tipo_usuario"),
            getDateTime(rs, "data_cadastro"));

    public UsuarioDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Usuario inserir(Usuario usuario) {
        String sql = "INSERT INTO USUARIO (nome, email, senha_hash, tipo_usuario, data_cadastro) VALUES (?, ?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_USUARIO", ps -> {
            ps.setString(1, usuario.getNome());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, usuario.getSenhaHash());
            ps.setString(4, usuario.getTipoUsuario());
            setDateTime(ps, 5, usuario.getDataCadastro());
        });
        usuario.setIdUsuario(id);
        return usuario;
    }

    public boolean alterar(Usuario usuario) {
        String sql = "UPDATE USUARIO SET nome = ?, email = ?, senha_hash = ?, tipo_usuario = ? WHERE id_usuario = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, usuario.getNome());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, usuario.getSenhaHash());
            ps.setString(4, usuario.getTipoUsuario());
            setLong(ps, 5, usuario.getIdUsuario());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM USUARIO WHERE id_usuario = ?", id);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE id_usuario = ?", rowMapper, id).stream().findFirst();
    }

    public List<Usuario> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY id_usuario", rowMapper);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return jdbcTemplate.query(SELECT + " WHERE LOWER(email) = LOWER(?)", rowMapper, email).stream().findFirst();
    }
}
