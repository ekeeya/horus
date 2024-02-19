package com.oddjobs.entities.users;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.oddjobs.entities.BaseEntity;
import com.oddjobs.utils.Utils;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
@EqualsAndHashCode(callSuper = true)
@Entity
@DiscriminatorColumn(name = "account_type")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@Table(name = "auth_user")
@DynamicInsert
@DynamicUpdate
@Transactional
@JsonIgnoreProperties(ignoreUnknown = true,value = {"version", "createdAt","lastModifiedAt", "lastModifiedBy", "password", "createdBy"})
@Data
public abstract class User extends BaseEntity implements UserDetails {

    @Column(name = "account_type", nullable = false, insertable = false, updatable = false)
    @Enumerated(EnumType.STRING)
    private Utils.ACCOUNT_TYPE accountType;

    @Column(name="username", nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    private String qrCode;

    @Column(name="role")
    @Enumerated(EnumType.STRING)
    private Utils.ROLES role;
    private String email;
    private String address;
    private String firstName;
    private String lastName;
    private String middleName;

    @Column(unique = true)
    private String telephone;
    private Boolean isSuperAdmin=false;
    @Enumerated(EnumType.STRING)
    private Utils.GENDER gender;

    @Column(name="using_2fa", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean using2FA = false;

    private String secret;

    @Column(name="is_expired", columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isExpired = false;

    @Transient
    public String fullName(){
        String mName = this.middleName == null ? "" : this.middleName;
       return  String.format("%s %s %s", firstName, mName,lastName);
    }

    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(String.valueOf(role)));
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return !this.isExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.getDeleted();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.getEnabled();
    }
}
