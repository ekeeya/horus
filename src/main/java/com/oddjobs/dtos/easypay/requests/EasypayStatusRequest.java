
package com.oddjobs.dtos.easypay.requests;

import com.oddjobs.dtos.easypay.ConstantUtils;
import lombok.Data;

import java.io.Serializable;

@Data
public class EasypayStatusRequest implements Serializable {
    private String username;
    private String password;
    private String action= ConstantUtils.ACTIONS.mmstatus.toString();
    private String reference;
}
