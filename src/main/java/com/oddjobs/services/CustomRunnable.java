package com.oddjobs.services;

import java.util.function.Function;

public class CustomRunnable implements IdentifiableRunnable{

    private Long id;
    private Function<Long, Long> callBack;

    public CustomRunnable(Function<Long, Long> callBack){
        this.callBack=callBack;
    }
    @Override
    public Long getId() {
        return id;
    }
    public  void  setId(Long id){
        this.id=id;
    }

    @Override
    public void run() {
        Long result = callBack.apply(id);
        setId(result);
    }
}
