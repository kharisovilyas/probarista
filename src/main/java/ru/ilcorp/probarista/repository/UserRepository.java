package ru.ilcorp.probarista.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.ilcorp.probarista.model.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends MongoRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);
}
