package com.oddjobs.dtos.requests;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class BulkStudentLoadRequestDTO {
    private String image; // base64 string
    @CsvBindByName(column = "first_name", required = true)
    private String firstName;
    @CsvBindByName(column = "last_name")
    private String lastName="";
    @CsvBindByName(column = "middle_name")
    private String middleName;
    @CsvBindByName(column = "parent_names")
    private String parentNames; // default assume to be firstName, Middle, Last

    @CsvBindByName(column = "parent_telephone")
    private String parentTelephone;

    @CsvBindByName(column = "parent_email")
    private String parentEmail;

        @CsvBindByName(column = "daily_limit")
    private Double dailyLimit = 0.0;
    @CsvBindByName(column = "balance")
    private Double balance = 0.0;

    @CsvBindByName(column = "card_no")
    private String cardNo;



    public BulkStudentLoadRequestDTO() {} // this is required

    public BulkStudentLoadRequestDTO(String image, String firstName, String lastName, String middleName, String parentNames, String parentTelephone, String parentEmail) {
        this.image = image;
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.parentNames = parentNames;
        this.parentTelephone = parentTelephone;
        this.parentEmail = parentEmail;
    }
}
