package com.oddjobs.services.reports;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import java.lang.reflect.Field;
import java.util.List;

public interface ExporterService {
    default   <T> void generateRows(List<T> data, List<String> columnNames, Sheet sheet) {
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columnNames.size(); i++) {
            headerRow.createCell(i).setCellValue(columnNames.get(i));
        }
        int rowNumber = 1;
        for (T obj : data) {
            Row row = sheet.createRow(rowNumber++);
            for (int i = 0; i < columnNames.size(); i++) {
                String fieldName = columnNames.get(i);
                try {
                    Field field = obj.getClass().getDeclaredField(fieldName);
                    field.setAccessible(true);
                    Object value = field.get(obj);
                    if (value != null) {
                        row.createCell(i).setCellValue(value.toString());
                    }
                } catch (NoSuchFieldException | IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        }
        for (int i = 0; i < columnNames.size(); i++) {
            sheet.autoSizeColumn(i);
        }
    }


     <T> byte[] writeToExcel(List<T> data, List<String> columnNames);

}
