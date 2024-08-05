package com.oddjobs.entities;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;

@Data
@MappedSuperclass
@Transactional
@EntityListeners({AuditingEntityListener.class})
@JsonIgnoreProperties(ignoreUnknown = true, value = {"version", "createdAt","createdBy","lastModifiedAt","deleted","enabled", "lastModifiedBy"})
public abstract class BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "created_at", insertable = false, columnDefinition = "TIMESTAMP NOT NULL DEFAULT NOW()")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdAt;

    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "last_modified_at", insertable = false,columnDefinition = "TIMESTAMP NOT NULL DEFAULT NOW()")
    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastModifiedAt= Calendar.getInstance().getTime();

    @LastModifiedBy
    @Column(name = "last_modified_by")
    private String lastModifiedBy;

    @Column(name="deleted", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean deleted =  false;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean enabled = true;
}
