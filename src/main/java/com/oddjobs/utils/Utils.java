package com.oddjobs.utils;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.time.*;
import java.util.*;

public class Utils {

    public static enum COMMISSION_TYPE{
        SCHOOL, SYSTEM
    }

    public static enum ORDER_STATUS{
        PENDING, EXECUTED, EXECUTING, PAUSED
    }

    public static enum COMMISSION_STATUS{
        PENDING, COMPLETED, CANCELLED
    }

    public static enum COMMISSION_TERM{
        I, II, III
    }

    public static enum ACCOUNT_ACTIONS  {
        Delete, Disable, Enable
    }
    public static enum PROVIDER_TYPES{
        TELECOMS, RELWORX
    }

    public  static enum WALLET_ACCOUNT_TYPES{
        SYSTEM(Values.SYSTEM),
        SCHOOL_COLLECTION(Values.SCHOOL_COLLECTION),
        COMMISSION(Values.COMMISSION),
        SCHOOL_WITHDRAW(Values.SCHOOL_WITHDRAW),
        SCHOOL_PAYMENT(Values.SCHOOL_PAYMENT),
        STUDENT(Values.STUDENT);
        private WALLET_ACCOUNT_TYPES (String val) {
            // force equality between name of enum instance, and value of constant
            if (!this.name().equals(val))
                throw new IllegalArgumentException("Incorrect use of ELanguage");
        }

        public static class Values {
            public static final String SYSTEM= "SYSTEM";
            public static final String COMMISSION= "COMMISSION";
            public static final String SCHOOL_COLLECTION= "SCHOOL_COLLECTION";
            public static final String SCHOOL_WITHDRAW= "SCHOOL_WITHDRAW";
            public static final String SCHOOL_PAYMENT= "SCHOOL_PAYMENT";
            public static final String STUDENT= "STUDENT";
        }
    }
    public static enum ACCOUNT_TYPE{
        PARENT(Values.PARENT), POS(Values.POS), ADMIN(Values.ADMIN),SCHOOL_ADMIN(Values.SCHOOL_ADMIN);
        private ACCOUNT_TYPE (String val) {
            // force equality between name of enum instance, and value of constant
            if (!this.name().equals(val))
                throw new IllegalArgumentException("Incorrect use of ELanguage");
        }

        public static class Values {
            public static final String ADMIN= "ADMIN";
            public static final String PARENT= "PARENT";
            public static final String POS= "POS";
            public static final String SCHOOL_ADMIN= "SCHOOL_ADMIN";
        }
    }

    public static enum ROLES{
        ROLE_ADMIN, ROLE_POS, ROLE_PARENT,ROLE_SCHOOL, ROLE_PRE_VERIFIED
    }

    public static enum GENDER{
        MALE, FEMALE, OTHER, UNKNOWN
    }

    public static enum EASY_PAY_RESPONSE_STATUSES{
        Success, Failed, Pending
    }

    public static enum PROVIDER{
        MTN(Values.MTN),
        AIRTEL(Values.AIRTEL),
        RELWORX(Values.RELWORX),

        SYSTEM(Values.SYSTEM);
        private PROVIDER (String val) {
            // force equality between name of enum instance, and value of constant
            if (!this.name().equals(val))
                throw new IllegalArgumentException("Incorrect use of PROVIDER");
        }

        public static class Values {
            public static final String MTN= "MTN";
            public static final String RELWORX = "RELWORX";
            public static final String AIRTEL= "AIRTEL";
            public static final String SYSTEM= "SYSTEM";
        }
    }

    public static enum SUBSCRIPTION_STATE{
       INACTIVE, ACTIVE
    }

    public static enum SUBSCRIPTION_PLAN{
        MONTHLY (1), TERMLY(3), ANNUALLY(12);
        private final int months;

        SUBSCRIPTION_PLAN(int months) {
            this.months = months;
        }

        public int getMonths() {
            return months;
        }
    }
    public static enum TRANSACTION_TYPE{
        COLLECTION(Values.COLLECTION),
        DISBURSEMENT(Values.DISBURSEMENT),
        PAYMENT(Values.PAYMENT),
        COMMISSIONS(Values.COMMISSIONS),
        CASH_OUT(Values.CASH_OUT),
        SYSTEM(Values.SYSTEM),;
        private TRANSACTION_TYPE (String val) {
            // force equality between name of enum instance, and value of constant
            if (!this.name().equals(val))
                throw new IllegalArgumentException("Incorrect use of TRANSACTION_TYPE");
        }

        public static class Values {
            public static final String COLLECTION= "COLLECTION";
            public static final String DISBURSEMENT= "DISBURSEMENT";
            public static final String CASH_OUT="CASH_OUT";
            public static final String PAYMENT= "PAYMENT";
            public static final String COMMISSIONS= "COMMISSIONS";
            public static final String SYSTEM= "SYSTEM";
        }
    }

