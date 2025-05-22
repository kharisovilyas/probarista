package ru.ilcorp.probarista.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.ilcorp.probarista.model.entity.BranchEntity;

public interface BranchRepository extends MongoRepository<BranchEntity, String> {
}