package br.com.mentopole.dao;

import br.com.mentopole.model.CategoriaServico;
import br.com.mentopole.model.Instituicao;
import br.com.mentopole.model.ServicoApoio;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static br.com.mentopole.dao.DaoUtil.*;

@Repository
public class ServicoApoioDAO {

    private static final String SELECT =
            "SELECT s.id_servico, s.nome, s.modalidade, s.endereco, s.latitude, s.longitude, s.telefone, "
                    + "s.horario_funcionamento, s.link_atendimento, "
                    + "i.id_instituicao, i.nome AS inst_nome, i.tipo_instituicao, "
                    + "i.telefone AS inst_telefone, i.email AS inst_email, "
                    + "c.id_tipo_servico, c.nome AS cat_nome, c.descricao AS cat_descricao, "
                    + "r.id_regiao, r.nome AS reg_nome, r.bairro, r.cidade, r.estado, r.cep "
                    + "FROM SERVICO_APOIO s "
                    + "JOIN INSTITUICAO i ON i.id_instituicao = s.ID_INSTITUICAO "
                    + "JOIN CATEGORIA_SERVICO c ON c.id_tipo_servico = s.ID_TIPO_SERVICO "
                    + "LEFT JOIN REGIAO r ON r.id_regiao = s.ID_REGIAO";

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<ServicoApoio> rowMapper = (rs, rowNum) -> {
        Instituicao instituicao = new Instituicao();
        instituicao.setIdInstituicao(getLong(rs, "id_instituicao"));
        instituicao.setNome(rs.getString("inst_nome"));
        instituicao.setTipoInstituicao(rs.getString("tipo_instituicao"));
        instituicao.setTelefone(rs.getString("inst_telefone"));
        instituicao.setEmail(rs.getString("inst_email"));

        CategoriaServico categoria = new CategoriaServico(
                getLong(rs, "id_tipo_servico"), rs.getString("cat_nome"), rs.getString("cat_descricao"));

        return new ServicoApoio(
                getLong(rs, "id_servico"),
                rs.getString("nome"),
                rs.getString("modalidade"),
                rs.getString("endereco"),
                getDouble(rs, "latitude"),
                getDouble(rs, "longitude"),
                rs.getString("telefone"),
                rs.getString("horario_funcionamento"),
                rs.getString("link_atendimento"),
                instituicao,
                categoria,
                regiao(rs));
    };

    public ServicoApoioDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public ServicoApoio inserir(ServicoApoio servico) {
        String sql = "INSERT INTO SERVICO_APOIO (nome, modalidade, endereco, latitude, longitude, telefone, "
                + "horario_funcionamento, link_atendimento, ID_INSTITUICAO, "
                + "ID_TIPO_SERVICO, ID_REGIAO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        Long id = inserirRetornandoId(jdbcTemplate, sql, "ID_SERVICO", ps -> preencher(ps, servico));
        servico.setIdServico(id);
        return servico;
    }

    public boolean alterar(ServicoApoio servico) {
        String sql = "UPDATE SERVICO_APOIO SET nome = ?, modalidade = ?, endereco = ?, latitude = ?, longitude = ?, "
                + "telefone = ?, horario_funcionamento = ?, link_atendimento = ?, "
                + "ID_INSTITUICAO = ?, ID_TIPO_SERVICO = ?, ID_REGIAO = ? "
                + "WHERE id_servico = ?";
        return jdbcTemplate.update(sql, ps -> {
            preencher(ps, servico);
            setLong(ps, 12, servico.getIdServico());
        }) > 0;
    }

    public boolean excluir(Long id) {
        return excluirPorId(jdbcTemplate, "DELETE FROM SERVICO_APOIO WHERE id_servico = ?", id);
    }

    public Optional<ServicoApoio> buscarPorId(Long id) {
        return jdbcTemplate.query(SELECT + " WHERE s.id_servico = ?", rowMapper, id).stream().findFirst();
    }

    public List<ServicoApoio> listarTodos() {
        return jdbcTemplate.query(SELECT + " ORDER BY s.id_servico", rowMapper);
    }

    public boolean existePorInstituicao(Long idInstituicao) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM SERVICO_APOIO WHERE ID_INSTITUICAO = ?", idInstituicao);
    }

    public boolean existePorCategoria(Long idCategoria) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM SERVICO_APOIO WHERE ID_TIPO_SERVICO = ?", idCategoria);
    }

    public boolean existePorRegiao(Long idRegiao) {
        return existe(jdbcTemplate, "SELECT COUNT(*) FROM SERVICO_APOIO WHERE ID_REGIAO = ?", idRegiao);
    }

    private void preencher(java.sql.PreparedStatement ps, ServicoApoio s) throws java.sql.SQLException {
        ps.setString(1, s.getNome());
        ps.setString(2, s.getModalidade());
        ps.setString(3, s.getEndereco());
        setDouble(ps, 4, s.getLatitude());
        setDouble(ps, 5, s.getLongitude());
        ps.setString(6, s.getTelefone());
        ps.setString(7, s.getHorarioFuncionamento());
        ps.setString(8, s.getLinkAtendimento());
        setLong(ps, 9, s.getInstituicao() == null ? null : s.getInstituicao().getIdInstituicao());
        setLong(ps, 10, s.getCategoriaServico() == null ? null : s.getCategoriaServico().getIdTipoServico());
        setLong(ps, 11, s.getRegiao() == null ? null : s.getRegiao().getIdRegiao());
    }
}