package br.com.mentopole.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public class DadoTerritorial {

    private Long idDado;
    private BigDecimal valor;
    private String periodoReferencia;
    private LocalDateTime dataColeta;
    private LocalDateTime dataAtualizacao;
    private Regiao regiao;
    private Indicador indicador;
    private FonteDado fonteDado;

    public DadoTerritorial() {
    }

    public DadoTerritorial(Long idDado, BigDecimal valor, String periodoReferencia, LocalDateTime dataColeta, LocalDateTime dataAtualizacao, Regiao regiao, Indicador indicador, FonteDado fonteDado) {
        this.idDado = idDado;
        this.valor = valor;
        this.periodoReferencia = periodoReferencia;
        this.dataColeta = dataColeta;
        this.dataAtualizacao = dataAtualizacao;
        this.regiao = regiao;
        this.indicador = indicador;
        this.fonteDado = fonteDado;
    }

    public Long getIdDado() {
        return idDado;
    }

    public void setIdDado(Long idDado) {
        this.idDado = idDado;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getPeriodoReferencia() {
        return periodoReferencia;
    }

    public void setPeriodoReferencia(String periodoReferencia) {
        this.periodoReferencia = periodoReferencia;
    }

    public LocalDateTime getDataColeta() {
        return dataColeta;
    }

    public void setDataColeta(LocalDateTime dataColeta) {
        this.dataColeta = dataColeta;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public Regiao getRegiao() {
        return regiao;
    }

    public void setRegiao(Regiao regiao) {
        this.regiao = regiao;
    }

    public Indicador getIndicador() {
        return indicador;
    }

    public void setIndicador(Indicador indicador) {
        this.indicador = indicador;
    }

    public FonteDado getFonteDado() {
        return fonteDado;
    }

    public void setFonteDado(FonteDado fonteDado) {
        this.fonteDado = fonteDado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DadoTerritorial other = (DadoTerritorial) o;
        return idDado != null && Objects.equals(idDado, other.idDado);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idDado);
    }

    @Override
    public String toString() {
        return "DadoTerritorial{" +
                "idDado=" + idDado + ", " +
                "valor=" + valor + ", " +
                "periodoReferencia=" + periodoReferencia + ", " +
                "dataColeta=" + dataColeta + ", " +
                "dataAtualizacao=" + dataAtualizacao + ", " +
                "regiao=" + (regiao == null ? null : regiao.getIdRegiao()) + ", " +
                "indicador=" + (indicador == null ? null : indicador.getIdIndicador()) + ", " +
                "fonteDado=" + (fonteDado == null ? null : fonteDado.getIdFonte()) + "}";
    }
}
