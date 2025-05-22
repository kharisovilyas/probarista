package ru.ilcorp.probarista.service;

import org.springframework.stereotype.Service;
import ru.ilcorp.probarista.model.entity.OrderEntity;
import ru.ilcorp.probarista.model.entity.OrderItemEntity;
import ru.ilcorp.probarista.model.entity.TableEntity;
import ru.ilcorp.probarista.model.entity.UserEntity;
import ru.ilcorp.probarista.repository.OrderRepository;
import ru.ilcorp.probarista.repository.TableRepository;
import ru.ilcorp.probarista.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TableRepository tableRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, TableRepository tableRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.tableRepository = tableRepository;
    }

    public OrderEntity createOrder(String userId, String branchId, String tableId, List<OrderItemEntity> items) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        TableEntity table = tableRepository.findById(tableId)
                .orElseThrow(() -> new IllegalArgumentException("Table not found"));

        OrderEntity order = new OrderEntity();
        order.setUser(user);
        order.setBranch(table.getBranch());
        order.setTable(table);
        order.setItems(items);
        order.setStatus("pending");
        order.setTimestamp(LocalDateTime.now());
        order.setTotal(items.stream().mapToInt(item -> item.getPrice() * item.getQuantity()).sum());

        return orderRepository.save(order);
    }

    public List<OrderEntity> getUserOrders(String userId) {
        return orderRepository.findByUserId(userId);
    }
}
