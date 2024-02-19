package com.oddjobs.services;

import com.oddjobs.entities.Settings;
import com.oddjobs.utils.Utils;

public interface SettingService {

    void updateProvider(Utils.PROVIDER_TYPES providerType) throws Exception;

    Settings getSettings() throws Exception;
    Utils.PROVIDER_TYPES getSetProvider();
}
