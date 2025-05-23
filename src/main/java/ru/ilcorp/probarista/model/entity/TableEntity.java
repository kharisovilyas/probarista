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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public void setBranch(BranchEntity branch) {
        this.branch = branch;
    }
}