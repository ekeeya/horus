package com.oddjobs.services.reports;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class ExporterServiceImpl implements ExporterService{

    @Override
    public <T> byte[] writeToExcel(List<T> data, List<String> columnNames) {
        try (Workbook workbook = WorkbookFactory.create(true);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Data");
            generateRows(data, columnNames, sheet);
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            e.printStackTrace();
        }
        return null;
    }
}
