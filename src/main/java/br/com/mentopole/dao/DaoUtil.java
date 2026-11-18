package br.com.mentopole.dao;

import br.com.mentopole.model.Regiao;
import br.com.mentopole.model.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDateTime;

final class DaoUtil {

    private DaoUtil() {
    }



    static Long getLong(ResultSet rs, String coluna) throws SQLException {
        long v = rs.getLong(coluna);
        return rs.wasNull() ? null : v;
    }

    static Double getDouble(ResultSet rs, String coluna) throws SQLException {
        double v = rs.getDouble(coluna);
        return rs.wasNull() ? null : v;
    }

    static LocalDateTime getDateTime(ResultSet rs, String coluna) throws SQLException {
        Timestamp t = rs.getTimestamp(coluna);
        return t == null ? null : t.toLocalDateTime();
    }

    static Usuario usuarioResumido(ResultSet rs, String colunaId, String colunaNome) throws SQLException {
        Long id = getLong(rs, colunaId);
        if (id == null) {
            return null;
        }
        Usuario u = new Usuario();
        u.setIdUsuario(id);
        u.setNome(rs.getString(colunaNome));
        return u;
    }

    static Regiao regiao(ResultSet rs) throws SQLException {
        Long id = getLong(rs, "id_regiao");
        if (id == null) {
            return null;
        }
        return new Regiao(id, rs.getString("reg_nome"), rs.getString("bairro"),
                rs.getString("cidade"), rs.getString("estado"), rs.getString("cep"));
    }


    static void setLong(PreparedStatement ps, int i, Long v) throws SQLException {
        if (v == null) {
            ps.setNull(i, Types.NUMERIC);
        } else {
            ps.setLong(i, v);
        }
    }

    static void setDouble(PreparedStatement ps, int i, Double v) throws SQLException {
        if (v == null) {
            ps.setNull(i, Types.NUMERIC);
        } else {
            ps.setDouble(i, v);
        }
    }

    static void setBigDecimal(PreparedStatement ps, int i, BigDecimal v) throws SQLException {
        if (v == null) {
            ps.setNull(i, Types.NUMERIC);
        } else {
            ps.setBigDecimal(i, v);
        }
    }

    static void setDateTime(PreparedStatement ps, int i, LocalDateTime v) throws SQLException {
        if (v == null) {
            ps.setNull(i, Types.TIMESTAMP);
        } else {
            ps.setTimestamp(i, Timestamp.valueOf(v));
        }
    }

    static Long inserirRetornandoId(JdbcTemplate jdbc, String sql, String colunaId, PreparedStatementSetter setter) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, new String[]{colunaId});
            setter.setValues(ps);
            return ps;
        }, keyHolder);
        Number key = keyHolder.getKey();
        return key == null ? null : key.longValue();
    }

    static boolean excluirPorId(JdbcTemplate jdbc, String sql, Long id) {
        return jdbc.update(sql, id) > 0;
    }

    static boolean existe(JdbcTemplate jdbc, String sql, Long id) {
        Integer total = jdbc.queryForObject(sql, Integer.class, id);
        return total != null && total > 0;
    }
}
