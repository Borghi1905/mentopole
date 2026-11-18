package br.com.mentopole.controllers;

import br.com.mentopole.bo.IndicadorBO;
import br.com.mentopole.model.Indicador;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/indicadores")
public class IndicadorController {

    private final IndicadorBO indicadorBO;

    public IndicadorController(IndicadorBO indicadorBO) {
        this.indicadorBO = indicadorBO;
    }

    @PostMapping
    public ResponseEntity<Indicador> inserir(@RequestBody Indicador indicador) {
        return ResponseEntity.status(HttpStatus.CREATED).body(indicadorBO.inserir(indicador));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Indicador> alterar(@PathVariable Long id, @RequestBody Indicador indicador) {
        return ResponseEntity.ok(indicadorBO.alterar(id, indicador));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        indicadorBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Indicador> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(indicadorBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<Indicador>> listarTodos() {
        return ResponseEntity.ok(indicadorBO.listarTodos());
    }
}
