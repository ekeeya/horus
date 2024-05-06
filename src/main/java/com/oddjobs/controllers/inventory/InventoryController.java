package com.oddjobs.controllers.inventory;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.base.BaseResponse;
import com.oddjobs.dtos.base.ListResponseDTO;
import com.oddjobs.entities.PosCenterEntity;
import com.oddjobs.entities.inventory.Category;
import com.oddjobs.entities.inventory.InventoryItem;
import com.oddjobs.entities.inventory.Order;
import com.oddjobs.entities.inventory.OrderItem;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.users.User;
import com.oddjobs.exceptions.PosCenterNotFoundException;
import com.oddjobs.repositories.inventory.CategoryRepository;
import com.oddjobs.repositories.inventory.InventoryItemsRepository;
import com.oddjobs.repositories.inventory.OrderItemRepository;
import com.oddjobs.repositories.inventory.OrderRepository;
import com.oddjobs.services.BackgroundTaskExecutor;
import com.oddjobs.services.inventory.CategoryService;
import com.oddjobs.services.inventory.InventoryItemService;
import com.oddjobs.services.inventory.types.*;
import com.oddjobs.services.pos.POSService;
import com.oddjobs.services.reports.ExporterService;
import com.oddjobs.services.reports.types.OrderItemExportDTO;
import com.oddjobs.services.reports.types.OrdersExportDTO;
import com.oddjobs.utils.Utils;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
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
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/inventory")
public class InventoryController {
    private final InventoryItemsRepository inventoryItemsRepository;
    private  final CategoryRepository categoryRepository;
    private final CategoryService categoryService;
    private final InventoryItemService inventoryItemService;
    private final OrderRepository orderRepository;
    private final BackgroundTaskExecutor backgroundTaskExecutor;
    private final ContextProvider contextProvider;
    private final OrderItemRepository orderItemRepository;
    private final ExporterService exporterService;
    private final POSService posService;


    protected enum FileType{
        inventory_items, categories
    }


