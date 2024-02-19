package com.oddjobs.services;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class BackgroundTaskExecutorImpl implements BackgroundTaskExecutor{
    @Async
    @Override
    public void runTask(Runnable r) {
        r.run();
    }
}
