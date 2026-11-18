package br.com.mentopole.controllers;

import br.com.mentopole.bo.CategoriaServicoBO;
import br.com.mentopole.model.CategoriaServico;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias-servico")
public class CategoriaServicoController {

    private final CategoriaServicoBO categoriaServicoBO;

    public CategoriaServicoController(CategoriaServicoBO categoriaServicoBO) {
        this.categoriaServicoBO = categoriaServicoBO;
    }

    @PostMapping
    public ResponseEntity<CategoriaServico> inserir(@RequestBody CategoriaServico categoriaServico) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaServicoBO.inserir(categoriaServico));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaServico> alterar(@PathVariable Long id, @RequestBody CategoriaServico categoriaServico) {
        return ResponseEntity.ok(categoriaServicoBO.alterar(id, categoriaServico));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        categoriaServicoBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaServico> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaServicoBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoriaServico>> listarTodos() {
        return ResponseEntity.ok(categoriaServicoBO.listarTodos());
    }
}
