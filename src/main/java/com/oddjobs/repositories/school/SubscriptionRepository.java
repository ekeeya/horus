package com.oddjobs.repositories.school;
import com.oddjobs.entities.School;
import com.oddjobs.entities.subscriptions.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>{

    Subscription findSubscriptionBySchool(School school);
    Subscription findSubscriptionById(Long id);
}
