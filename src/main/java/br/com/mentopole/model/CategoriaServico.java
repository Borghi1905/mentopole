package br.com.mentopole.model;

import java.util.Objects;

public class CategoriaServico {

    private Long idTipoServico;
    private String nome;
    private String descricao;

    public CategoriaServico() {
    }

    public CategoriaServico(Long idTipoServico, String nome, String descricao) {
        this.idTipoServico = idTipoServico;
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getIdTipoServico() {
        return idTipoServico;
    }

    public void setIdTipoServico(Long idTipoServico) {
        this.idTipoServico = idTipoServico;
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
        CategoriaServico other = (CategoriaServico) o;
        return idTipoServico != null && Objects.equals(idTipoServico, other.idTipoServico);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idTipoServico);
    }

    @Override
    public String toString() {
        return "CategoriaServico{" +
                "idTipoServico=" + idTipoServico + ", " +
                "nome=" + nome + ", " +
                "descricao=" + descricao + "}";
    }
}
