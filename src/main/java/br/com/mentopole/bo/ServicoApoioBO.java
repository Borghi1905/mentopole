package br.com.mentopole.bo;

import java.net.URI;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import org.springframework.stereotype.Service;

import br.com.mentopole.dao.CategoriaServicoDAO;
import br.com.mentopole.dao.InstituicaoDAO;
import br.com.mentopole.dao.RegiaoDAO;
import br.com.mentopole.dao.ServicoApoioDAO;
import br.com.mentopole.model.ServicoApoio;

@Service
public class ServicoApoioBO {

    private static final String PRESENCIAL = "PRESENCIAL";
    private static final String VIRTUAL = "VIRTUAL";
    private static final Set<String> MODALIDADES = Set.of(PRESENCIAL, VIRTUAL);

    private static final int NOME_MAX = 150;
    private static final int ENDERECO_MAX = 250;
    private static final int TELEFONE_MAX = 20;
    private static final int HORARIO_MAX = 500;
    private static final int LINK_MAX = 500;

    private final ServicoApoioDAO servicoApoioDAO;
    private final InstituicaoDAO instituicaoDAO;
    private final CategoriaServicoDAO categoriaServicoDAO;
    private final RegiaoDAO regiaoDAO;

    public ServicoApoioBO(ServicoApoioDAO servicoApoioDAO,
                          InstituicaoDAO instituicaoDAO,
                          CategoriaServicoDAO categoriaServicoDAO,
                          RegiaoDAO regiaoDAO) {
        this.servicoApoioDAO = servicoApoioDAO;
        this.instituicaoDAO = instituicaoDAO;
        this.categoriaServicoDAO = categoriaServicoDAO;
        this.regiaoDAO = regiaoDAO;
    }

    public ServicoApoio inserir(ServicoApoio servico) {
        validar(servico);
        return servicoApoioDAO.inserir(servico);
    }

    public ServicoApoio alterar(Long id, ServicoApoio servico) {
        buscarPorId(id); // 404 se não existir
        validar(servico);

        servico.setIdServico(id);
        if (!servicoApoioDAO.alterar(servico)) {
            throw new NoSuchElementException("Serviço de apoio não encontrado: " + id);
        }
        return servico;
    }

    public void excluir(Long id) {
        buscarPorId(id); // 404 se não existir
        if (!servicoApoioDAO.excluir(id)) {
            throw new NoSuchElementException("Serviço de apoio não encontrado: " + id);
        }
    }

    public ServicoApoio buscarPorId(Long id) {
        return servicoApoioDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Serviço de apoio não encontrado: " + id));
    }

    public List<ServicoApoio> listarTodos() {
        return servicoApoioDAO.listarTodos();
    }


    private void validar(ServicoApoio servico) {
        if (servico == null) {
            throw new IllegalArgumentException("Dados do serviço de apoio não informados.");
        }
        if (servico.getNome() == null || servico.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do serviço é obrigatório.");
        }
        if (servico.getNome().trim().length() > NOME_MAX) {
            throw new IllegalArgumentException("Nome deve ter no máximo " + NOME_MAX + " caracteres.");
        }
        servico.setNome(servico.getNome().trim());

        validarModalidade(servico);
        validarCoordenadas(servico.getLatitude(), servico.getLongitude());

        if (servico.getTelefone() != null && servico.getTelefone().trim().length() > TELEFONE_MAX) {
            throw new IllegalArgumentException("Telefone deve ter no máximo " + TELEFONE_MAX + " caracteres.");
        }
        if (servico.getHorarioFuncionamento() != null
                && servico.getHorarioFuncionamento().length() > HORARIO_MAX) {
            throw new IllegalArgumentException("Horário de funcionamento deve ter no máximo " + HORARIO_MAX + " caracteres.");
        }

        validarAssociados(servico);
    }

    private void validarModalidade(ServicoApoio servico) {
        String modalidade = servico.getModalidade() == null ? null : servico.getModalidade().trim().toUpperCase();
        if (modalidade == null || !MODALIDADES.contains(modalidade)) {
            throw new IllegalArgumentException("Modalidade inválida. Use PRESENCIAL ou VIRTUAL.");
        }
        servico.setModalidade(modalidade);

        if (PRESENCIAL.equals(modalidade)) {
            if (servico.getEndereco() == null || servico.getEndereco().isBlank()) {
                throw new IllegalArgumentException("Endereço é obrigatório para serviço presencial.");
            }
            if (servico.getEndereco().trim().length() > ENDERECO_MAX) {
                throw new IllegalArgumentException("Endereço deve ter no máximo " + ENDERECO_MAX + " caracteres.");
            }
            if (servico.getRegiao() == null || servico.getRegiao().getIdRegiao() == null) {
                throw new IllegalArgumentException("Região é obrigatória para serviço presencial.");
            }
        } else {
            String link = servico.getLinkAtendimento();
            if (link == null || link.isBlank()) {
                throw new IllegalArgumentException("Link de atendimento é obrigatório para serviço virtual.");
            }
            if (link.trim().length() > LINK_MAX) {
                throw new IllegalArgumentException("Link deve ter no máximo " + LINK_MAX + " caracteres.");
            }
            try {
                URI uri = URI.create(link.trim());
                String esquema = uri.getScheme();
                if (uri.getHost() == null || esquema == null
                        || !(esquema.equalsIgnoreCase("http") || esquema.equalsIgnoreCase("https"))) {
                    throw new IllegalArgumentException("Link de atendimento deve ser uma URL http(s) válida.");
                }
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Link de atendimento deve ser uma URL http(s) válida.");
            }
            servico.setLinkAtendimento(link.trim());
        }
    }

    private void validarCoordenadas(Double latitude, Double longitude) {
        if (latitude == null && longitude == null) {
            return;
        }
        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Informe latitude e longitude juntas.");
        }
        if (latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException("Latitude deve estar entre -90 e 90.");
        }
        if (longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException("Longitude deve estar entre -180 e 180.");
        }
    }

    private void validarAssociados(ServicoApoio servico) {
        if (servico.getInstituicao() == null || servico.getInstituicao().getIdInstituicao() == null) {
            throw new IllegalArgumentException("Instituição é obrigatória.");
        }
        if (instituicaoDAO.buscarPorId(servico.getInstituicao().getIdInstituicao()).isEmpty()) {
            throw new IllegalArgumentException(
                    "Instituição não encontrada: " + servico.getInstituicao().getIdInstituicao());
        }

        if (servico.getCategoriaServico() == null || servico.getCategoriaServico().getIdTipoServico() == null) {
            throw new IllegalArgumentException("Categoria do serviço é obrigatória.");
        }
        if (categoriaServicoDAO.buscarPorId(servico.getCategoriaServico().getIdTipoServico()).isEmpty()) {
            throw new IllegalArgumentException(
                    "Categoria de serviço não encontrada: " + servico.getCategoriaServico().getIdTipoServico());
        }

        if (servico.getRegiao() != null) {
            if (servico.getRegiao().getIdRegiao() == null) {
                throw new IllegalArgumentException("Região informada sem identificador.");
            }
            if (regiaoDAO.buscarPorId(servico.getRegiao().getIdRegiao()).isEmpty()) {
                throw new IllegalArgumentException(
                        "Região não encontrada: " + servico.getRegiao().getIdRegiao());
            }
        }
    }
}
