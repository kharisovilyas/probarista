package ru.ilcorp.probarista.model.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "branches")
public class BranchEntity {

    @Id
    private String id;

    private String name;

    private String address;
}