    public static enum ENV{
        SANDBOX, PRODUCTION
    }
    public static enum TRANSACTION_STATUS{
        SUCCESS, FAILED, PENDING, CANCELLED, EXPIRED
    }

    public static enum TRANSACTION_NATURE{
        DEBIT, CREDIT
    }

    public static enum WALLET_STATUS{
       PENDING, SUSPENDED, ACTIVE, DISABLED, NOT_PAID
    }
    public static enum PRODUCT_TYPE{
        COLLECTIONS, DISBURSEMENT
    }
    public static enum AIRTEL_CODES{
        DP00800001001(Values.DP00800001001), DP00800001003(Values.DP00800001003), DP00800001004(Values.DP00800001004),
        DP00800001005(Values.DP00800001005), DP00800001006(Values.DP00800001006), DP00800001007(Values.DP00800001007),
        DP00800001008(Values.DP00800001008), DP00800001010(Values.DP00800001010), DP00800001024(Values.DP00800001024)
        ;
        private AIRTEL_CODES (String val) {
            // force equality between name of enum instance, and value of constant
            if (!this.name().equals(val))
                throw new IllegalArgumentException("Incorrect use of ELanguage");
        }

        public static class Values {
            public static final String DP00800001001= "Transaction is successful";
            public static final String DP00800001003= "Exceeds withdrawal amount limit(s) / Withdrawal amount limit exceeded";
            public static final String DP00800001004= "Invalid Amount";
            public static final String DP00800001005= "User didn't enter the pin";
            public static final String DP00800001006="In process";
            public static final String DP00800001007="Not enough balance";
            public static final String DP00800001008="Refused";
            public static final String DP00800001010="Transaction not permitted to Payee";
            public static final String DP00800001024="Transaction Timed Out";
        }
    }

    private static Boolean objectHasProperty(Object obj, String propertyName){
        List<Field> properties = getAllFields(obj);
        for(Field field : properties){
            if(field.getName().equalsIgnoreCase(propertyName)){
                return true;
            }
        }
        return false;
    }

    public static Map<String, Object> convertToHashMap(Object obj) {
        Map<String, Object> hashMap = new HashMap<>();

        // Use reflection to access the fields of the object
        Field[] fields = obj.getClass().getDeclaredFields();

        try {
            for (Field field : fields) {
                if(!field.getName().equals("serialVersionUID")) {
                    field.setAccessible(true);
                    String fieldName = field.getName();
                    Object fieldValue = field.get(obj);

                    hashMap.put(fieldName, fieldValue);
                }
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

        return hashMap;
    }


    private static List<Field> getAllFields(Object obj){
        List<Field> fields = new ArrayList<Field>();
        getAllFieldsRecursive(fields, obj.getClass());
        return fields;
    }

    private static List<Field> getAllFieldsRecursive(List<Field> fields, Class<?> type) {
        for (Field field: type.getDeclaredFields()) {
            fields.add(field);
        }

        if (type.getSuperclass() != null) {
            fields = getAllFieldsRecursive(fields, type.getSuperclass());
        }

        return fields;
    }
    public static void setProperties(Object object, Map<String, Object> fields){
        BeanWrapper o = new BeanWrapperImpl(object);
        for (Map.Entry<String, Object> property : fields.entrySet()) {
            if(objectHasProperty(object, property.getKey())){
                o.setPropertyValue(property.getKey(), property.getValue());
            }
        }
    }

    public static String[] getNullPropertyNames(Object source) {
        final BeanWrapper beanWrapper = new BeanWrapperImpl(source);
        PropertyDescriptor[] propertyDescriptors = beanWrapper.getPropertyDescriptors();

        List<String> nullProperties = new ArrayList<>();
        for (PropertyDescriptor propertyDescriptor : propertyDescriptors) {
            String propertyName = propertyDescriptor.getName();
            if (beanWrapper.getPropertyValue(propertyName) == null) {
                nullProperties.add(propertyName);
            }
        }
        return nullProperties.toArray(new String[0]);
    }

    public static long generateRandomNumber(long minRange, long maxRange) {
        Random random = new Random();
        return minRange + ((long) (random.nextDouble() * (maxRange - minRange)));
    }

    public static String generateRandomRegNo(){
        long currentTime = System.currentTimeMillis() / 1000;
        Year currentYear = Year.now();
        long random = generateRandomNumber(1L, 100L);
        long finalNum = random+currentTime;
        return String.format("%s%s",currentYear.getValue(),finalNum);
    }

    public static String generateRandomRefNo(){
        long currentTime = System.currentTimeMillis() / 1000;
        Year currentYear = Year.now();
        return String.format("REF%s%s",currentYear.getValue(),currentTime);
    }

    public static String generateTransactionId(){
        long currentTime = System.currentTimeMillis() / 1000;
        Year currentYear = Year.now();
        return String.format("TR%s%s",currentYear.getValue(),currentTime);
    }

    public static int calculateLuhnCheckDigit(String cardNumber) {
        int sum = 0;
        boolean alternate = false;

        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));

            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            alternate = !alternate;
        }

