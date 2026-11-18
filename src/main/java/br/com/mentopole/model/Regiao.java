package br.com.mentopole.model;

import java.util.Objects;

public class Regiao {

    private Long idRegiao;
    private String nome;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    public Regiao() {
    }

    public Regiao(Long idRegiao, String nome, String bairro, String cidade, String estado, String cep) {
        this.idRegiao = idRegiao;
        this.nome = nome;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
    }

    public Long getIdRegiao() {
        return idRegiao;
    }

    public void setIdRegiao(Long idRegiao) {
        this.idRegiao = idRegiao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Regiao other = (Regiao) o;
        return idRegiao != null && Objects.equals(idRegiao, other.idRegiao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idRegiao);
    }

    @Override
    public String toString() {
        return "Regiao{" +
                "idRegiao=" + idRegiao + ", " +
                "nome=" + nome + ", " +
                "bairro=" + bairro + ", " +
                "cidade=" + cidade + ", " +
                "estado=" + estado + ", " +
                "cep=" + cep + "}";
    }
}
