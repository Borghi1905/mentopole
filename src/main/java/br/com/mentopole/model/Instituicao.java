package br.com.mentopole.model;

import java.util.Objects;

public class Instituicao {

    private Long idInstituicao;
    private String nome;
    private String tipoInstituicao;
    private String telefone;
    private String email;
    private Usuario usuario;

    public Instituicao() {
    }

    public Instituicao(Long idInstituicao, String nome, String tipoInstituicao, String telefone, String email, Usuario usuario) {
        this.idInstituicao = idInstituicao;
        this.nome = nome;
        this.tipoInstituicao = tipoInstituicao;
        this.telefone = telefone;
        this.email = email;
        this.usuario = usuario;
    }

    public Long getIdInstituicao() {
        return idInstituicao;
    }

    public void setIdInstituicao(Long idInstituicao) {
        this.idInstituicao = idInstituicao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipoInstituicao() {
        return tipoInstituicao;
    }

    public void setTipoInstituicao(String tipoInstituicao) {
        this.tipoInstituicao = tipoInstituicao;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Instituicao other = (Instituicao) o;
        return idInstituicao != null && Objects.equals(idInstituicao, other.idInstituicao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idInstituicao);
    }

    @Override
    public String toString() {
        return "Instituicao{" +
                "idInstituicao=" + idInstituicao + ", " +
                "nome=" + nome + ", " +
                "tipoInstituicao=" + tipoInstituicao + ", " +
                "telefone=" + telefone + ", " +
                "email=" + email + ", " +
                "usuario=" + (usuario == null ? null : usuario.getIdUsuario()) + "}";
    }
}
