package ru.ilcorp.probarista.model.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class OrderEntity {

    @Id
    private String id;

    @DocumentReference
    private UserEntity user;

    @DocumentReference
    private BranchEntity branch;

    @DocumentReference
    private TableEntity table;

    private List<OrderItemEntity> items;

    private String status;

    private LocalDateTime timestamp;

    private int total;

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public void setBranch(BranchEntity branch) {
        this.branch = branch;
    }

    public void setTable(TableEntity table) {
        this.table = table;
    }

    public void setItems(List<OrderItemEntity> items) {
        this.items = items;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}