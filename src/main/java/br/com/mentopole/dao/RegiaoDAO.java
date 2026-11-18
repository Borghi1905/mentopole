package br.com.mentopole.dao;

import br.com.mentopole.model.Regiao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class RegiaoDAO {

    private static final String SELECT =
            "SELECT id_regiao, nome AS reg_nome, bairro, cidade, estado, cep FROM REGIAO";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Regiao> rowMapper = (rs, rowNum) -> regiao(rs);

    public RegiaoDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Regiao inserir(Regiao regiao) {
        String sql = "INSERT INTO REGIAO (nome, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_REGIAO", ps -> {
            ps.setString(1, regiao.getNome());
            ps.setString(2, regiao.getBairro());
            ps.setString(3, regiao.getCidade());
            ps.setString(4, regiao.getEstado());
            ps.setString(5, regiao.getCep());
        });
        regiao.setIdRegiao(id);
        return regiao;
    }

    public boolean alterar(Regiao regiao) {
        String sql = "UPDATE REGIAO SET nome = ?, bairro = ?, cidade = ?, estado = ?, cep = ? WHERE id_regiao = ?";
        return jdbcTemplate.update(sql, ps -> {
            ps.setString(1, regiao.getNome());
            ps.setString(2, regiao.getBairro());
            ps.setString(3, regiao.getCidade());
            ps.setString(4, regiao.getEstado());
            ps.setString(5, regiao.getCep());
            setLong(ps, 6, regiao.getIdRegiao());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM REGIAO WHERE id_regiao = ?", id);
    }

    public Optional<Regiao> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE id_regiao = ?", rowMapper, id).stream().findFirst();
    }

    public List<Regiao> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY id_regiao", rowMapper);
    }
}
