package com.oddjobs.dtos.requests;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class BulkStudentLoadRequestDTO {
    private String image; // base64 string
    @CsvBindByName(column = "first_name", required = true)
    private String firstName;
    @CsvBindByName(column = "last_name",required = true)
    private String lastName;
    @CsvBindByName(column = "middle_name")
    private String middleName;
    @CsvBindByName(column = "class",required = true)
    private String classRoom;  //these will be provided simple integers

    @CsvBindByName(column = "parent_names")
    private String parentNames; // default assume to be firstName, Middle, Last

    @CsvBindByName(column = "parent_telephone")
    private String parentTelephone;

    @CsvBindByName(column = "parent_email")
    private String parentEmail;


    public BulkStudentLoadRequestDTO() {} // this is required

    public BulkStudentLoadRequestDTO(String image, String firstName, String lastName, String middleName, String classRoom, String parentNames, String parentTelephone, String parentEmail) {
        this.image = image;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.classRoom = classRoom;
        this.parentNames = parentNames;
        this.parentTelephone = parentTelephone;
        this.parentEmail = parentEmail;
    }
}
