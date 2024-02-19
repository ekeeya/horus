package com.oddjobs.services;

import com.oddjobs.exceptions.SchoolNotFoundException;
import com.oddjobs.entities.Notification;

import java.util.List;

public interface NotificationService {

    void createNotification(Notification.Type type, Long entityId, Notification.Action action, String message);

    void markSeen(Long id);

    List<String> returnEmailAddresses(Notification notification) throws SchoolNotFoundException;
}
