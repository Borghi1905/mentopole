package br.com.mentopole.controllers;

import br.com.mentopole.bo.InstituicaoBO;
import br.com.mentopole.model.Instituicao;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoBO instituicaoBO;

    public InstituicaoController(InstituicaoBO instituicaoBO) {
        this.instituicaoBO = instituicaoBO;
    }

    @PostMapping
    public ResponseEntity<Instituicao> inserir(@RequestBody Instituicao instituicao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(instituicaoBO.inserir(instituicao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Instituicao> alterar(@PathVariable Long id, @RequestBody Instituicao instituicao) {
        return ResponseEntity.ok(instituicaoBO.alterar(id, instituicao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        instituicaoBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instituicao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(instituicaoBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Instituicao>> listarTodos() {
        return ResponseEntity.ok(instituicaoBO.listarTodos());
    }
}
