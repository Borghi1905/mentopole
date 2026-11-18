package br.com.mentopole.dao;

import br.com.mentopole.model.DadoTerritorial;
import br.com.mentopole.model.FonteDado;
import br.com.mentopole.model.Indicador;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class DadoTerritorialDAO {

    private static final String SELECT =
            "SELECT d.id_dado, d.valor, d.periodo_referencia, d.data_coleta, d.data_atualizacao, "
                    + "r.id_regiao, r.nome AS reg_nome, r.bairro, r.cidade, r.estado, r.cep, "
                    + "i.id_indicador, i.nome AS ind_nome, i.descricao AS ind_descricao, i.categoria, i.unidade_medida, "
                    + "f.id_fonte, f.nome AS fonte_nome, f.descricao AS fonte_descricao, f.url, f.data_consulta "
                    + "FROM DADO_TERRITORIAL d "
                    + "JOIN REGIAO r ON r.id_regiao = d.ID_REGIAO "
                    + "JOIN INDICADOR i ON i.id_indicador = d.ID_INDICADOR "
                    + "JOIN FONTE_DADO f ON f.id_fonte = d.ID_FONTE";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<DadoTerritorial> rowMapper = (rs, rowNum) -> new DadoTerritorial(
            getLong(rs, "id_dado"),
            rs.getBigDecimal("valor"),
            rs.getString("periodo_referencia"),
            getDateTime(rs, "data_coleta"),
            getDateTime(rs, "data_atualizacao"),
            regiao(rs),
            new Indicador(getLong(rs, "id_indicador"), rs.getString("ind_nome"), rs.getString("ind_descricao"),
                    rs.getString("categoria"), rs.getString("unidade_medida")),
            new FonteDado(getLong(rs, "id_fonte"), rs.getString("fonte_nome"), rs.getString("fonte_descricao"),
                    rs.getString("url"), getDateTime(rs, "data_consulta")));

    public DadoTerritorialDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public DadoTerritorial inserir(DadoTerritorial dado) {
        String sql = "INSERT INTO DADO_TERRITORIAL (valor, periodo_referencia, data_coleta, data_atualizacao, "
                + "ID_REGIAO, ID_INDICADOR, ID_FONTE) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_DADO", ps -> preencher(ps, dado));
        dado.setIdDado(id);
        return dado;
    }

    public boolean alterar(DadoTerritorial dado) {
        String sql = "UPDATE DADO_TERRITORIAL SET valor = ?, periodo_referencia = ?, data_coleta = ?, "
                + "data_atualizacao = ?, ID_REGIAO = ?, ID_INDICADOR = ?, ID_FONTE = ? "
                + "WHERE id_dado = ?";
        return jdbcTemplate.update(sql, ps -> {
            preencher(ps, dado);
            setLong(ps, 8, dado.getIdDado());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM DADO_TERRITORIAL WHERE id_dado = ?", id);
    }

    public Optional<DadoTerritorial> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE d.id_dado = ?", rowMapper, id).stream().findFirst();
    }

    public List<DadoTerritorial> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY d.id_dado", rowMapper);
    }

    public boolean existePorRegiao(Long idRegiao) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM DADO_TERRITORIAL WHERE ID_REGIAO = ?", idRegiao);
    }

    public boolean existePorIndicador(Long idIndicador) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM DADO_TERRITORIAL WHERE ID_INDICADOR = ?", idIndicador);
    }

    public boolean existePorFonte(Long idFonte) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM DADO_TERRITORIAL WHERE ID_FONTE = ?", idFonte);
    }

    private void preencher(java.sql.PreparedStatement ps, DadoTerritorial d) throws java.sql.SQLException {
        setBigDecimal(ps, 1, d.getValor());
        ps.setString(2, d.getPeriodoReferencia());
        setDateTime(ps, 3, d.getDataColeta());
        setDateTime(ps, 4, d.getDataAtualizacao());
        setLong(ps, 5, d.getRegiao() == null ? null : d.getRegiao().getIdRegiao());
        setLong(ps, 6, d.getIndicador() == null ? null : d.getIndicador().getIdIndicador());
        setLong(ps, 7, d.getFonteDado() == null ? null : d.getFonteDado().getIdFonte());
    }
}