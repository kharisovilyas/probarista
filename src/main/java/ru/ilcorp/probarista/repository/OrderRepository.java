package ru.ilcorp.probarista.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ru.ilcorp.probarista.model.entity.OrderEntity;

import java.util.List;

public interface OrderRepository extends MongoRepository<OrderEntity, String> {
    List<OrderEntity> findByUserId(String userId);
}
