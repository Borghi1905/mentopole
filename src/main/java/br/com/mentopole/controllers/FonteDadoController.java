package br.com.mentopole.controllers;

import br.com.mentopole.bo.FonteDadoBO;
import br.com.mentopole.model.FonteDado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fontes-dado")
public class FonteDadoController {

    private final FonteDadoBO fonteDadoBO;

    public FonteDadoController(FonteDadoBO fonteDadoBO) {
        this.fonteDadoBO = fonteDadoBO;
    }

    @PostMapping
    public ResponseEntity<FonteDado> inserir(@RequestBody FonteDado fonteDado) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fonteDadoBO.inserir(fonteDado));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FonteDado> alterar(@PathVariable Long id, @RequestBody FonteDado fonteDado) {
        return ResponseEntity.ok(fonteDadoBO.alterar(id, fonteDado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        fonteDadoBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FonteDado> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(fonteDadoBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<FonteDado>> listarTodos() {
        return ResponseEntity.ok(fonteDadoBO.listarTodos());
    }
}
