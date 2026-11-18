package br.com.mentopole.model;

import java.util.Objects;


public class CategoriaProblema {


    private Long idCategoria;

    private String nome;

    private String descricao;

    public CategoriaProblema() {
    }

    public CategoriaProblema(Long idCategoria, String nome, String descricao) {
        this.idCategoria = idCategoria;
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Long idCategoria) {
        this.idCategoria = idCategoria;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoriaProblema other = (CategoriaProblema) o;
        return idCategoria != null && Objects.equals(idCategoria, other.idCategoria);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCategoria);
    }

    @Override
    public String toString() {
        return "CategoriaProblema{" +
                "idCategoria=" + idCategoria + ", " +
                "nome=" + nome + ", " +
                "descricao=" + descricao + "}";
    }
}
