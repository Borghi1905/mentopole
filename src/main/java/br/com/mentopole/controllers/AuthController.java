package br.com.mentopole.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.mentopole.bo.UsuarioBO;
import br.com.mentopole.dto.LoginRequest;
import br.com.mentopole.dto.UsuarioRequest;
import br.com.mentopole.dto.UsuarioResponse;
import br.com.mentopole.model.Usuario;
import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping({"/auth", "/api/auth"})
public class AuthController {

    private static final String ATRIBUTO_SESSAO = UsuarioBO.ATRIBUTO_SESSAO;
    private static final int SESSAO_PADRAO_SEGUNDOS = 30 * 60;
    private static final int SESSAO_MANTER_SEGUNDOS = 7 * 24 * 60 * 60;

    private final UsuarioBO usuarioBO;

    public AuthController(UsuarioBO usuarioBO) {
        this.usuarioBO = usuarioBO;
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody LoginRequest login, HttpSession sessao) {
        Usuario usuario = usuarioBO.autenticar(login);

        sessao.setAttribute(ATRIBUTO_SESSAO, usuario);
        sessao.setMaxInactiveInterval(login.isManter() ? SESSAO_MANTER_SEGUNDOS : SESSAO_PADRAO_SEGUNDOS);

        return ResponseEntity.ok(usuarioBO.paraResponse(usuario));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> me() {
        return ResponseEntity.ok(usuarioBO.perfilAtual());
    }

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> register(@RequestBody UsuarioRequest request) {
        UsuarioResponse criado = usuarioBO.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Void> recuperar(@RequestBody(required = false) String email) {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession sessao) {
        sessao.invalidate();
        return ResponseEntity.noContent().build();
    }
}