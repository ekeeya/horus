// ** React Import
import {useEffect, useState} from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Reactstrap Imports
import {
    Card,
    CardBody,
    Row,
    Col, Label, CardFooter, Button, Input, UncontrolledTooltip, Alert
} from 'reactstrap'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'
import {
    makeWithdrawRequest,
    setSelectedRequest,
    fetchAllowedWithdrawPaymentAccountBalance, setShowWithdrawModal
} from "@src/views/apps/finance/store";
import toast from "react-hot-toast";
import NumericInput from "react-numeric-input";
import Flatpickr from "react-flatpickr";
import {convertDate, periodDates, todayDates} from "@utils";
import Select from "react-select";
import MySwal from "sweetalert2";
import {X} from "react-feather";
import {clearError} from "@src/views/apps/user/store";




const SidebarWithdrawRequest = ({open, toggleSidebar}) => {

    const {loading, error, allowedWithdrawAmount, account} = useSelector(store => store.finance);
    const [amount, setAmount] = useState(0);
    const [dateRange, setDateRange] =  useState(todayDates());
    const [useDate, setUseDate] = useState(false)

    const periods = [
        {value:"all",label: "All"},
        {value:"day",label: "Today"},
        {value:"week",label: "This Week"},
        {value:"month",label: "This Month"}
    ]

    const [period, setPeriod] =  useState( {value:"day",label: "Today"})
    const parseInput = x => {
        setAmount(parseFloat(x.replaceAll(",", "")))
        return parseFloat(x.replaceAll(",", ""));
    }

    const format = x => {
        const numberValue = parseFloat(x);
        if (!isNaN(numberValue)) {
            return numberValue.toLocaleString();
        }
    }
    const {userData} = useSelector((store) => store.auth);

    const initiateWithdrawRequest = () => {
        console.log(account)
        // const rate = schoolStore.selectedSchool ? schoolStore.selectedSchool.commissionRate : 0;
        if (amount === null || amount < 5000) {
            const msg = "Please specify an amount greater than 5,000";
            toast.error(msg, {
                position: "bottom-right"
            })
        } else if (amount > account.balance) {
            const msg = `Specified amount ${amount.toLocaleString()} can not exceed available account balance ${account.balance.toLocaleString()}`;
            toast.error(msg, {
                position: "bottom-right"
            });
        } else {
            // const amountReceived = parseFloat(amount) * (1-rate);
            return MySwal.fire({
                title: 'Initiate Withdraw Request',
                text: `Are you sure you want to continue initiating a withdraw of ${amount.toLocaleString()} from the payments account?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: `Yes, Continue`,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline-danger ms-1'
                },
                buttonsStyling: false
            }).then(function (result) {
                let type = "PAYMENTS"
                    if (account.accountType === "COMMISSION"){
                        type = "COMMISSION";
                    }
                    if (account.accountType === "SCHOOL_PAYMENT"){
                        type = "PAYMENTS";
                    }
                    if (result.value) {
                    const data = {
                        accountId:account.id,
                        schoolId: userData.schoolId,
                        amount: amount,
                        type:type
                    }
                    dispatch(makeWithdrawRequest(data));
                    !error && dispatch(setShowWithdrawModal(false));
                }
            })
        }
    }

    useEffect(()=>{
        async function  fetchAllowedWithdrawAmount(){
             if(userData.accountType === "SCHOOL_ADMIN"){
                 dispatch(fetchAllowedWithdrawPaymentAccountBalance({}));
             }
         }

        fetchAllowedWithdrawAmount().then(r=>{
            setAmount(allowedWithdrawAmount);
        });

    },[allowedWithdrawAmount])


    useEffect(()=>{
        if (useDate){
            const lowerDate = convertDate(dateRange[0]);
            const upperDate =  convertDate(dateRange[1], true);
            const config = {
                lowerDate:lowerDate,
                upperDate:upperDate
            }
            dispatch(fetchAllowedWithdrawPaymentAccountBalance(config))
        }
    }, [dateRange, useDate])

    useEffect(()=>{
        if (useDate){
            let dates=[null, null]
            switch (period.value) {
                case "day":
                    dates = periodDates();
                    break;
                case "week":
                    dates =  periodDates("week");
                    break;
                case "month":
                    dates = periodDates("month");
                    break;
                default:
                    dates=[null, null];
            }
            setDateRange(dates);
        }
    },[period])
    // ** Store Vars
    const dispatch = useDispatch();

    // ** Vars
    // ** Function to handle form submit

    const handleSidebarClosed = () => {
        dispatch(setSelectedRequest(null));
    }

    return (
        <Sidebar
            size='lg'
            open={open}
            title="Withdraw Request Form"
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
            onClosed={handleSidebarClosed}
        >
            <Card className='card-developer-meetup'>
                <CardBody className="root">

                    <div>
                        <Row tag='form' className='gy-1 gx-2 mt-75'>
                            <Col xs={12}>
                                <Alert color='warning' className="mt-1">
                                    <div className='alert-body font-small-2'>
                                        <p>
                                            <small className='me-50'>
                                                Allowed maximum withdraw amount <br/> this account is <b>UGX: {account.balance.toLocaleString()}</b>
                                            </small>
                                        </p>
                                    </div>
                                    <X
                                        onClick={() => dispatch(clearError())}
                                        id='clear-error-tip'
                                        className='position-absolute'
                                        size={18}
                                        style={{top: '10px', right: '10px'}}
                                    />
                                    <UncontrolledTooltip target='clear-error-tip' placement='top'>
                                        Collapse
                                    </UncontrolledTooltip>
                                </Alert>
                            </Col>
                        </Row>
                        <Row tag='form' className='gy-1 gx-2 mt-75'>
                            <Col xs={12}>
                                <div className='form-check form-switch'>
                                    <Input type='switch' name='customSwitch' id='basic-cb-switch'
                                           onChange={() => setUseDate(!useDate)}/>
                                    <Label for='basic-cb-checked' className='form-check-label'>
                                        {!useDate ? "Select Withdraw Amount By Date" : "Custom Balance"}
                                    </Label>
                                </div>
                            </Col>
                            {useDate && (
                                <>
                                    <Col xs={12}>
                                        <div className='mb-1'>
                                            <Label className='form-label bold' for='daterange'>
                                                <b>Choose a period to auto select dates:</b>
                                            </Label>
                                            <Select
                                                value={period}
                                                isLoading={loading}
                                                placeholder="Choose Period"
                                                options={periods}
                                                name="primaryParent"
                                                classNamePrefix='select'
                                                onChange={v => setPeriod(v)}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <div  className='mb-1'>
                                            <Label className='form-label bold' for='Amount'>
                                                <b>Select Withdraw Amount Using Dates:</b>
                                            </Label>
                                            <Flatpickr
                                                value={dateRange}
                                                id='range-picker'
                                                data-enable-time
                                                className='form-control'
                                                onChange={date => setDateRange(date)}
                                                options={{
                                                    mode: 'range',
                                                    defaultDate: dateRange
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </>
                            )}
                            <Col xs={12}>
                                <div className='mb-1'>
                                    <Label className='form-label bold' for='Amount'>
                                        <b>Amount:</b> <span className='text-danger'>*</span>
                                    </Label>
                                    <NumericInput
                                        mobile
                                        disabled={useDate}
                                        parse={parseInput}
                                        value={amount}
                                        format={format}
                                        inputMode="string"
                                        className="form-control"
                                        min={5000}

                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </CardBody>
                <CardFooter>
                    <Button disabled={account.balance < 1} color="info" onClick={() => initiateWithdrawRequest()}>
                        Initiate Withdraw
                    </Button>
                </CardFooter>
            </Card>
        </Sidebar>
    )
}
export default SidebarWithdrawRequest
