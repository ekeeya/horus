// ** React Import
import {Fragment, useEffect, useState} from 'react'

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Reactstrap Imports
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardText,
    Row,
    Col,
    ListGroupItem,
    ListGroup, Alert, Badge, UncontrolledTooltip
} from 'reactstrap'

// ** Store & Actions
import {useDispatch, useSelector} from 'react-redux'
import {markProcessed, setSelectedRequest} from "@src/views/apps/finance/store";
import {DownloadCloud, FileText, X} from "react-feather";
import {downloadBase64Image, renderDateTime, renderReadableDate} from "@utils";
import {useDropzone} from "react-dropzone";
import toast from "react-hot-toast";
import Loader from "@components/spinner/Loader";
import {imageToBase64} from "@utils";
import {FaFileDownload} from "react-icons/fa";

const statusObj = {
    PENDING: 'light-warning',
    APPROVED: 'light-info',
    PROCESSED: 'light-success',
    CANCELLED: 'light-danger'
}

const SidebarWithdrawRequest = ({open, toggleSidebar}) => {
    // ** States
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState(null);

    // ** store
    const {loading, error, edit} = useSelector(store => store.finance);

    async function processImages() {
        const base64Strings = [];
        for (const file of files) {
            const base64String = await imageToBase64(file);
            base64Strings.push(base64String);
        }
        return base64Strings;
    }

    const handleSubmit = async () => {
        const images = await processImages();
        if (images.length === 0) {
            setErrors("Please upload a receipt image")
        } else {
            const payload = {
                id: selectedRequest.id,
                receipts: images
            }
            dispatch(markProcessed(payload));
            if (!loading && !error) {
                setFiles([]);
                toggleSidebar();
            }
        }
    }

    useEffect(() => {
        setErrors(error);
    }, [error]);

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length) {
                toast.error('You can only upload image Files!.')
                setErrors('You can only upload image Files!.')
            } else {
                setErrors(null);
                setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
            }
        }
    })
    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28'/>
        } else {
            return <FileText size='28'/>
        }
    }
    const handleRemoveFile = file => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter(i => i.name !== file.name)
        setFiles([...filtered])
    }
    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    const getUrl = (file)=>{
        console.log(file)
        return `${file.fileType},${file.content}`
    }

    const downloadReceipt =(file)=>{
        downloadBase64Image(getUrl(file), file.name);
    }
    const fileList = files.map((file, index) => (
        <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
            <div className='file-details d-flex align-items-center'>
                <div className='file-preview me-1'>{renderFilePreview(file)}</div>
                <div>
                    <p className='file-name mb-0'>{file.name}</p>
                    <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
                </div>
            </div>
            <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
                <X size={14}/>
            </Button>
        </ListGroupItem>
    ))


    const handleRemoveAllFiles = () => {
        setFiles([])
    }


    const {selectedRequest} = useSelector(store => store.finance)

    const {userData} = useSelector((store) => store.auth);


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
            title={edit ? `Settle Withdraw Request`: `Withdraw Request Details`}
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
            onClosed={handleSidebarClosed}
        >
            {selectedRequest && (<Card className='card-developer-meetup'>
                <CardBody>
                    <div className='meetup-header d-flex align-items-center'>
                        <div className='my-auto'>
                            <CardTitle tag='h4' className='mb-25'>
                                Funds withdraw Request from
                            </CardTitle>
                            <CardText className='mb-0'>{selectedRequest.school.name}</CardText>
                        </div>
                    </div>
                    <div>
                        <Row className='mb-1'>
                            <Col md='4' sm='12'>
                                Ref:
                            </Col>
                            <Col md='6' sm='12'>
                                <div>
                                    <h6 className='mb-0'>{selectedRequest.referenceNo}</h6>
                                </div>
                            </Col>
                            <hr/>
                            <Col md='4' sm='12'>
                                Type:
                            </Col>
                            <Col md='6' sm='12'>
                                <div>
                                    <h6 className='mb-0'>{selectedRequest.type}</h6>
                                </div>
                            </Col>
                            <hr/>
                            <Col md='4' sm='12'>
                                Date:
                            </Col>
                            <Col md='6' sm='12'>
                                <div>
                                    <h6 className='mb-0'>{renderReadableDate(selectedRequest.createdAt)}</h6>
                                    <small>{renderDateTime(selectedRequest.createdAt)}</small>
                                </div>
                            </Col>
                            <hr/>
                            <Col md='4' sm='12'>
                                Amount:
                            </Col>
                            <Col md='6' sm='12'>
                                <div>
                                    <h6 className='mb-0'>{selectedRequest.amount.toLocaleString()}/=</h6>
                                </div>
                            </Col>
                            <hr/>
                            <Col md='4' sm='12'>
                                Status:
                            </Col>
                            <Col md='6' sm='12'>
                                <div>
                                    <h6 className='mb-0'>
                                        <Badge className='text-capitalize' color={statusObj[selectedRequest.status]} pill>
                                        {selectedRequest.status}
                                    </Badge></h6>
                                </div>
                            </Col>
                            <hr/>

                            {selectedRequest.receipts.length > 0 && (
                                <Fragment>
                                    <div className='divider'>
                                        <div className='divider-text'>Receipts</div>
                                    </div>
                                    <ListGroup className='my-2'>
                                        {selectedRequest.receipts.map((file, index) => (
                                            <ListGroupItem key={`${file.name}-${index}`}
                                                           className='d-flex align-items-center justify-content-between'>
                                                <div className='file-details d-flex align-items-center'>
                                                    <div className='file-preview me-1'>
                                                        <img className='rounded' alt={file.name} src={getUrl(file)}
                                                             height='28' width='28'/>
                                                    </div>
                                                    <div>
                                                        <p className='file-name mb-0'>{file.name}</p>
                                                    </div>
                                                </div>
                                                <Button  id="download-receipt-tooltip" size='sm' className='btn-icon' color='flat-info'
                                                        onClick={() => downloadReceipt(file)}>
                                                    <FaFileDownload size={14}/>
                                                </Button>
                                                <UncontrolledTooltip placement='top' target="download-receipt-tooltip">
                                                    Download this receipt.
                                                </UncontrolledTooltip>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                </Fragment>
                            )}
                            {edit && (<Alert color='info'>
                                <div className='alert-body font-small-2'>
                                    <div>
                                        <small className='me-50'>
                                            <span className='fw-bold'>NOTE:</span><br/>
                                            In order to settle a withdraw request, kindly upload the scanned copies of
                                            all the receipts corresponding to this transaction outside this system.
                                        </small>
                                    </div>
                                </div>
                            </Alert>)}
                        </Row>
                    </div>
                </CardBody>
            </Card>)}
            {edit && (<div>
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                        <DownloadCloud size={64}/>
                        <p className='text-secondary'>
                            Drop Image receipts here or {' '}
                            <a href='/' onClick={e => e.preventDefault()}>
                                click
                            </a>{' '}
                            to upload.
                        </p>
                    </div>
                </div>
                {files.length ? (
                    <Fragment>
                        <ListGroup className='my-2'>{fileList}</ListGroup>
                        <div className='d-flex justify-content-end'>
                            <Button size="sm" className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                                Clear
                            </Button>
                        </div>
                    </Fragment>
                ) : null}
                {
                    loading && (
                        <>
                            <hr/>
                            <Loader/>
                        </>

                    )
                }
                {
                    errors && (
                        <Alert color='danger'>
                            <div className='alert-body font-small-2'>
                                <div>
                                    <small className='me-50'>
                                        <span className='fw-bold'>Errors:</span> {errors}
                                    </small>
                                </div>
                            </div>
                        </Alert>
                    )
                }
                <hr/>
                <Button onClick={() => handleSubmit()} disabled={files.length < 1} type='submit' className='me-1'
                        color='primary'>
                    Settle Request
                </Button>
                <Button type='reset' color='secondary' outline onClick={() => {
                    toggleSidebar()
                }}>
                    Cancel
                </Button>
            </div>)}
        </Sidebar>
    )
}
export default SidebarWithdrawRequest