        return (10 - (sum % 10)) % 10;
    }

    public static String generateCardNumber() {
        Random random = new Random();
        String issuerIdentificationNumber = generateRandomIIN();
        StringBuilder cardNumber = new StringBuilder(issuerIdentificationNumber);

        // Generate random digits for the remaining card number
        while (cardNumber.length() < 15) {
            int digit = random.nextInt(10);
            cardNumber.append(digit);
        }
        // Calculate the check digit using the Luhn algorithm
        int checkDigit = calculateLuhnCheckDigit(cardNumber.toString());
        cardNumber.append(checkDigit);

        return cardNumber.toString();
    }

    public static String generateRandomIIN() {
        String[] iinList = {"400000", "511234", "341234", "370001", "601100", "653456", "300234", "361234", "380001", "352345"};
        Random random = new Random();
        int index = random.nextInt(iinList.length);
        return iinList[index];
    }

    public static enum APPROVAL_TYPES{
        SCHOOL_APPROVAL(Values.SCHOOL_APPROVAL), PARENT_APPROVAL(Values.PARENT_APPROVAL);
        private APPROVAL_TYPES (String val) {
            if (!this.name().equals(val))
                throw new IllegalArgumentException("Incorrect use of approval enum");
        }

        public static class Values {
            public static final String SCHOOL_APPROVAL= "SCHOOL_APPROVAL";
            public static final String PARENT_APPROVAL= "PARENT_APPROVAL";
        }
    }

    public static String toShortDate(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy");
        return formatter.format(date);
    }
    public static LocalDate dateToLocalDate(Date date) {
        Instant instant = date.toInstant();
        return instant.atZone(ZoneId.systemDefault()).toLocalDate();
    }
    public static List<Date> todayDates(Date date){
        List<Date> dates = new ArrayList<>();
        LocalDate currentDate = LocalDate.now();
        if (date != null){
            currentDate = dateToLocalDate(date);
        }
        // Get midnight time
        LocalDateTime midnight = LocalDateTime.of(currentDate, LocalTime.MIDNIGHT);
        // Convert LocalDateTime to Date
        Date midDate = Date.from(midnight.atZone(ZoneId.systemDefault()).toInstant());
        LocalDateTime endOfDay = LocalDateTime.of(currentDate, LocalTime.of(23, 59, 59, 999_000_000));
        // Convert LocalDateTime to Date
        Date endDate = Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());
        dates.add(midDate);
        dates.add(endDate);
        return dates;
    }

    public static Date getPastDate(Date currentDate, int days) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentDate);
        calendar.add(Calendar.DAY_OF_YEAR, -days);
        return calendar.getTime();
    }

    public static String sanitizeMsisdn(String tel, Utils.PROVIDER provider) throws Exception {
        if (tel.length()  < 10 || tel.length() > 13){
            String error = String.format("Bad phone number length for: %s", tel);
            throw new Exception(error);
        }
        if (provider == null){
            if (tel.startsWith("0")){
                return String.format("256%s", tel.substring(1));
            } else if (tel.startsWith("+256")) {
                return tel.substring(1);
            }
        }else{
            String cleanTel = "";
            if (tel.startsWith("0")){
                cleanTel = tel.substring(1);
            } else if (tel.startsWith("+256")) {
                cleanTel = tel.substring(4);
            }
            if (provider == PROVIDER.RELWORX){
                return  "+256" + cleanTel;
            }
            return cleanTel;
        }

        return tel.substring(3,tel.length());
    }

    public static String noPrefixMsisdn(String tel){
        if (tel.startsWith("0")){
            return tel.substring(1,tel.length());
        } else if (tel.startsWith("+256")) {
            return tel.substring(4,tel.length());
        }
        else if(tel.length() == 9){
            return  tel;
        }
        return tel.substring(3,tel.length());
    }

    public static class BiWrapper<T, U> {
        private T k;
        private U l;

        public BiWrapper(T k, U l) {
            this.k = k;
            this.l = l;
        }

        public T getK() {
            return k;
        }

        public void setK(T k) {
            this.k = k;
        }

        public U getL() {
            return l;
        }

        public void setL(U l) {
            this.l = l;
        }
    }
}
