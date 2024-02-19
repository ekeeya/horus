package com.oddjobs.services;

import com.oddjobs.repositories.SettingsRepository;
import com.oddjobs.entities.Settings;
import com.oddjobs.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SettingServiceImpl implements SettingService{

    private final SettingsRepository settingsRepository;
    @Override
    public void updateProvider(Utils.PROVIDER_TYPES providerType) throws Exception {
        try{
            Settings setting =  getSettings();
            setting.setProvider(providerType);
            settingsRepository.save(setting);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            throw  new Exception(e.getMessage(), e);
        }
    }

    @Override
    public Settings getSettings() throws Exception {
        List<Settings> settings =  settingsRepository.findAll();
        if (settings.size() == 0){
            throw  new Exception("Mobile Money provider setting missing");
        }else{
            return settings.get(0);
        }
    }

    @Override
    public Utils.PROVIDER_TYPES getSetProvider() {
        try{
            Settings setting =  getSettings();
            return  setting.getProvider();
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return null;
        }
    }
}
