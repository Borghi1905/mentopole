package br.com.mentopole.exception;

public class AcessoNegadoException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
