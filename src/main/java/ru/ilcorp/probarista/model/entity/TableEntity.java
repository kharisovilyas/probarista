package ru.ilcorp.probarista.model.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "tables")
public class TableEntity {

    @Id
    private String id;

    private String number;

    @DocumentReference
    private BranchEntity branch;

    public BranchEntity getBranch() {
        return branch;
    }
}