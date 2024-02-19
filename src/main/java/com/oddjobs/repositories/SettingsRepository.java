package com.oddjobs.repositories;

import com.oddjobs.entities.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {
}
