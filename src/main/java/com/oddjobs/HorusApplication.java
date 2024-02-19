package com.oddjobs;

import com.auth0.jwt.algorithms.Algorithm;
import com.oddjobs.entities.Settings;
import com.oddjobs.repositories.SettingsRepository;
import com.oddjobs.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class HorusApplication {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${mm.api.provider.type}")
	private String providerType;

	public static void main(String[] args) {
		SpringApplication.run(HorusApplication.class, args);
	}

	@Bean
	public PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}

	@Bean
	public Algorithm algorithm(){
		assert secret != null;
		return  Algorithm.HMAC256(secret.getBytes());
	}

	@Bean
	CommandLineRunner commandLineRunner(
			SettingsRepository settingsRepository
	) {
		return args -> {
			List<Settings> settings =  settingsRepository.findAll();
			try{
				Settings setting;
				if (settings.size() == 0){
					setting =  new Settings();
				}else{
					setting =  settings.get(0);
				}
				setting.setProvider(Utils.PROVIDER_TYPES.valueOf(providerType));
				settingsRepository.save(setting);
			}catch (Exception e){
				log.error(e.getMessage(), e);
			}
		};
	}

}
