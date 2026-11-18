package br.com.mentopole.bo;

import br.com.mentopole.dao.DadoTerritorialDAO;
import br.com.mentopole.dao.FonteDadoDAO;
import br.com.mentopole.dao.IndicadorDAO;
import br.com.mentopole.dao.RegiaoDAO;
import br.com.mentopole.model.DadoTerritorial;
import br.com.mentopole.model.FonteDado;
import br.com.mentopole.model.Indicador;
import br.com.mentopole.model.Regiao;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DadoTerritorialBO {

    private static final String REGEX_PERIODO =
            "^\\d{4}(-(0[1-9]|1[0-2])|-T[1-4]|-S[1-2])?$";

    private final DadoTerritorialDAO dadoTerritorialDAO;
    private final RegiaoDAO regiaoDAO;
    private final IndicadorDAO indicadorDAO;
    private final FonteDadoDAO fonteDadoDAO;

    public DadoTerritorialBO(DadoTerritorialDAO dadoTerritorialDAO,
                             RegiaoDAO regiaoDAO,
                             IndicadorDAO indicadorDAO,
                             FonteDadoDAO fonteDadoDAO) {
        this.dadoTerritorialDAO = dadoTerritorialDAO;
        this.regiaoDAO = regiaoDAO;
        this.indicadorDAO = indicadorDAO;
        this.fonteDadoDAO = fonteDadoDAO;
    }

    public DadoTerritorial inserir(DadoTerritorial dado) {
        validar(dado);
        dado.setIdDado(null);
        dado.setDataAtualizacao(null);
        return dadoTerritorialDAO.inserir(dado);
    }

    public DadoTerritorial alterar(Long id, DadoTerritorial dado) {
        DadoTerritorial atual = buscarPorId(id);
        if (dado != null && dado.getDataColeta() == null) {
            dado.setDataColeta(atual.getDataColeta());
        }
        validar(dado);
        dado.setIdDado(id);
        dado.setDataAtualizacao(LocalDateTime.now());
        if (!dadoTerritorialDAO.alterar(dado)) {
            throw new NoSuchElementException("Dado territorial não encontrado: " + id);
        }
        return dado;
    }

    public void excluir(Long id) {
        buscarPorId(id);
        if (!dadoTerritorialDAO.excluir(id)) {
            throw new NoSuchElementException("Dado territorial não encontrado: " + id);
        }
    }

    public DadoTerritorial buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("O id do dado territorial é obrigatório.");
        }
        return dadoTerritorialDAO.buscarPorId(id)
                .orElseThrow(() -> new NoSuchElementException("Dado territorial não encontrado: " + id));
    }

    public List<DadoTerritorial> listarTodos() {
        return dadoTerritorialDAO.listarTodos();
    }


    private void validar(DadoTerritorial dado) {
        if (dado == null) {
            throw new IllegalArgumentException("Os dados territoriais são obrigatórios.");
        }
        if (dado.getValor() == null) {
            throw new IllegalArgumentException("O valor do dado territorial é obrigatório.");
        }

        String periodo = dado.getPeriodoReferencia() == null ? null : dado.getPeriodoReferencia().trim();
        dado.setPeriodoReferencia(periodo);
        validarPeriodoReferencia(periodo);

        validarDatas(dado);
        validarAssociados(dado);
    }

    private void validarPeriodoReferencia(String periodoReferencia) {
        if (periodoReferencia == null || periodoReferencia.isEmpty()) {
            throw new IllegalArgumentException("O período de referência é obrigatório.");
        }
        if (!periodoReferencia.matches(REGEX_PERIODO)) {
            throw new IllegalArgumentException(
                    "Período de referência inválido. Use AAAA, AAAA-MM, AAAA-T1..T4 ou AAAA-S1..S2.");
        }
    }

    private void validarDatas(DadoTerritorial dado) {
        LocalDateTime agora = LocalDateTime.now();

        if (dado.getDataColeta() == null) {
            throw new IllegalArgumentException("A data de coleta é obrigatória.");
        }
        if (dado.getDataColeta().isAfter(agora)) {
            throw new IllegalArgumentException("A data de coleta não pode estar no futuro.");
        }
        if (dado.getDataAtualizacao() != null) {
            if (dado.getDataAtualizacao().isBefore(dado.getDataColeta())) {
                throw new IllegalArgumentException(
                        "A data de atualização não pode ser anterior à data de coleta.");
            }
            if (dado.getDataAtualizacao().isAfter(agora)) {
                throw new IllegalArgumentException("A data de atualização não pode estar no futuro.");
            }
        }
    }

    private void validarAssociados(DadoTerritorial dado) {
        Regiao regiao = dado.getRegiao();
        Indicador indicador = dado.getIndicador();
        FonteDado fonte = dado.getFonteDado();

        if (regiao == null || regiao.getIdRegiao() == null) {
            throw new IllegalArgumentException("A região do dado territorial é obrigatória.");
        }
        if (indicador == null || indicador.getIdIndicador() == null) {
            throw new IllegalArgumentException("O indicador do dado territorial é obrigatório.");
        }
        if (fonte == null || fonte.getIdFonte() == null) {
            throw new IllegalArgumentException(
                    "A fonte do dado é obrigatória: todo indicador oficial deve exibir fonte e período.");
        }

        dado.setRegiao(regiaoDAO.buscarPorId(regiao.getIdRegiao())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Região não encontrada: " + regiao.getIdRegiao())));
        dado.setIndicador(indicadorDAO.buscarPorId(indicador.getIdIndicador())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Indicador não encontrado: " + indicador.getIdIndicador())));
        dado.setFonteDado(fonteDadoDAO.buscarPorId(fonte.getIdFonte())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Fonte de dado não encontrada: " + fonte.getIdFonte())));
    }
}
