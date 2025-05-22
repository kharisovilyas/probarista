package ru.ilcorp.probarista.controllers.api.v1;

import ru.ilcorp.probarista.model.entity.BranchEntity;
import ru.ilcorp.probarista.model.entity.OrderEntity;
import ru.ilcorp.probarista.model.entity.OrderItemEntity;
import ru.ilcorp.probarista.model.entity.TableEntity;
import ru.ilcorp.probarista.repository.BranchRepository;
import ru.ilcorp.probarista.repository.TableRepository;
import ru.ilcorp.probarista.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    private final BranchRepository branchRepository;
    private final TableRepository tableRepository;

    public OrderController(OrderService orderService, BranchRepository branchRepository, TableRepository tableRepository) {
        this.orderService = orderService;
        this.branchRepository = branchRepository;
        this.tableRepository = tableRepository;
    }

    @GetMapping("/branches")
    public ResponseEntity<List<BranchEntity>> getBranches() {
        return ResponseEntity.ok(branchRepository.findAll());
    }

    @GetMapping("/tables/{branchId}")
    public ResponseEntity<List<TableEntity>> getTablesByBranch(@PathVariable String branchId) {
        return ResponseEntity.ok(tableRepository.findByBranchId(branchId));
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
    public ResponseEntity<List<OrderEntity>> getUserOrders(@RequestParam String username) {
        return ResponseEntity.ok(orderService.getUserOrders(username));
    }
}