    private String convertToCSV(List<String> fields, List<?> objects) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(outputStream);
        for (int i = 0; i < fields.size(); i++) {
            writer.append(fields.get(i));
            if (i < fields.size() - 1) {
                writer.append(",");
            }
        }
        writer.append("\n");
        for (Object object : objects) {
            for (int i = 0; i < fields.size(); i++) {
                try {
                    Field field = object.getClass().getDeclaredField(fields.get(i));
                    field.setAccessible(true);
                    Object value = field.get(object);
                    writer.append(String.valueOf(value));
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    e.printStackTrace();
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

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "1000") int size,
            @RequestParam(name="name", required = false) String name
    ){
        Page<Category> categories = categoryService.fetchCategories(size, page, name);
        ListResponseDTO<CategoryResponseDTO> listResponseDTO =  new ListResponseDTO<>(categories.getContent()
                .stream().map(CategoryResponseDTO::new).toList(), categories.getTotalElements());

        return ResponseEntity.ok(listResponseDTO);
    }


    @Secured({"ROLE_ADMIN", "ROLE_POS"})
    @PostMapping("/categories")
    public ResponseEntity<?> createCategories(
            @RequestBody List<CategoryRequestDTO> request
            ){
        try{
            List<CategoryResponseDTO> categories = new ArrayList<>();
            for (CategoryRequestDTO cat: request
            ) {
                categories.add(new CategoryResponseDTO(categoryService.saveOrUpdate(cat)));
            }
            return ResponseEntity.ok(categories);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return  ResponseEntity.internalServerError().body(e.getMessage());
        }
    }


    @DeleteMapping("/inventory-items/{id}")
    @Secured({"ROLE_POS", "ROLE_ADMIN"})
    public ResponseEntity<?> deleteItems(
            @PathVariable(value = "id") Long id
    ){
        try{
            InventoryItem item =  inventoryItemService.findById(id);
            inventoryItemsRepository.delete(item);
            log.info("Delete item: {}", item);
            return ResponseEntity.ok(id);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/inventory-items")
    public ResponseEntity<?> findInventoryItems(
            @RequestParam(value = "posId", required = false) Long posId,
            @RequestParam(value = "q", required = false) String searchTerm,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) throws PosCenterNotFoundException {
        if (searchTerm != null){
            page = 0;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        User user = contextProvider.getPrincipal();
        Page<InventoryItem> items;
        PosCenterEntity pos = null;
        Category category = null;
        if(categoryId != null){
            category = categoryService.findById(categoryId);
        }
        if(posId != null){
            pos =  posService.findById(posId);
        }
        if(user instanceof POSAttendant){
            pos = ((POSAttendant) user).getPosCenter();
        }
        if (pos != null) {
            if(category != null && searchTerm == null){
                items = inventoryItemsRepository.findInventoryItemsByPosAndCategory(pos,category,pageable);
            } else if (category ==null && searchTerm !=null) {
                items = inventoryItemsRepository.findInventoryItemsByPosAndNameLike(pos, searchTerm, pageable);
            }
            else if (category != null) {
                items = inventoryItemsRepository.findInventoryItemsByPosAndCategoryAndNameLikeIgnoreCase(pos, category, searchTerm, pageable);
            }
            else{
                items = inventoryItemsRepository.findInventoryItemsByPosOrderByFrequencyDesc(pos, pageable);
            }
        } else if (searchTerm !=null) {
            items = inventoryItemsRepository.findInventoryItemsByNameLikeIgnoreCase(searchTerm, pageable);
        }else{
            items = inventoryItemsRepository.findInventoryItemsBy(pageable);
        }

        ListResponseDTO<InventoryItemResponseDTO> responseDTO = new ListResponseDTO<>(items.getContent().stream()
                .map(InventoryItemResponseDTO::new).toList(), items.getTotalPages());
        return ResponseEntity.ok(responseDTO);

    }


    @GetMapping("/orders")
    public ResponseEntity<?> findOrders(
            @RequestParam(value = "posId", required = false) Long posId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(name="lowerDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date lowerDate,
            @RequestParam(name="upperDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date upperDate,
            @RequestParam(name="format", required = false) String format
    ) throws PosCenterNotFoundException {
        User user = contextProvider.getPrincipal();
        PosCenterEntity pos = null;
        Page<Order> orders;
        if(format != null){
            size = Integer.MAX_VALUE;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if(lowerDate == null || upperDate == null){
            List<Date> toDayDates = Utils.todayDates(null);
            lowerDate = toDayDates.get(0);
            upperDate = toDayDates.get(1);
        }
        if(posId != null){
            pos =  posService.findById(posId);
        }
        if(user instanceof POSAttendant){
            pos = ((POSAttendant) user).getPosCenter();
        }
        if (pos !=null){
            orders = orderRepository.findOrdersByPosAndCreatedAtBetween(pos, lowerDate, upperDate, pageable);
        }else{
            orders = orderRepository.findAllByCreatedAtBetween(lowerDate, upperDate, pageable);
        }
        if(format != null){
            List<OrdersExportDTO> exports = orders.stream().map(OrdersExportDTO::new).toList();
            List<String> fields = List.of("transactionId", "studentName", "cardNo", "amount", "date", "items", "status", "school", "pos");
            byte[] excelContent = exporterService.writeToExcel(exports, fields);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentLength(excelContent.length);
            headers.setContentDispositionFormData("attachment", "orders.xlsx");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelContent);
        }
        ListResponseDTO<OrderResponseDTO> response = new ListResponseDTO<>(orders.getContent().stream()
                .map(OrderResponseDTO::new).toList(), orders.getTotalPages());
        return ResponseEntity.ok(response);
    }


    @GetMapping ("/sales")
    public ResponseEntity<?> findSales(
            @RequestParam(value = "posId", required = false) Long posId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(name="lowerDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date lowerDate,
            @RequestParam(name="upperDate", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date upperDate,
            @RequestParam(name="format", required = false) String format
    ){
        try{
            User user = contextProvider.getPrincipal();
            PosCenterEntity pos = null;
            Page<OrderItem> items;
            if(format != null){
                size = Integer.MAX_VALUE;
            }
            Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
            if(lowerDate == null || upperDate == null){
                List<Date> toDayDates = Utils.todayDates(null);
                lowerDate = toDayDates.get(0);
                upperDate = toDayDates.get(1);
            }
            if(posId != null){
                pos =  posService.findById(posId);
            }
            if (user instanceof POSAttendant){
                pos =  ((POSAttendant) user).getPosCenter();
            }
            if (pos  != null){
                items =  orderItemRepository.findOrderItemsByOrder_StatusAndOrder_PosAndCreatedAtBetween(
                        Order.STATUS.Processed, pos, lowerDate, upperDate, pageable);
            }else{
                items =  orderItemRepository.findOrderItemsByOrder_StatusAndCreatedAtBetween(
                        Order.STATUS.Processed,
                        lowerDate, upperDate, pageable);
            }
            if(format != null){
                List<OrderItemExportDTO> exports = items.stream().map(OrderItemExportDTO::new).toList();
                List<String> fields = List.of("transactionId", "name", "category", "unitPrice", "quantity", "total", "orderId", "date", "pos", "school");
                byte[] excelContent = exporterService.writeToExcel(exports, fields);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentLength(excelContent.length);
                headers.setContentDispositionFormData("attachment", "sales.xlsx");
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(excelContent);
            }
            ListResponseDTO<OrderItemResponseDTO> response = new ListResponseDTO<>(items.getContent().stream()
                    .map(OrderItemResponseDTO::new).toList(), items.getTotalPages());
            return ResponseEntity.ok(response);

        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/import-categories")
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
                List<String> fields = List.of("name","icon","provider", "image");
                String message = String.format("Required field(s) is missing in the CSV data. Make sure csv is %s", fields);
                return ResponseEntity.badRequest().body(message);
            }
        } catch (IOException e) {
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/import-inventory-items/{posId}")
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
                // List<String> fields = List.of("name","category","price","pos_id", "quantity");
                // String message = String.format("Required field(s) is missing in the CSV data. Make sure csv is %s", fields);
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        } catch (IOException e) {
            log.error(e.getMessage(),e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/inventory-items")
    public ResponseEntity<?> registerInventoryItems(
            @RequestBody List<InventoryItemRequestDTO> request
    ){
        try{
            List<InventoryItemResponseDTO> items = new ArrayList<>();
            for (InventoryItemRequestDTO item:request) {

                InventoryItem inventoryItem =  inventoryItemService.saveOrUpdate(item);
                items.add(new InventoryItemResponseDTO(inventoryItem));
            }
            return ResponseEntity.ok(items);
        }catch (Exception e){
            log.error(e.getMessage(), e);
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/export/csv")
    public ResponseEntity<?> exportCSV(
            @RequestParam(value = "posId", required = false) Long posId,
            @RequestParam(value = "type") FileType type
    ) {
        List<FileType> fileTypes = List.of(new FileType[]{FileType.inventory_items, FileType.categories});
        if (!fileTypes.contains(type)){
            return ResponseEntity.badRequest().body("Wrong file type specified, please use inventory_items or categories");
        }
        try {
            byte[] csvBytes;
            List<String> fields;
            List<?> items;
            String filename;
            if(type==FileType.inventory_items){
                PosCenterEntity posCenter =  posService.findById(posId);
                items = inventoryItemsRepository.findInventoryItemsByPosOrderByFrequencyDesc(posCenter);
                items = items.stream().map(r-> new InventoryItemExportDTO((InventoryItem) r)).toList();
                filename = "inventory_items.csv";
                fields = List.of("id", "name", "categoryId", "price", "posId", "quantity", "frequency");
            }else{
                items = categoryRepository.findAllByOrderByIdAsc();
                items =  items.stream().map(r->new CategoryResponseDTO((Category) r)).toList();
                fields = List.of("id", "name", "icon", "provider", "frequency", "image");
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
