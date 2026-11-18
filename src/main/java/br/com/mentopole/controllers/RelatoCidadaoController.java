package br.com.mentopole.controllers;

import br.com.mentopole.bo.RelatoCidadaoBO;
import br.com.mentopole.dto.RelatoRequest;
import br.com.mentopole.dto.RelatoResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatos")
public class RelatoCidadaoController {

    private final RelatoCidadaoBO relatoCidadaoBO;

    public RelatoCidadaoController(RelatoCidadaoBO relatoCidadaoBO) {
        this.relatoCidadaoBO = relatoCidadaoBO;
    }

    @PostMapping
    public ResponseEntity<RelatoResponse> inserir(@RequestBody RelatoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(relatoCidadaoBO.inserir(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RelatoResponse> alterar(@PathVariable Long id, @RequestBody RelatoRequest request) {
        return ResponseEntity.ok(relatoCidadaoBO.alterar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        relatoCidadaoBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RelatoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(relatoCidadaoBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<RelatoResponse>> listarTodos() {
        return ResponseEntity.ok(relatoCidadaoBO.listarTodos());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RelatoResponse> alterarStatus(@PathVariable Long id,
                                                        @RequestBody Map<String, String> corpo) {
        return ResponseEntity.ok(relatoCidadaoBO.alterarStatus(id, corpo.get("status")));
    }
}
