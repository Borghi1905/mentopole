package br.com.mentopole.dto;

import br.com.mentopole.model.CategoriaProblema;
import br.com.mentopole.model.Regiao;

import java.time.LocalDateTime;

public class RelatoResponse {

    private Long idRelato;
    private String descricao;
    private Double latitude;
    private Double longitude;
    private LocalDateTime dataRelato;
    private String status;
    private Regiao regiao;
    private CategoriaProblema categoriaProblema;
    private String autorNome;
    private String validadorNome;

    public RelatoResponse() {
    }

    public RelatoResponse(Long idRelato, String descricao, Double latitude, Double longitude, LocalDateTime dataRelato, String status, Regiao regiao, CategoriaProblema categoriaProblema, String autorNome, String validadorNome) {
        this.idRelato = idRelato;
        this.descricao = descricao;
        this.latitude = latitude;
        this.longitude = longitude;
        this.dataRelato = dataRelato;
        this.status = status;
        this.regiao = regiao;
        this.categoriaProblema = categoriaProblema;
        this.autorNome = autorNome;
        this.validadorNome = validadorNome;
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

    public String getAutorNome() {
        return autorNome;
    }

    public void setAutorNome(String autorNome) {
        this.autorNome = autorNome;
    }

    public String getValidadorNome() {
        return validadorNome;
    }

    public void setValidadorNome(String validadorNome) {
        this.validadorNome = validadorNome;
    }
}
