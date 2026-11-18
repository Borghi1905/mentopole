package br.com.mentopole.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class FonteDado {

    private Long idFonte;
    private String nome;
    private String descricao;
    private String url;
    private LocalDateTime dataConsulta;

    public FonteDado() {
    }

    public FonteDado(Long idFonte, String nome, String descricao, String url, LocalDateTime dataConsulta) {
        this.idFonte = idFonte;
        this.nome = nome;
        this.descricao = descricao;
        this.url = url;
        this.dataConsulta = dataConsulta;
    }

    public Long getIdFonte() {
        return idFonte;
    }

    public void setIdFonte(Long idFonte) {
        this.idFonte = idFonte;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public LocalDateTime getDataConsulta() {
        return dataConsulta;
    }

    public void setDataConsulta(LocalDateTime dataConsulta) {
        this.dataConsulta = dataConsulta;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FonteDado other = (FonteDado) o;
        return idFonte != null && Objects.equals(idFonte, other.idFonte);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idFonte);
    }

    @Override
    public String toString() {
        return "FonteDado{" +
                "idFonte=" + idFonte + ", " +
                "nome=" + nome + ", " +
                "descricao=" + descricao + ", " +
                "url=" + url + ", " +
                "dataConsulta=" + dataConsulta + "}";
    }
}
