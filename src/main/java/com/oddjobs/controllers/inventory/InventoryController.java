package com.oddjobs.controllers.inventory;

import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.Category;
import com.oddjobs.entities.inventory.InventoryItem;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.repositories.inventory.CategoryRepository;
import com.oddjobs.repositories.inventory.InventoryItemsRepository;
import com.oddjobs.services.BackgroundTaskExecutor;
import com.oddjobs.services.inventory.CategoryService;
import com.oddjobs.services.inventory.InventoryItemService;
import com.oddjobs.services.inventory.types.*;
import com.oddjobs.services.pos.POSService;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/")
public class InventoryController {
    private final InventoryItemsRepository inventoryItemsRepository;
    private  final CategoryRepository categoryRepository;
    private final CategoryService categoryService;
    private final InventoryItemService inventoryItemService;
    private final BackgroundTaskExecutor backgroundTaskExecutor;

    private final POSService posService;


    protected enum FileType{
        inventory_items, categories
    }


    private String convertToCSV(List<String> fields, List<?> objects) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(outputStream);

        // Writing header
        for (int i = 0; i < fields.size(); i++) {
            writer.append(fields.get(i));
            if (i < fields.size() - 1) {
                writer.append(",");
            }
        }
        writer.append("\n");

        // Writing data
        for (Object object : objects) {
            for (int i = 0; i < fields.size(); i++) {
                try {
                    Field field = object.getClass().getDeclaredField(fields.get(i));
                    field.setAccessible(true);
                    Object value = field.get(object);
                    writer.append(String.valueOf(value));
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    e.printStackTrace();
                    // Handle field not found or access exception
                }
                if (i < fields.size() - 1) {
                    writer.append(",");
                }
            }
            writer.append("\n");
        }

        writer.flush();
        writer.close();
        return outputStream.toString();
    }

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

    @PostMapping("import-inventory-items/{posId}")
    public ResponseEntity<?> bulkLoadInventoryItems(
            @PathVariable(value="posId") Long posId,
            @RequestParam(value = "file", required = false) MultipartFile file
    ){
        try (Reader reader = new BufferedReader(new InputStreamReader((file.getInputStream())))) {
            CsvToBean<BulkInventoryItemRequestDTO> csvToBean = new CsvToBeanBuilder<BulkInventoryItemRequestDTO>(reader)
                    .withType(BulkInventoryItemRequestDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withIgnoreEmptyLine(true)
                    .build();
            try {
                List<BulkInventoryItemRequestDTO> bulkCategories =  csvToBean.parse();
                Runnable runnable = () -> {
                    try {
                        for (BulkInventoryItemRequestDTO importData: bulkCategories ) {
                            try{
                                importData.setPosId(posId);
                                inventoryItemService.bulkSaveInventory(importData);
                            }catch (Exception e){
                                String error = String.format("Failed to record category due to: %s %s", e.getMessage(), importData);
                                log.error(e.getMessage(), error);
                            }
                        }
                        log.debug(String.format("%s inventory items have been loaded in bulk", bulkCategories.size()));
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

    @GetMapping("export/csv")
    public ResponseEntity<?> exportCSV(
            @RequestParam(value = "posId") Long posId,
            @RequestParam(value = "type") FileType type
    ) {
        List<FileType> fileTypes = List.of(new FileType[]{FileType.inventory_items, FileType.categories});
        if (!fileTypes.contains(type)){
            return ResponseEntity.badRequest().body("Wrong file type specified, please use inventory_items or categories");
        }
        try {
            PosCenterEntity posCenter =  posService.findById(posId);
            byte[] csvBytes;
            List<String> fields;
            List<?> items;
            String filename;
            if(type==FileType.inventory_items){
                items = inventoryItemsRepository.findInventoryItemsByPos(posCenter);
                filename = "inventory_items.csv";
                fields = List.of("id", "name", "category", "price", "pos", "quantity", "frequency");
            }else{
                items = categoryRepository.findAll();
                fields = List.of("id", "name", "icon", "provider", "image");
                filename = "categories.csv";
            }
            csvBytes = convertToCSV(fields, items).getBytes();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("filename", filename);

            return new ResponseEntity<>(csvBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (PosCenterNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
