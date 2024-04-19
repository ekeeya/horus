package com.oddjobs.dtos.responses;

import com.oddjobs.entities.users.User;
import com.oddjobs.utils.Utils;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Data
public class UserResponseDto {
    private Long id;
    private Utils.ACCOUNT_TYPE accountType;
    private String username;
    private String role;
    private String email;
    private String address;
    private String firstName;
    private String lastName;
    private String middleName;
    private  String fullName;
    private String status;
    private String qrCode;
    private String telephone;
    private boolean isPrimary; // changes depending on the user
    private  boolean enabled;
    private Utils.GENDER gender;
    private boolean using2fa = false;
    private  boolean isSuperUser;
    private List<Map<String, Object>> permissions = new ArrayList<>();

    public UserResponseDto(User user, boolean showPerms){
        if(user != null){
            String[] perms = {"dashboard", "users", "students","parents"};
            setId(user.getId());
            setAccountType(user.getAccountType());
            setEmail(user.getEmail());
            setAddress(user.getAddress());
            setTelephone(user.getTelephone());
            setFirstName(user.getFirstName());
            setLastName(user.getLastName());
            setEnabled(user.isEnabled());
            setUsername(user.getUsername());
            setMiddleName(user.getMiddleName());
            setTelephone(user.getTelephone());
            setGender(user.getGender());
            setSuperUser(user.getIsSuperAdmin());
            setUsing2fa(user.isUsing2FA());
            setRole(user.getRole().toString().split("_")[1]);
            setStatus(user.getEnabled() ? "ACTIVE":"IN ACTIVE");
            setFullName(user.fullName());
            //TODO specify permissions for now let's keep it simple
            if (showPerms)
            {
                if(isSuperUser){
                    Map<String, Object> permission = new HashMap<>();
                    permission.put("action", "manage");
                    permission.put("subject", "all");
                    permissions.add(permission);
                }else{
                    for (String p:perms ) {
                        Map<String, Object> perm = new HashMap<>();
                        perm.put("action", "manage");
                        perm.put("subject", p);
                        permissions.add(perm);
                    }
                }

                setPermissions(permissions);
            }

        }
    }
}
