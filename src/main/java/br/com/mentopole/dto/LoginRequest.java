package br.com.mentopole.dto;

public class LoginRequest {

    private String email;
    private String senha;
    private boolean manter;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public boolean isManter() {
        return manter;
    }

    public void setManter(boolean manter) {
        this.manter = manter;
    }
}
