package ru.ilcorp.probarista.controllers.api.v1;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.ilcorp.probarista.model.entity.OrderEntity;
import ru.ilcorp.probarista.model.entity.OrderItemEntity;
import ru.ilcorp.probarista.repository.OrderRepository;
import ru.ilcorp.probarista.service.OrderService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderRequest) {
        String username = (String) orderRequest.get("username");
        String branchId = (String) orderRequest.get("branchId");
        String tableId = (String) orderRequest.get("tableId");
        List<Map<String, Object>> items = (List<Map<String, Object>>) orderRequest.get("items");

        List<OrderItemEntity> orderItems = items.stream().map(item -> {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setName((String) item.get("name"));
            orderItem.setSize((String) item.get("size"));
            orderItem.setPrice(((Number) item.get("price")).intValue());
            orderItem.setQuantity(((Number) item.get("quantity")).intValue());
            return orderItem;
        }).toList();

        OrderEntity order = orderService.createOrder(username, branchId, tableId, orderItems);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderEntity>> getOrders(@RequestParam(required = false) String username, @RequestParam(required = false) String branchId) {
        if (username != null) {
            return ResponseEntity.ok(orderService.getUserOrders(username));
        } else if (branchId != null) {
            return ResponseEntity.ok(orderRepository.findByBranchId(branchId));
        }
        return ResponseEntity.badRequest().body(null);
    }
}