package com.oddjobs.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionalExecutorServiceImpl implements TransactionalExecutorService{


    private final TransactionTemplate transactionTemplate;
    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public void execInTransaction(Runnable r) {
        try {
            r.run();
        } catch (Exception ex) {
            log.error("Failed to execute transaction: ", ex);
        }
    }

    @Override
    public <T> Long executeInTransaction(IdentifiableRunnable runnable) {
        return transactionTemplate.execute(status -> {
            runnable.run();
            // assume the ID is returned from the runnable somehow
            return runnable.getId();
        });
    }
}
