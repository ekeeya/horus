package com.oddjobs.services;

public interface BackgroundTaskExecutor {
    void runTask(Runnable r);
}
