CREATE EXTENSION IF NOT EXISTS hstore;
INSERT INTO account(account_no,name,account_type, balance, withdraws) VALUES ('1000000000001', 'SYSTEM COLLECTIONS','SYSTEM', 0.0, 0.0) ON CONFLICT DO NOTHING;
INSERT INTO account(account_no,name,account_type, withdrawn, balance) VALUES ('COM000000000001', 'SYSTEM COMMISSIONS','COMMISSION', 0.0, 0.0) ON CONFLICT DO NOTHING;
INSERT INTO account(account_no,name,account_type,  balance) VALUES ('CHA000000000001', 'SYSTEM CHARGE','CHARGE', 0.0) ON CONFLICT DO NOTHING;
INSERT INTO account(account_no,name,account_type,  balance) VALUES ('WITHDRAW000000000001', 'SYSTEM WITHDRAW','WITHDRAW', 0.0) ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION update_account_balances_at_deposit()
    returns trigger as '
    BEGIN
        IF NEW.transaction_type = ''COLLECTION'' AND NEW.status=''SUCCESS'' THEN
            UPDATE account SET balance=balance+NEW.amount  WHERE account_type=''SYSTEM'';
            UPDATE account SET balance=balance+NEW.amount  WHERE NEW.receiver_id=account.student;
            UPDATE account SET balance=balance+NEW.amount  WHERE NEW.school_id=account.school_id AND account_type = ''SCHOOL_COLLECTION'';
        END IF;
        RETURN NEW;
    END;
' LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_account_balances_at_payment()
    returns trigger as '
    BEGIN
        IF NEW.transaction_type = ''PAYMENT'' AND NEW.status=''SUCCESS'' THEN
            UPDATE account SET balance=balance - NEW.amount WHERE account_type = ''SYSTEM'';
            UPDATE account SET balance=balance - NEW.amount WHERE NEW.school_id = account.school_id AND account_type = ''SCHOOL_COLLECTION'';
            UPDATE account SET balance=balance+NEW.amount WHERE NEW.school_id = account.school_id AND account_type = ''SCHOOL_PAYMENT'';
        END IF;
        RETURN NEW;
    END;
' LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_account_balances_at_commissions()
    returns trigger as '
    BEGIN
        IF NEW.transaction_type = ''COMMISSIONS'' AND NEW.status=''SUCCESS'' THEN
            UPDATE account SET balance=balance - NEW.amount WHERE account_type = ''SYSTEM'';
            UPDATE account SET balance=balance - NEW.amount WHERE NEW.school_id = account.school_id AND account_type = ''SCHOOL_COLLECTION'';
            UPDATE account SET balance=balance - NEW.amount WHERE NEW.debit_account_id = account.id;
            UPDATE account SET balance=balance+NEW.amount WHERE NEW.credit_account_id = account.id;
        END IF;
        RETURN NEW;
    END;
' LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_account_balances_at_withdraw()
    returns trigger as '
    BEGIN
        IF NEW.transaction_type = ''DISBURSEMENT'' AND NEW.status=''SUCCESS'' THEN
            UPDATE account SET balance=balance-NEW.amount  WHERE id=NEW.debit_account_id;
            UPDATE account SET balance=balance+NEW.amount  WHERE account_type=''WITHDRAW'' AND  NEW.credit_account_id=account.id;
        END IF;
        RETURN NEW;
    END;
' LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER update_balances_on_deposit
    AFTER UPDATE
    ON transaction
    FOR EACH ROW
execute FUNCTION update_account_balances_at_deposit();

CREATE OR REPLACE TRIGGER update_balances_on_withdraw
    AFTER UPDATE
    ON transaction
    FOR EACH ROW
execute FUNCTION update_account_balances_at_withdraw();

CREATE OR REPLACE TRIGGER update_balances_on_payment
    AFTER UPDATE
    ON transaction
    FOR EACH ROW
execute FUNCTION update_account_balances_at_payment();


CREATE OR REPLACE TRIGGER update_balances_on_commissions
    AFTER UPDATE
    ON transaction
    FOR EACH ROW
execute FUNCTION update_account_balances_at_commissions();
