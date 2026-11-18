package br.com.mentopole.dto;

import java.time.LocalDateTime;

public class UsuarioResponse {

    private Long idUsuario;
    private String nome;
    private String email;
    private String tipoUsuario;
    private LocalDateTime dataCadastro;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Long idUsuario, String nome, String email, String tipoUsuario, LocalDateTime dataCadastro) {
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
        this.dataCadastro = dataCadastro;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
