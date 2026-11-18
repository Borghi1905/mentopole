package br.com.mentopole.controllers;

import br.com.mentopole.bo.RegiaoBO;
import br.com.mentopole.model.Regiao;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/regioes")
public class RegiaoController {

    private final RegiaoBO regiaoBO;

    public RegiaoController(RegiaoBO regiaoBO) {
        this.regiaoBO = regiaoBO;
    }

    @PostMapping
    public ResponseEntity<Regiao> inserir(@RequestBody Regiao regiao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(regiaoBO.inserir(regiao));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Regiao> alterar(@PathVariable Long id, @RequestBody Regiao regiao) {
        return ResponseEntity.ok(regiaoBO.alterar(id, regiao));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        regiaoBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Regiao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(regiaoBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Regiao>> listarTodos() {
        return ResponseEntity.ok(regiaoBO.listarTodos());
    }
}
