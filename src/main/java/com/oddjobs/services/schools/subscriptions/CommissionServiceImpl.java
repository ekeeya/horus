package com.oddjobs.services.schools.subscriptions;
import com.oddjobs.entities.School;
import com.oddjobs.entities.StudentEntity;
import com.oddjobs.entities.subscriptions.CommissionRequestEntity;
import com.oddjobs.entities.transactions.CommissionTransaction;
import com.oddjobs.entities.transactions.Transaction;
import com.oddjobs.entities.wallets.CommissionAccount;
import com.oddjobs.entities.wallets.StudentWalletAccount;
import com.oddjobs.repositories.students.StudentRepository;
import com.oddjobs.repositories.subscriptions.CommissionRequestRepository;
import com.oddjobs.repositories.transactions.TransactionRepository;
import com.oddjobs.repositories.wallet.CommissionAccountRepository;
import com.oddjobs.repositories.wallet.StudentWalletAccountRepository;
import com.oddjobs.repositories.wallet.WalletAccountRepository;
import com.oddjobs.services.BackgroundTaskExecutor;
import com.oddjobs.utils.Utils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.List;

@Service
@AllArgsConstructor
@Transactional
@Slf4j
public class CommissionServiceImpl implements CommissionService {

    private final CommissionRequestRepository crRepository;
    private final StudentRepository studentRepository;
    private final CommissionAccountRepository commissionAccountRepository;
    private final BackgroundTaskExecutor backgroundTaskExecutor;
    private final TransactionRepository transactionRepository;
    private final WalletAccountRepository walletAccountRepository;
    private final CommissionRequestRepository commissionRequestRepository;
    private final StudentWalletAccountRepository studentWalletAccountRepository;

    @PersistenceContext
    private EntityManager entityManager;


    @Scheduled(fixedRate = 60000*3)
    void processCommissionDeductions(){
        log.info("Entering commissions deduction routine");
        deductCommission();
    }

    @Scheduled(fixedRate = 60000*2)
    void updateCommissionTransactionStatuses(){
        List<Transaction> transactions = transactionRepository.findPendingCommissionTransactionsStatus();
        for (Transaction t: transactions){
            transactionRepository.updateTransactionStatus(Utils.TRANSACTION_STATUS.SUCCESS.toString(), t.getId());
        }
    }

    @Override
    public List<CommissionRequestEntity> getPendingByStudent(StudentEntity student) {
        return crRepository.findByStudentAndStatus(student, Utils.COMMISSION_STATUS.PENDING);
    }

    @Override
    @Transactional
    public CommissionRequestEntity create(StudentEntity student, Utils.COMMISSION_TYPE type, Utils.COMMISSION_TERM term) throws Exception {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        CommissionRequestEntity crRequest = new CommissionRequestEntity();
        CommissionRequestEntity existing  = crRepository.findByStudentAndYearAndTermAndType(student,year, term, type);
        if (existing != null){
            String error = String.format("Commission request : %s already exists",  existing);
            throw new Exception(error);
        }
        crRequest.setTerm(term);
        crRequest.setType(type);
        crRequest.setYear(year);
        crRequest.setStudent(student);
        BigDecimal amount =  type == Utils.COMMISSION_TYPE.SYSTEM ?
                BigDecimal.valueOf(student.getSchool().getSystemFeePerStudentPerTerm()) :
                BigDecimal.valueOf(student.getSchool().getSchoolFeePerStudentPerTerm());
        crRequest.setAmount(amount);
        // deactivate the student wallet
        StudentWalletAccount studentWallet = studentWalletAccountRepository.findStudentWalletAccountByStudent(student);
        log.debug("Deactivating student wallet: {} wallet upon creation of a commission deduction request", studentWallet);
        studentWallet.setStatus(Utils.WALLET_STATUS.NOT_PAID);
        // walletAccountRepository.save(studentWallet);
        return crRepository.save(crRequest);
    }

    @Override
    public void cancel(CommissionRequestEntity commissionRequest) {
        commissionRequest.setStatus(Utils.COMMISSION_STATUS.CANCELLED);
    }


    protected void executeDeduction(CommissionRequestEntity request){
        try{
            School school =  request.getStudent().getSchool();
            StudentWalletAccount walletAccount =  request.getStudent().getWalletAccount();
            log.info("Will debit student {} and credit system with amount {}. Request involved is: {}", request.getStudent(), request.getAmount(), request);
            CommissionAccount systemComAccount = commissionAccountRepository.findCommissionAccountBySchoolIsNull();
            CommissionAccount schoolComAccount = commissionAccountRepository.findCommissionAccountBySchool(school);
            CommissionTransaction transaction =  new CommissionTransaction();
            transaction.setTransactionId(Utils.generateTransactionId());
            transaction.setRequest(request);
            transaction = transaction.updateFields();
            transaction.setDebitAccount(walletAccount);

            if (transaction.kind() == Utils.COMMISSION_TYPE.SYSTEM){
                transaction.setCreditAccount(systemComAccount);
            }else{
                transaction.setCreditAccount(schoolComAccount);
            }
            transactionRepository.save(transaction);
            request.setStatus(Utils.COMMISSION_STATUS.COMPLETED);
            commissionRequestRepository.save(request);
            log.info("Done applying commission deduction request: {}", request);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
    @Override
    @Transactional
    public void deductCommission() {
        List<CommissionRequestEntity> allPending = crRepository.findByStatus(Utils.COMMISSION_STATUS.PENDING);

        for (CommissionRequestEntity request: allPending){
            executeDeduction(request);
            // activate the student account only if there is no Pending Commission deduction request.
            if (!hasPendingCommissionDeduction(request.getStudent())){
                StudentWalletAccount walletAccount = request.getStudent().getWalletAccount();
                walletAccount.setStatus(Utils.WALLET_STATUS.ACTIVE);
                walletAccountRepository.save(walletAccount);
            }
            // else it will already be NOT_PAID
        }
    }

    @Override
    public void createCommissionDeductionRequestsBySchool(School school, Utils.COMMISSION_TERM term) {
        backgroundTaskExecutor.runTask(()->{ // could be lots for them run them in a bg task
            List<StudentEntity> students = studentRepository.findStudentEntitiesBySchool(school);
            for(StudentEntity student: students){
                try {
                    // create system commission
                    create(student,  Utils.COMMISSION_TYPE.SYSTEM, term);
                    // create school commission
                    create(student, Utils.COMMISSION_TYPE.SCHOOL, term);
                } catch (Exception e) { // let us not ruin it for the others
                    log.error(e.getMessage());
                }

            }
        });
    }

    @Override
    public boolean hasPendingCommissionDeduction(StudentEntity student) {
        List<CommissionRequestEntity> pending =  getPendingByStudent(student);
        return !pending.isEmpty();
    }
}
