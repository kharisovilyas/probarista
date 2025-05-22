package ru.ilcorp.probarista.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.ilcorp.probarista.model.entity.TableEntity;

import java.util.List;

public interface TableRepository extends MongoRepository<TableEntity, String> {
    List<TableEntity> findByBranchId(String branchId);
}