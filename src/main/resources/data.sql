CREATE EXTENSION IF NOT EXISTS hstore;
INSERT INTO account(account_no,name,account_type, balance, withdraws) VALUES ('1000000000001', 'SYSTEM COLLECTIONS','SYSTEM', 0.0, 0.0) ON CONFLICT DO NOTHING;


CREATE OR REPLACE FUNCTION update_account_balances_at_deposit()
    returns trigger as '
    BEGIN
        IF NEW.transaction_type = ''COLLECTION'' AND NEW.status=''SUCCESS'' THEN
            UPDATE account SET balance=balance+NEW.amount  WHERE account_type=''SYSTEM'';
            UPDATE account SET balance=balance+NEW.amount  WHERE NEW.receiver_id=account.student;
            UPDATE account SET balance=balance+NEW.amount  WHERE NEW.school_id=account.school_id;
        END IF;
        RETURN NEW;
    END;
' LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_account_balances_at_withdraw()
    returns trigger as '
    BEGIN
        IF NEW.transaction_type = ''DISBURSEMENT'' AND NEW.status=''SUCCESS'' THEN
            UPDATE account SET balance=balance-NEW.amount  WHERE account_type=''SYSTEM'';
            UPDATE account SET balance=balance-NEW.amount  WHERE NEW.school_id=account.school_id;
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