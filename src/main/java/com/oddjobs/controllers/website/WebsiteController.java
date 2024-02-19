/*
 * Online auctioning system
 *
 * Copyright (c) 2023.  Oddjobs an alias for the author of this software. - www.skycastleauctionhub.com
 *
 *
 * Created by Emmanuel Keeya Lubowa - ekeeya@oddjobs.tech <ekeeya@oddjobs.tech>.
 *
 * This program is not free software.
 *
 * NOTICE: All information contained herein is, and remains the property of Oddjobs. - www.oddjobs.tech
 */

package com.oddjobs.controllers.website;

import com.oddjobs.components.Mapper;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.dtos.requests.FAQRequestDto;
import com.oddjobs.dtos.requests.FeedbackRequestDto;
import com.oddjobs.dtos.responses.FAQResponseDto;
import com.oddjobs.dtos.responses.FeedbackResponseDto;
import com.oddjobs.entities.website.FAQs;
import com.oddjobs.entities.website.Feedbacks;
import com.oddjobs.services.website.WebsiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/website")
public class WebsiteController {
    private final WebsiteService websiteService;

    private final Mapper mapper;


    @GetMapping("faqs")
    public ResponseEntity<?> getFAQs(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {

        ListResponseDTO<FAQResponseDto> response;
        try {
            Page<? extends FAQs> faqs;
            faqs = websiteService.findAllFAQs(page, size);
            response = new ListResponseDTO<>(faqs.getContent().stream().map(mapper::toFAQRequestDto).toList(), faqs.getTotalPages());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("faqs/register")
    public ResponseEntity<?> registerFAQs(
            @Valid @RequestBody FAQRequestDto request, BindingResult result
    ) {
        BaseResponse response;
        try {
            response = new BaseResponse(result);
            if (response.isSuccess()) {
                FAQs faqs = websiteService.createFAQ(request);
                FAQResponseDto u = mapper.toFAQRequestDto(faqs);
                response.setData(u);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
            response = new BaseResponse(e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("feedbacks/register")
    public ResponseEntity<?> registerFeedback(
            @Valid @RequestBody FeedbackRequestDto request, BindingResult result
    ) {
        BaseResponse response;
        try {
            response = new BaseResponse(result);
            if (response.isSuccess()) {
                Feedbacks feedbacks = websiteService.createFeedback(request);
                FeedbackResponseDto u = mapper.toFeedbackRequestDto(feedbacks);
                response.setData(u);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(response);
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
            response = new BaseResponse(e);
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("feedbacks")
    public ResponseEntity<?> getFeedbacks(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {

        ListResponseDTO<FeedbackResponseDto> response;
        try {
            Page<? extends Feedbacks> feedbacks;
            feedbacks = websiteService.findAllFeedbacks(page, size);
            response = new ListResponseDTO<>(feedbacks.getContent().stream().map(mapper::toFeedbackRequestDto).toList(), feedbacks.getTotalPages());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

}
