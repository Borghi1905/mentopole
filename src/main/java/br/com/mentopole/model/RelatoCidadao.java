package br.com.mentopole.model;

import java.time.LocalDateTime;
import java.util.Objects;

public class RelatoCidadao {

    private Long idRelato;
    private String descricao;
    private Double latitude;
    private Double longitude;
    private LocalDateTime dataRelato;
    private String status;
    private Regiao regiao;
    private CategoriaProblema categoriaProblema;
    private Usuario autor;
    private Usuario validador;

    public RelatoCidadao() {
    }

    public RelatoCidadao(Long idRelato, String descricao, Double latitude, Double longitude, LocalDateTime dataRelato, String status, Regiao regiao, CategoriaProblema categoriaProblema, Usuario autor, Usuario validador) {
        this.idRelato = idRelato;
        this.descricao = descricao;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dataRelato = dataRelato;
        this.status = status;
        this.regiao = regiao;
        this.categoriaProblema = categoriaProblema;
        this.autor = autor;
        this.validador = validador;
    }

    public Long getIdRelato() {
        return idRelato;
    }

    public void setIdRelato(Long idRelato) {
        this.idRelato = idRelato;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getDataRelato() {
        return dataRelato;
    }

    public void setDataRelato(LocalDateTime dataRelato) {
        this.dataRelato = dataRelato;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Regiao getRegiao() {
        return regiao;
    }

    public void setRegiao(Regiao regiao) {
        this.regiao = regiao;
    }

    public CategoriaProblema getCategoriaProblema() {
        return categoriaProblema;
    }

    public void setCategoriaProblema(CategoriaProblema categoriaProblema) {
        this.categoriaProblema = categoriaProblema;
    }

    public Usuario getAutor() {
        return autor;
    }

    public void setAutor(Usuario autor) {
        this.autor = autor;
    }

    public Usuario getValidador() {
        return validador;
    }

    public void setValidador(Usuario validador) {
        this.validador = validador;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RelatoCidadao other = (RelatoCidadao) o;
        return idRelato != null && Objects.equals(idRelato, other.idRelato);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRelato);
    }

    @Override
    public String toString() {
        return "RelatoCidadao{" +
                "idRelato=" + idRelato + ", " +
                "descricao=" + descricao + ", " +
                "latitude=" + latitude + ", " +
                "longitude=" + longitude + ", " +
                "dataRelato=" + dataRelato + ", " +
                "status=" + status + ", " +
                "regiao=" + (regiao == null ? null : regiao.getIdRegiao()) + ", " +
                "categoriaProblema=" + (categoriaProblema == null ? null : categoriaProblema.getIdCategoria()) + ", " +
                "autor=" + (autor == null ? null : autor.getIdUsuario()) + ", " +
                "validador=" + (validador == null ? null : validador.getIdUsuario()) + "}";
    }
}
