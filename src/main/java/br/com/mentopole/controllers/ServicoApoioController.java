package br.com.mentopole.controllers;

import br.com.mentopole.bo.ServicoApoioBO;
import br.com.mentopole.model.ServicoApoio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos-apoio")
public class ServicoApoioController {

    private final ServicoApoioBO servicoApoioBO;

    public ServicoApoioController(ServicoApoioBO servicoApoioBO) {
        this.servicoApoioBO = servicoApoioBO;
    }

    @PostMapping
    public ResponseEntity<ServicoApoio> inserir(@RequestBody ServicoApoio servicoApoio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicoApoioBO.inserir(servicoApoio));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServicoApoio> alterar(@PathVariable Long id, @RequestBody ServicoApoio servicoApoio) {
        return ResponseEntity.ok(servicoApoioBO.alterar(id, servicoApoio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        servicoApoioBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoApoio> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(servicoApoioBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ServicoApoio>> listarTodos() {
        return ResponseEntity.ok(servicoApoioBO.listarTodos());
    }
}
