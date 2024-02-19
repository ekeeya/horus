package com.oddjobs.services.transactions;

import com.oddjobs.components.ContextProvider;
import com.oddjobs.dtos.requests.CallBackDataDTO;
import com.oddjobs.entities.School;
import com.oddjobs.entities.WithdrawRequest;
import com.oddjobs.entities.transactions.mm.MMTransaction;
import com.oddjobs.exceptions.TransactionDoesNotExistException;
import com.oddjobs.repositories.mm.MMTransactionRepository;
import com.oddjobs.repositories.transactions.PaymentTransactionRepository;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.repositories.transactions.WithDrawTransactionRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.utils.Utils;
import com.oddjobs.entities.transactions.CollectionTransaction;
import com.oddjobs.entities.transactions.PaymentTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.users.POSAttendant;
import com.oddjobs.entities.wallets.AccountEntity;
import com.oddjobs.entities.wallets.SchoolWalletAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.dtos.responses.TransactionResponseDTO;
import com.oddjobs.entities.transactions.WithDrawTransaction;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
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


    protected void generatePaymentRows(List<TransactionResponseDTO> transactions, Sheet sheet){
        List<String> columnNames = List.of("ID", "Attendant","Attendant Contact","POS Center", "Student","Class","CardNo", "School","Type","Status", "Amount", "Date");
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
            row.createCell(5).setCellValue(transaction.getDebitAccount().getClassName());
            row.createCell(6).setCellValue(transaction.getDebitAccount().getCardNo());
            row.createCell(7).setCellValue(transaction.getSchool().getName());
            row.createCell(8).setCellValue(transaction.getTransactionType().toString());
            row.createCell(9).setCellValue(transaction.getStatus().toString());
            row.createCell(10).setCellValue(transaction.getAmount().doubleValue());
            row.createCell(11).setCellValue(createdAt);
        }
        // Auto-size the columns
        for (int i = 0; i < columnNames.size(); i++) {
            sheet.autoSizeColumn(i);
        }
    }

    protected void generateCollectionsRows(List<TransactionResponseDTO> transactions, Sheet  sheet){
        List<String> columnNames = List.of("ID", "Sender","Sender Telephone", "Student","Class","CardNo", "School","Type","Status", "Amount", "Date");
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
            row.createCell(4).setCellValue(transaction.getReceiver().getClassName());
            row.createCell(5).setCellValue(transaction.getReceiver().getWallet().getCardNo());
            row.createCell(6).setCellValue(transaction.getSchool().getName());
            row.createCell(7).setCellValue("DEPOSIT");
            row.createCell(8).setCellValue(transaction.getStatus().toString());
            row.createCell(9).setCellValue(transaction.getAmount().doubleValue());
            row.createCell(10).setCellValue(createdAt);
        }
        // Auto-size the columns
        for (int i = 0; i < 12; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    @Override
    public Transaction recordPaymentTransaction(StudentWalletAccount account, BigDecimal amount) {
        POSAttendant user = (POSAttendant) contextProvider.getPrincipal();
        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setTransactionId(Utils.generateTransactionId());
        transaction.setAttendant(user);
        transaction.setAmount(amount);
        transaction.setStatus(Utils.TRANSACTION_STATUS.SUCCESS);
        transaction.setSchool(account.getStudent().getSchool());
        transaction.setNature(Utils.TRANSACTION_NATURE.DEBIT);
        transaction.setDebitAccount(account);
        String description =  String.format("A payment of %s has been made from card %s", amount,account.getCardNo());
        transaction.setDescription(description);
        return transactionRepository.save(transaction);
    }

    @Override
    public WithDrawTransaction recordDisbursementTransaction(SchoolWalletAccount account, WithdrawRequest request) {
        WithDrawTransaction transaction = new WithDrawTransaction();
        transaction.setTransactionId(Utils.generateTransactionId());
        transaction.setAmount(request.getAmount());
        transaction.setSchool(account.getSchool());

        // System account
        AccountEntity systemAccount =  accountRepository.findAccountEntityByAccountType(Utils.WALLET_ACCOUNT_TYPES.SYSTEM);
        transaction.setCreditAccount(account);
        transaction.setDebitAccount(systemAccount);
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
    public void updateTransactionOnCallback(CallBackDataDTO data) throws TransactionDoesNotExistException {
        log.info("Entering update transaction on callcack with data {}", data);
        MMTransaction mmTransaction = null;
        switch (data.getProvider()){
            case MTN -> {
                mmTransaction =  findByMMTransactionXrefId(data.getXRef());
            }
            case AIRTEL -> {
                mmTransaction =  findByMMTransactionTransactionId(data.getTransactionId());
            }
            case EASY_PAY, FLUTTER_WAVE -> {
                mmTransaction =  findByMMTransactionRef(data.getXRef());
            }
        }

        if (mmTransaction ==  null){
            // this should never happen.
            throw new TransactionDoesNotExistException(data.toString());
        }
        if (mmTransaction.getStatus() != Utils.TRANSACTION_STATUS.PENDING){
            // already been updated by poller
            return;
        }
        Utils.TRANSACTION_STATUS tStatus = Utils.TRANSACTION_STATUS.valueOf(data.getStatus());
        mmTransaction.setStatus(tStatus);
        mmTransaction.setResponse(data.getPayload());
        mmTransactionRepository.save(mmTransaction);
        // Update collections transaction.
        CollectionTransaction transaction = findTransactionByMMTransaction(mmTransaction);
        if (transaction == null){
            // should never happen either.
            String msg = String.format("Collections Transaction from mmTransaction ref %s",mmTransaction);
            throw new TransactionDoesNotExistException(msg);
        }
        transaction.setTotalPlusCharges(BigDecimal.valueOf(data.getCharge() + data.getAmount())); // TODO implement charge calculations for others
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
