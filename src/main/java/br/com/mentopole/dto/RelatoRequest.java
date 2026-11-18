package br.com.mentopole.dto;

public class RelatoRequest {

    private String descricao;
    private Double latitude;
    private Double longitude;
    private Long idRegiao;
    private Long idCategoriaProblema;

    public RelatoRequest() {
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

    public Long getIdRegiao() {
        return idRegiao;
    }

    public void setIdRegiao(Long idRegiao) {
        this.idRegiao = idRegiao;
    }

    public Long getIdCategoriaProblema() {
        return idCategoriaProblema;
    }

    public void setIdCategoriaProblema(Long idCategoriaProblema) {
        this.idCategoriaProblema = idCategoriaProblema;
    }
}
