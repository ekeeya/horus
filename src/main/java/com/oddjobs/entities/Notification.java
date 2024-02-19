package com.oddjobs.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;

@Entity
@Transactional
@JsonIgnoreProperties(ignoreUnknown = true,value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy", "createdBy", "enabled", "deleted"})
@Setter
@Getter
public class Notification extends  BaseEntity{

    public static enum Type{
        PRIMARY_PARENT_APPROVAL_REQUEST,SECONDARY_PARENT_APPROVAL_REQUEST, WITHDRAW_REQUEST, CARD_PROVISIONING_REQUEST
    }
    public static enum Action{
        Approve, Reject,Cancel, Delete,Add, Remove, Create, Processed
    }
    private Long entityId;

    private Boolean seen=false; // let's keep it simple

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private Action action;

    public static enum Medium{
        Email, SMS
    }

    @Enumerated(EnumType.STRING)
    private Medium medium = Medium.Email;

    @Column(columnDefinition = "TEXT")
    private String message;

}
