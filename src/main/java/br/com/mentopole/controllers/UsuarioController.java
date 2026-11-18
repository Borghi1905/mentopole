package br.com.mentopole.controllers;

import br.com.mentopole.bo.UsuarioBO;
import br.com.mentopole.dto.UsuarioRequest;
import br.com.mentopole.dto.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioBO usuarioBO;

    public UsuarioController(UsuarioBO usuarioBO) {
        this.usuarioBO = usuarioBO;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> inserir(@RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioBO.inserir(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> alterar(@PathVariable Long id, @RequestBody UsuarioRequest request) {
        return ResponseEntity.ok(usuarioBO.alterar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        usuarioBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {
        return ResponseEntity.ok(usuarioBO.listarTodos());
    }
}
