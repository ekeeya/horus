package com.oddjobs.services;

public interface TransactionalExecutorService {
    void  execInTransaction(Runnable r);
    <T> Long executeInTransaction(IdentifiableRunnable runnable);
}
