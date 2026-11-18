package br.com.mentopole.controllers;

import br.com.mentopole.bo.DadoTerritorialBO;
import br.com.mentopole.model.DadoTerritorial;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dados-territoriais")
public class DadoTerritorialController {

    private final DadoTerritorialBO dadoTerritorialBO;

    public DadoTerritorialController(DadoTerritorialBO dadoTerritorialBO) {
        this.dadoTerritorialBO = dadoTerritorialBO;
    }

    @PostMapping
    public ResponseEntity<DadoTerritorial> inserir(@RequestBody DadoTerritorial dadoTerritorial) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dadoTerritorialBO.inserir(dadoTerritorial));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DadoTerritorial> alterar(@PathVariable Long id, @RequestBody DadoTerritorial dadoTerritorial) {
        return ResponseEntity.ok(dadoTerritorialBO.alterar(id, dadoTerritorial));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        dadoTerritorialBO.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadoTerritorial> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(dadoTerritorialBO.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<DadoTerritorial>> listarTodos() {
        return ResponseEntity.ok(dadoTerritorialBO.listarTodos());
    }
}
