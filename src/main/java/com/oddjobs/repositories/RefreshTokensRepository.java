package com.oddjobs.repositories;

import com.oddjobs.entities.tokens.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokensRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findRefreshTokenByToken(String token);

}
