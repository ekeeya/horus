package com.oddjobs.controllers.inventory;

import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.entities.inventory.Category;
import com.oddjobs.services.BackgroundTaskExecutor;
import com.oddjobs.services.inventory.CategoryService;
import com.oddjobs.services.inventory.InventoryItemService;
import com.oddjobs.services.inventory.types.*;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/")
public class InventoryController {

    private final CategoryService categoryService;
    private final InventoryItemService inventoryItemService;
    private final BackgroundTaskExecutor backgroundTaskExecutor;

    @GetMapping("categories")
    public ResponseEntity<?> getCategories(
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="name", required = false) String name
    ){
        Page<Category> categories = categoryService.fetchCategories(size, page, name);
        ListResponseDTO<CategoryResponseDTO> listResponseDTO =  new ListResponseDTO<>(categories.getContent()
                .stream().map(CategoryResponseDTO::new).toList(), categories.getTotalElements());

        return ResponseEntity.ok(listResponseDTO);
    }


    @Secured({"ROLE_ADMIN", "ROLE_POS"})
    @PostMapping("categories")
    public ResponseEntity<?> createCategories(
            @RequestBody List<CategoryRequestDTO> request
            ){
        List<CategoryResponseDTO> categories = new ArrayList<>();
        for (CategoryRequestDTO cat: request
             ) {
            categories.add(new CategoryResponseDTO(categoryService.saveOrUpdate(cat)));
        }
        return ResponseEntity.ok(categories);
    }


    @PostMapping("import-categories")
    public ResponseEntity<?> registerInventoryItems(
            @RequestParam(value = "file", required = false) MultipartFile file
    ){
        try (Reader reader = new BufferedReader(new InputStreamReader((file.getInputStream())))) {
            CsvToBean<BulkCategoryRequestDTO> csvToBean = new CsvToBeanBuilder<BulkCategoryRequestDTO>(reader)
                    .withType(BulkCategoryRequestDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withIgnoreEmptyLine(true)
                    .build();
            try {
                List<BulkCategoryRequestDTO> bulkCategories =  csvToBean.parse();
                Runnable runnable = () -> {
                    try {
                        for (BulkCategoryRequestDTO importData: bulkCategories ) {
                            try{
                                categoryService.saveViaBulk(importData);
                            }catch (Exception e){
                                String error = String.format("Failed to record category due to: %s %s", e.getMessage(), importData);
                                log.error(e.getMessage(), error);
                            }
                        }
                        log.debug(String.format("%s categories have been loaded in bulk", bulkCategories.size()));
                        // TODO send email as well to admin
                    } catch (Exception e) {
                        log.error(e.getMessage(),e);
                        throw new RuntimeException(e);
                    }
                };
                backgroundTaskExecutor.runTask(runnable);
                BaseResponse response =  new BaseResponse();
                response.setMessage("We shall attempt load these categories for you.");
                return  ResponseEntity.ok(response);
            } catch (Exception e) {
                log.error(e.getMessage(), e);
                List<String> fields = List.of("name","category","price","pos_id", "quantity");
                String message = String.format("Required field(s) is missing in the CSV data. Make sure csv is %s", fields);
                return ResponseEntity.badRequest().body(message);
            }
        } catch (IOException e) {
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("inventory-items")
    public ResponseEntity<?> registerInventoryItems(
            @RequestBody List<InventoryItemRequestDTO> request
    ){
        try{
            for (InventoryItemRequestDTO item:request) {
                inventoryItemService.saveOrUpdate(item);
            }
            return ResponseEntity.ok("Loaded");
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
