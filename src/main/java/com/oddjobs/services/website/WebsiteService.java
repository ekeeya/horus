package com.oddjobs.services.website;

import com.oddjobs.dtos.requests.FAQRequestDto;
import com.oddjobs.dtos.requests.FeedbackRequestDto;
import com.oddjobs.entities.website.FAQs;
import com.oddjobs.entities.website.Feedbacks;

import org.springframework.data.domain.Page;

public interface WebsiteService {
    FAQs createFAQ(FAQRequestDto request);
    Page<FAQs> findAllFAQs(int page, int size);
    Feedbacks createFeedback(FeedbackRequestDto request);
    Page<Feedbacks> findAllFeedbacks(int page, int size);

}
