package com.oddjobs.services.website;

import com.oddjobs.dtos.requests.FAQRequestDto;
import com.oddjobs.dtos.requests.FeedbackRequestDto;
import com.oddjobs.repositories.website.FAQRepository;
import com.oddjobs.repositories.website.FeedbackRepository;
import com.oddjobs.entities.website.FAQ;
import com.oddjobs.entities.website.FAQs;
import com.oddjobs.entities.website.Feedback;
import com.oddjobs.entities.website.Feedbacks;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class WebsiteServiceImpl implements WebsiteService {
    private final FAQRepository faqRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    public FAQs createFAQ(FAQRequestDto request) {
        FAQs faq = new FAQ();
        faq.setAnswer(request.getAnswer());
        faq.setQuestion(request.getQuestion());
        faq.setStatus(request.getStatus());

        return  faqRepository.save(faq);
    }

    @Override
    public Page<FAQs> findAllFAQs(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return faqRepository.findAll(pageable);
    }

    @Override
    public Feedbacks createFeedback(FeedbackRequestDto request) {
        Feedbacks feedback = new Feedback();
        feedback.setName(request.getName());
        feedback.setComment(request.getComment());
        feedback.setStatus(request.getStatus());

        return  feedbackRepository.save(feedback);
    }


    public Page<Feedbacks> findAllFeedbacks(int page, int size) {
        Pageable pageable =  PageRequest.of(page, size, Sort.by("id").descending());
        return feedbackRepository.findAll(pageable);
    }

}
