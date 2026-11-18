package br.com.mentopole.model;

import java.util.Objects;

public class Indicador {

    private Long idIndicador;
    private String nome;
    private String descricao;
    private String categoria;
    private String unidadeMedida;

    public Indicador() {
    }

    public Indicador(Long idIndicador, String nome, String descricao, String categoria, String unidadeMedida) {
        this.idIndicador = idIndicador;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.unidadeMedida = unidadeMedida;
    }

    public Long getIdIndicador() {
        return idIndicador;
    }

    public void setIdIndicador(Long idIndicador) {
        this.idIndicador = idIndicador;
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

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Indicador other = (Indicador) o;
        return idIndicador != null && Objects.equals(idIndicador, other.idIndicador);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idIndicador);
    }

    @Override
    public String toString() {
        return "Indicador{" +
                "idIndicador=" + idIndicador + ", " +
                "nome=" + nome + ", " +
                "descricao=" + descricao + ", " +
                "categoria=" + categoria + ", " +
                "unidadeMedida=" + unidadeMedida + "}";
    }
}
