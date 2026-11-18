package br.com.mentopole.controllers;

import br.com.mentopole.bo.CategoriaProblemaBO;
import br.com.mentopole.model.CategoriaProblema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias-problema")
public class CategoriaProblemaController {

    private final CategoriaProblemaBO categoriaProblemaBO;

    public CategoriaProblemaController(CategoriaProblemaBO categoriaProblemaBO) {
        this.categoriaProblemaBO = categoriaProblemaBO;
    }

    @PostMapping
    public ResponseEntity<CategoriaProblema> inserir(@RequestBody CategoriaProblema categoriaProblema) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaProblemaBO.inserir(categoriaProblema));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaProblema> alterar(@PathVariable Long id, @RequestBody CategoriaProblema categoriaProblema) {
        return ResponseEntity.ok(categoriaProblemaBO.alterar(id, categoriaProblema));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categoriaProblemaBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaProblema> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaProblemaBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoriaProblema>> listarTodos() {
        return ResponseEntity.ok(categoriaProblemaBO.listarTodos());
    }
}
