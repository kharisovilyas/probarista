package ru.ilcorp.probarista.controllers.api.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ilcorp.probarista.model.entity.BranchEntity;
import ru.ilcorp.probarista.model.entity.TableEntity;
import ru.ilcorp.probarista.repository.BranchRepository;
import ru.ilcorp.probarista.repository.TableRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/branches")
public class BranchController {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private TableRepository tableRepository;

    // Получить все филиалы
    @GetMapping
    public List<BranchEntity> getAllBranches() {
        return branchRepository.findAll();
    }

    // Добавить филиал
    @PostMapping
    public ResponseEntity<BranchEntity> addBranch(@RequestBody BranchEntity branch) {
        BranchEntity savedBranch = branchRepository.save(branch);
        return ResponseEntity.ok(savedBranch);
    }

    // Удалить филиал
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable String id) {
        if (branchRepository.existsById(id)) {
            branchRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Получить столики филиала
    @GetMapping("/{branchId}/tables")
    public List<TableEntity> getTablesByBranch(@PathVariable String branchId) {
        return tableRepository.findByBranchId(branchId);
    }

    // Добавить столик
    @PostMapping("/{branchId}/tables")
    public ResponseEntity<TableEntity> addTable(@PathVariable String branchId, @RequestBody TableEntity table) {
        return branchRepository.findById(branchId)
                .map(branch -> {
                    table.setBranch(branch);
                    TableEntity savedTable = tableRepository.save(table);
                    return ResponseEntity.ok(savedTable);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Удалить столик
    @DeleteMapping("/{branchId}/tables/{tableId}")
    public ResponseEntity<Void> deleteTable(@PathVariable String branchId, @PathVariable String tableId) {
        if (tableRepository.existsById(tableId)) {
            tableRepository.deleteById(tableId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}