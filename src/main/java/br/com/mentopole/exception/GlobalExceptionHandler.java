package br.com.mentopole.exception;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import br.com.mentopole.dto.ErroResponse;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private static final String MSG_CORPO_INVALIDO = "Corpo da requisição inválido ou malformado.";
    private static final String MSG_CONFLITO_GENERICA =
            "Operação não permitida: o registro já existe ou possui vínculos com outros dados.";
    private static final String MSG_ERRO_INTERNO = "Erro interno. Tente novamente mais tarde.";
    private static final String MSG_BANCO_INDISPONIVEL =
            "Não foi possível conectar ao banco de dados. Verifique a rede/VPN e as credenciais (DB_URL, DB_USERNAME, DB_PASSWORD).";
    private static final String MSG_ESTRUTURA_BANCO =
            "O banco de dados não tem a estrutura esperada (tabela ou coluna ausente). Veja o log do servidor para o detalhe.";

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroResponse> tratarDadosInvalidos(IllegalArgumentException ex,
                                                             HttpServletRequest req) {
        return montarResposta(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponse> tratarCorpoInvalido(HttpMessageNotReadableException ex,
                                                            HttpServletRequest req) {
        return montarResposta(HttpStatus.BAD_REQUEST, MSG_CORPO_INVALIDO, req);
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ErroResponse> tratarNaoAutorizado(SecurityException ex,
                                                            HttpServletRequest req) {
        return montarResposta(HttpStatus.UNAUTHORIZED, ex.getMessage(), req);
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResponse> tratarAcessoNegado(AcessoNegadoException ex,
                                                           HttpServletRequest req) {
        return montarResposta(HttpStatus.FORBIDDEN, ex.getMessage(), req);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ErroResponse> tratarNaoEncontrado(NoSuchElementException ex,
                                                            HttpServletRequest req) {
        return montarResposta(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> tratarViolacaoIntegridade(DataIntegrityViolationException ex,
                                                                  HttpServletRequest req) {
        if (ex.getCause() == null) {
            return montarResposta(HttpStatus.CONFLICT, ex.getMessage(), req);
        }
        logger.warn("Violação de integridade em {}: {}", req.getRequestURI(), ex.getMostSpecificCause().getMessage());
        return montarResposta(HttpStatus.CONFLICT, MSG_CONFLITO_GENERICA, req);
    }

    @ExceptionHandler(DataAccessResourceFailureException.class)
    public ResponseEntity<ErroResponse> tratarBancoIndisponivel(DataAccessResourceFailureException ex,
                                                                HttpServletRequest req) {
        logger.error("Falha de conexão com o banco em {} {}: {}", req.getMethod(), req.getRequestURI(),
                ex.getMostSpecificCause().getMessage());
        return montarResposta(HttpStatus.SERVICE_UNAVAILABLE, MSG_BANCO_INDISPONIVEL, req);
    }

    @ExceptionHandler(QueryTimeoutException.class)
    public ResponseEntity<ErroResponse> tratarTimeoutBanco(QueryTimeoutException ex,
                                                           HttpServletRequest req) {
        logger.error("Timeout no banco em {} {}: {}", req.getMethod(), req.getRequestURI(),
                ex.getMostSpecificCause().getMessage());
        return montarResposta(HttpStatus.GATEWAY_TIMEOUT,
                "O banco de dados demorou demais para responder. Verifique se há transação aberta (sem COMMIT/ROLLBACK) "
                        + "na tabela USUARIO em outro programa (SQL Developer, DBeaver) e tente de novo.", req);
    }

    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<ErroResponse> tratarEstruturaBanco(BadSqlGrammarException ex,
                                                             HttpServletRequest req) {
        logger.error("SQL incompatível com o banco em {} {}: {}", req.getMethod(), req.getRequestURI(),
                ex.getMostSpecificCause().getMessage());
        return montarResposta(HttpStatus.INTERNAL_SERVER_ERROR, MSG_ESTRUTURA_BANCO, req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarErroInterno(Exception ex, HttpServletRequest req) throws Exception {
        if (ex instanceof org.springframework.web.ErrorResponse erroSpring) {
            HttpStatus status = HttpStatus.valueOf(erroSpring.getStatusCode().value());
            return montarResposta(status, status.getReasonPhrase(), req);
        }
        logger.error("Erro inesperado em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return montarResposta(HttpStatus.INTERNAL_SERVER_ERROR, MSG_ERRO_INTERNO, req);
    }

    private ResponseEntity<ErroResponse> montarResposta(HttpStatus status, String mensagem,
                                                        HttpServletRequest req) {
        ErroResponse erro = new ErroResponse();
        erro.setTimestamp(LocalDateTime.now());
        erro.setStatus(status.value());
        erro.setErro(status.getReasonPhrase());
        erro.setMensagem(mensagem);
        erro.setCaminho(req.getRequestURI());
        return ResponseEntity.status(status).body(erro);
    }
}