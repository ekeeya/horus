package com.oddjobs.tasks;
import com.oddjobs.services.schools.subscriptions.CommissionService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
@Slf4j
public class BackGroundTasks {

    private final CommissionService commissionService;

    @Scheduled(fixedRate = 60000*5)
    void processCommissionDeductions(){
        log.info("Entering commissions deduction routine");
        commissionService.deductCommission();
    }

}
