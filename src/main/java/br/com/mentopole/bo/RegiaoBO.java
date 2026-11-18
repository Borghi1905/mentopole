package br.com.mentopole.bo;

import br.com.mentopole.dao.DadoTerritorialDAO;
import br.com.mentopole.dao.RegiaoDAO;
import br.com.mentopole.dao.RelatoCidadaoDAO;
import br.com.mentopole.dao.ServicoApoioDAO;
import br.com.mentopole.model.Regiao;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RegiaoBO {

    private static final String REGEX_CEP = "^\\d{5}-?\\d{3}$";
    private static final String REGEX_UF = "^[A-Za-z]{2}$";

    private final RegiaoDAO regiaoDAO;
    private final RelatoCidadaoDAO relatoCidadaoDAO;
    private final DadoTerritorialDAO dadoTerritorialDAO;
    private final ServicoApoioDAO servicoApoioDAO;

    public RegiaoBO(RegiaoDAO regiaoDAO,
                    RelatoCidadaoDAO relatoCidadaoDAO,
                    DadoTerritorialDAO dadoTerritorialDAO,
                    ServicoApoioDAO servicoApoioDAO) {
        this.regiaoDAO = regiaoDAO;
        this.relatoCidadaoDAO = relatoCidadaoDAO;
        this.dadoTerritorialDAO = dadoTerritorialDAO;
        this.servicoApoioDAO = servicoApoioDAO;
    }

    public Regiao inserir(Regiao regiao) {
        validar(regiao);
        regiao.setIdRegiao(null);
        return regiaoDAO.inserir(regiao);
    }

    public Regiao alterar(Long id, Regiao regiao) {
        buscarPorId(id);
        validar(regiao);
        regiao.setIdRegiao(id);
        if (!regiaoDAO.alterar(regiao)) {
            throw new NoSuchElementException("Região não encontrada: " + id);
        }
        return regiao;
    }

    public void excluir(Long id) {
        buscarPorId(id);
        verificarDependencias(id);
        if (!regiaoDAO.excluir(id)) {
            throw new NoSuchElementException("Região não encontrada: " + id);
        }
    }

    public Regiao buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O id da região é obrigatório.");
        }
        return regiaoDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Região não encontrada: " + id));
    }

    public List<Regiao> listarTodos() {
        return regiaoDAO.listarTodos();
    }


    private void validar(Regiao regiao) {
        if (regiao == null) {
            throw new IllegalArgumentException("Os dados da região são obrigatórios.");
        }

        regiao.setNome(normalizar(regiao.getNome()));
        regiao.setBairro(normalizar(regiao.getBairro()));
        regiao.setCidade(normalizar(regiao.getCidade()));
        regiao.setEstado(normalizar(regiao.getEstado()));
        regiao.setCep(normalizar(regiao.getCep()));

        if (regiao.getNome() == null) {
            throw new IllegalArgumentException("O nome da região é obrigatório.");
        }
        if (regiao.getNome().length() > 255) {
            throw new IllegalArgumentException("O nome da região deve ter no máximo 255 caracteres.");
        }
        if (regiao.getBairro() != null && regiao.getBairro().length() > 255) {
            throw new IllegalArgumentException("O bairro deve ter no máximo 255 caracteres.");
        }
        if (regiao.getCidade() == null) {
            throw new IllegalArgumentException("A cidade é obrigatória.");
        }
        if (regiao.getCidade().length() > 255) {
            throw new IllegalArgumentException("A cidade deve ter no máximo 255 caracteres.");
        }
        if (regiao.getEstado() == null) {
            throw new IllegalArgumentException("O estado é obrigatório.");
        }
        if (!regiao.getEstado().matches(REGEX_UF)) {
            throw new IllegalArgumentException("O estado deve ser a sigla da UF com 2 letras (ex.: SP).");
        }
        regiao.setEstado(regiao.getEstado().toUpperCase());

        validarCep(regiao.getCep());
    }

    private void validarCep(String cep) {
        if (cep == null) {
            return;
        }
        if (!cep.matches(REGEX_CEP)) {
            throw new IllegalArgumentException("CEP inválido. Use o formato 00000-000 ou 00000000.");
        }
    }

    private void verificarDependencias(Long id) {
        if (relatoCidadaoDAO.existePorRegiao(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir a região: existem relatos associados a ela.");
        }
        if (dadoTerritorialDAO.existePorRegiao(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir a região: existem dados territoriais associados a ela.");
        }
        if (servicoApoioDAO.existePorRegiao(id)) {
            throw new DataIntegrityViolationException(
                    "Não é possível excluir a região: existem serviços de apoio associados a ela.");
        }
    }

    private String normalizar(String valor) {
        if (valor == null) {
            return null;
        }
        String s = valor.trim();
        return s.isEmpty() ? null : s;
    }
}
