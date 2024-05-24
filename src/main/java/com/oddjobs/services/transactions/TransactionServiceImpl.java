package com.oddjobs.services.transactions;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.relworx.response.WebHookResponseData;
import com.oddjobs.dtos.requests.CallBackDataDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.inventory.Order;
import com.oddjobs.entities.transactions.*;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.entities.users.SchoolUser;
import com.oddjobs.entities.users.User;
import com.oddjobs.exceptions.TransactionDoesNotExistException;
import com.oddjobs.repositories.mm.MMTransactionRepository;
import com.oddjobs.repositories.transactions.PaymentTransactionRepository;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.repositories.transactions.WithDrawTransactionRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolCollectionAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.dtos.responses.TransactionResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TransactionServiceImpl implements TransactionService{

    private final MMTransactionRepository mmTransactionRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final WalletAccountRepository accountRepository;
    private final WithDrawTransactionRepository withDrawTransactionRepository;
    private final ContextProvider contextProvider;

    @Value("${application.default.currency}")
    private String DEFAULT_CURRENCY;
    protected void generatePaymentRows(List<TransactionResponseDTO> transactions, Sheet sheet){
        List<String> columnNames = List.of("ID", "Attendant","Attendant Contact","POS Center", "Student","CardNo", "School","Type","Status", "Amount", "Date");
        Row headerRow = sheet.createRow(0);
        for (int i=0; i<columnNames.size(); i++) {
            headerRow.createCell(i).setCellValue(columnNames.get(i));
        }
        // Create data rows
        int rowNumber = 1;
        for (TransactionResponseDTO transaction :transactions) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String createdAt = formatter.format(transaction.getCreatedAt());
            Row row = sheet.createRow(rowNumber++);
            row.createCell(0).setCellValue(transaction.getTransactionId());
            row.createCell(1).setCellValue(transaction.getPosAttendant().getFullName());
            row.createCell(2).setCellValue(transaction.getPosAttendant().getFullName());
            row.createCell(3).setCellValue(transaction.getPosAttendant().getPosCenterName());
            row.createCell(4).setCellValue(transaction.getDebitAccount().getStudent());
            row.createCell(5).setCellValue(transaction.getDebitAccount().getCardNo());
            row.createCell(6).setCellValue(transaction.getSchool().getName());
            row.createCell(7).setCellValue(transaction.getTransactionType().toString());
            row.createCell(8).setCellValue(transaction.getStatus().toString());
            row.createCell(9).setCellValue(transaction.getAmount().doubleValue());
            row.createCell(10).setCellValue(createdAt);
        }
        // Auto-size the columns
        for (int i = 0; i < columnNames.size(); i++) {
            sheet.autoSizeColumn(i);
        }
    }

    protected void generateCollectionsRows(List<TransactionResponseDTO> transactions, Sheet  sheet){
        List<String> columnNames = List.of("ID", "Sender","Sender Telephone", "Student","CardNo", "School","Type","Status", "Amount", "Date");
        Row headerRow = sheet.createRow(0);
        for (int i=0; i<columnNames.size(); i++) {
            headerRow.createCell(i).setCellValue(columnNames.get(i));
        }
        // Create data rows
        int rowNumber = 1;
        for (TransactionResponseDTO transaction :transactions) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String createdAt = formatter.format(transaction.getCreatedAt());
            Row row = sheet.createRow(rowNumber++);
            row.createCell(0).setCellValue(transaction.getTransactionId());
            row.createCell(1).setCellValue(transaction.getSender().getFullName());
            row.createCell(2).setCellValue(transaction.getSender().getTelephone());
            row.createCell(3).setCellValue(transaction.getReceiver().getFullName());
            row.createCell(4).setCellValue(transaction.getReceiver().getWallet().getCardNo());
            row.createCell(5).setCellValue(transaction.getSchool().getName());
            row.createCell(6).setCellValue("DEPOSIT");
            row.createCell(7).setCellValue(transaction.getStatus().toString());
            row.createCell(8).setCellValue(transaction.getAmount().doubleValue());
            row.createCell(9).setCellValue(createdAt);
        }
        // Auto-size the columns
        for (int i = 0; i < 12; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    @Override
    @Transactional
    public Utils.BiWrapper<Transaction, Order> recordPaymentTransaction(StudentWalletAccount account, BigDecimal amount, CashoutTransaction t, Order order) {
        User user =  contextProvider.getPrincipal();
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setTransactionId(Utils.generateTransactionId());
        if (user instanceof POSAttendant){
            transaction.setAttendant((POSAttendant) user);
        }
        transaction.setAmount(amount);
        transaction.setCashoutTransaction(t);
        transaction.setSchool(account.getStudent().getSchool());
        transaction.setNature(Utils.TRANSACTION_NATURE.DEBIT);
        transaction.setCurrency(DEFAULT_CURRENCY);
        transaction.setDebitAccount(account);
        String description =  String.format("A payment of %s has been made from card %s", amount,account.getCardNo());
        transaction.setDescription(description);
        transaction =  transactionRepository.save(transaction);
        if (order != null){
            order.setTransaction(transaction);
            order.setStatus(Order.STATUS.Processed);
        }

        transactionRepository.updateTransactionStatus(Utils.TRANSACTION_STATUS.SUCCESS.toString(), transaction.getId());
        return new Utils.BiWrapper<>(transaction, order);
    }

    @Override
    public WithDrawTransaction recordDisbursementTransaction(WithdrawRequest request) {
        WithDrawTransaction transaction = new WithDrawTransaction();
        transaction.setTransactionId(Utils.generateTransactionId());
        transaction.setAmount(request.getAmount());
        transaction.setSchool(request.getSchool());
        transaction.setCreditAccount(request.getCreditAccount());
        transaction.setDebitAccount(request.getDebitAccount());
        transaction.setRequest(request);
        return transactionRepository.save(transaction);
    }

    @Override
    public WithDrawTransaction findByWithDrawRequest(WithdrawRequest request) {
        return withDrawTransactionRepository.findWithDrawTransactionByRequest(request);
    }

    @Override
    public <T extends MMTransaction> T findByMMTransactionRef(String ref) {
        return mmTransactionRepository.findMMTransactionByRef(ref);
    }

    @Override
    public <T extends MMTransaction> T findByMMTransactionXrefId(String xReferenceId)  {
        return mmTransactionRepository.findMMTransactionByXreferenceId(xReferenceId);
    }

    @Override
    public <T extends MMTransaction> T findByMMTransactionTransactionId(String transactionId){
        return mmTransactionRepository.findMMTransactionByTransactionId(transactionId);

    }

    @Override
    public Transaction findById(Long id) throws TransactionDoesNotExistException {
        try{
            return transactionRepository.findById(id).get();
        }catch (NoSuchElementException e){
            throw new TransactionDoesNotExistException(id);
        }
    }

    @Override
    public Transaction findTransactionById(String transactionId){
        return transactionRepository.findTransactionByTransactionId(transactionId);
    }

    @Override
    public <T extends Transaction> T findTransactionByMMTransaction(MMTransaction t) {
        return transactionRepository.findByMMTransaction(t);
    }

    @Override
    public void updateTransactionOnCallback(WebHookResponseData request) throws TransactionDoesNotExistException {

        CallBackDataDTO data = new CallBackDataDTO(
                request.getCustomer_reference(),
                null,
                request.getMessage(),
                Utils.PROVIDER.RELWORX,
                request.getAmount(),
                request.getCharge(),
                request.getStatus(),
                request
        );
        log.info("Entering update transaction on callback with data {}", data);
        MMTransaction mmTransaction;
        switch (data.getProvider()){
            case MTN -> mmTransaction =  findByMMTransactionXrefId(data.getXRef());
            case AIRTEL -> mmTransaction =  findByMMTransactionTransactionId(data.getTransactionId());
            default -> mmTransaction =  findByMMTransactionRef(data.getXRef());
        }

        if (mmTransaction ==  null){
            // this should never happen.
            log.error("We could not retrieve mobile money transaction");
            throw new TransactionDoesNotExistException(data.toString());
        }
        if (mmTransaction.getStatus() != Utils.TRANSACTION_STATUS.PENDING){
            // already been updated by poller or duplicate callback
            log.warn("Transaction is already updated {}", mmTransaction);
            return;
        }
        Utils.TRANSACTION_STATUS tStatus = Utils.TRANSACTION_STATUS.valueOf(data.getStatus());
        mmTransaction.setStatus(tStatus);
        mmTransaction.setReason(data.getReason());
        mmTransaction.setCharge(BigDecimal.valueOf(data.getCharge()));
        mmTransaction.setResponse(data.getPayload());
        mmTransactionRepository.save(mmTransaction);
        // Update collections transaction.
        CollectionTransaction transaction = findTransactionByMMTransaction(mmTransaction);
        if (transaction == null){
            // should never happen either.
            log.error("We could not retrieve collections transaction {}", mmTransaction);
            String msg = String.format("Collections Transaction from mmTransaction ref %s",mmTransaction);
            throw new TransactionDoesNotExistException(msg);
        }
        transaction.setTotalPlusCharges(BigDecimal.valueOf(data.getCharge() + data.getAmount()));
        transactionRepository.updateTransactionStatus(tStatus.toString(), transaction.getId());
        transactionRepository.save(transaction);
        log.info("Leaving update transaction on callback with transaction {}", transaction);
    }

    @Override
    public List<PaymentTransaction> getPaymentsByAccountAndDateRange(StudentWalletAccount account, Date lowerDate, Date upperDate) {
        return paymentTransactionRepository.findPaymentTransactionsByDebitAccountAndCreatedAtBetween(account, lowerDate, upperDate);
    }

    @Override
    public BigDecimal calculateTotalTransactionsAmount(List<? extends Transaction> transactions) {
        BigDecimal amount = BigDecimal.valueOf(0.0);
        for (Transaction transaction:transactions) {
            amount =  amount.add(transaction.getAmount());
        }
        return amount;
    }

    @Override
    public Page<Transaction> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page,size, Sort.by("id").descending());
        return transactionRepository.findAll(pageable);
    }

    @Override
    public Page<Transaction> findByType(Utils.TRANSACTION_TYPE type, int page, int size) {
        Pageable pageable =  PageRequest.of(page,size, Sort.by("id").descending());

        return null;
    }

    @Override
    public byte[] writeRecordsToExcel(List<TransactionResponseDTO> transactions, String type) {
        try (Workbook workbook = WorkbookFactory.create(true);
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // Create header row
            Sheet sheet = workbook.createSheet("Transactions");
            //List<String> columnNames = List.of("ID", "Attendant","POS Center", "Student","Class","CardNo", "School","Type","Status", "Amount", "Date");
            if (Objects.equals(type, "PAYMENT")){
                generatePaymentRows(transactions, sheet);
            } else if (Objects.equals(type, "COLLECTION")) {
                generateCollectionsRows(transactions, sheet);
            }
            // Write the workbook to the output stream
            workbook.write(outputStream);
            // Retrieve the byte array of the written content
            return outputStream.toByteArray();
        } catch (IOException e) {
            log.error(e.getMessage(), e);
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public byte[] writeRecordsToCsv(Page<Transaction> page) {
        return new byte[0];
    }

    @Override
    public byte[] writeRecordsToPDF(Page<Transaction> page) {
        return new byte[0];
    }

    @Override
    public Double totalTransactionsByTypeAndStatus(Utils.TRANSACTION_TYPE type, Utils.TRANSACTION_STATUS status) {
        return transactionRepository.sumByTransactionTypeAndStatus(type, status);
    }

    @Override
    public Double totalTransactionsByTypeAndSchoolAndStatus(Utils.TRANSACTION_TYPE type, School school, Utils.TRANSACTION_STATUS status) {
        return transactionRepository.sumByTransactionTypeAndSchoolAndStatus(type, school, status);
    }
}
