import {
    Alert,
    Button,
    Col,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner,
    UncontrolledTooltip
} from "reactstrap";
import NumericInput from "react-numeric-input";
import Select from "react-select";
import {useEffect, useMemo, useState} from "react";
import {useDropzone} from "react-dropzone";
import toast from "react-hot-toast";
import {DownloadCloud, FileText, X} from "react-feather";
import {useDispatch, useSelector} from "react-redux";
import {addItems, importItems, setSelectedProduct} from "@src/views/apps/inventory/store";

const AddItemModal = ({open, closeModal, single, categories, posId})=>{

    const [category, setCategory] = useState({});
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const dispatch = useDispatch();

    const {loading, selectedProduct} = useSelector(store=>store.inventory)

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        accept: {
            'text/csv': ['.csv']
        },
        onDrop: (acceptedFiles, rejectedFiles) => {
            if (rejectedFiles.length) {
                toast.error('You can only upload CSV Files!.')
            } else {
                setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
            }
        }
    });

    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
        } else {
            return <FileText size='28' />
        }
    }
    const handleRemoveFile = file => {
        const filtered = files.filter(i => i.name !== file.name)
        setFiles([...filtered])
    }
    const cleanCategories =  useMemo(()=>{
        return categories.map(c=>( {label:c.name, value:c.id}))
    }, [categories])

    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    const parsePrice = x => {
        setPrice(parseFloat(x.replaceAll(",", "")))
        return parseFloat(x.replaceAll(",", ""));
    }

    const handleBulkItemsUpload= async ()=>{
        let file
        if (files.length > 0){
            file = files[0]
            const form = new FormData();
            form.set("file", file);
            const payload = {posId, form};
            await dispatch(importItems(payload));
            if((!loading)){
                closeModal(false);
                dispatch(selectedProduct(null))
            }else{
                setFiles([])
            }
        }else{
            toast.error("File missing, please upload a csv file to continue")
        }

    }

    useEffect(()=>{
        if (selectedProduct){
            setName(selectedProduct.name);
            setPrice(selectedProduct.price);
            setQuantity(selectedProduct.quantity);
            setCategory({
                label:selectedProduct.category.name,
                value:selectedProduct.category.id
            })
        }
    },[selectedProduct])
    const addSingleItem = async()=>{
        const payload = {
            name,
            price,
            posId,
            quantity,
            categoryId:category.value
        }
        if(selectedProduct){
            payload["id"] = selectedProduct.id;
            payload['posId']= selectedProduct.pos.id;
        }
        await dispatch(addItems([payload]))
        closeModal(false)
        dispatch(setSelectedProduct(null))
    }

    const format = x => {
        const numberValue = parseFloat(x);
        if (!isNaN(numberValue)) {
            return numberValue.toLocaleString();
        }
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
                <X size={14} />
            </Button>
        </ListGroupItem>
    ))
    return(
        <Modal
            isOpen={open || selectedProduct !== null}
            className='modal-dialog-centered'
            modalClassName="danger">
            <ModalHeader className='bg-transparent' toggle={() => (closeModal())}>
                {single ? 'Add Inventory Item' : 'Bulk Import Inventory Items'}
            </ModalHeader>
            <ModalBody>
                {
                    single ?
                        <div className='mb-12'>
                            <Row className='gy-1 pt-75 text-center'>
                                <Col xs={12}>
                                    <Label className='form-label' for='name'>
                                        Name
                                    </Label>
                                    <Input id='name'
                                           value={name}
                                           placeholder='Name'
                                           onChange={e => setName(e.target.value)} />
                                    <small className='text-muted'>
                                        Specify Item's name e.g Coca Cola Soda.
                                    </small>
                                </Col>
                            </Row>
                            <Row className='gy-1 pt-75 text-center'>
                                <Col xs={12}>
                                    <Label className='form-label' for=''>
                                        Inventory Quantity
                                    </Label>
                                    <Input id='quantity'
                                           type="number"
                                           value={quantity}
                                           placeholder='Inventory Quantity'
                                           onChange={e => setQuantity(e.target.value)} />

                                    <small className='text-muted'>
                                        How many pieces of this are in inventory
                                    </small>
                                </Col>
                            </Row>
                            <Row className='gy-1 pt-75 text-center'>
                                <Col xs={12}>
                                    <Label className='form-label' for=''>
                                        Unit Price
                                    </Label>
                                    <NumericInput
                                        mobile
                                        parse={parsePrice}
                                        value={price}
                                        format={format}
                                        inputMode="string"
                                        className="form-control"
                                        min={100}

                                    />
                                </Col>
                            </Row>

                            <Row className='gy-1 pt-75 text-center'>
                                <Col xs={12}>
                                    <Label className='form-label' for=''>
                                        Category
                                    </Label>
                                    <Select
                                        isSearchable
                                        isClearable={true}
                                        value={category}
                                        placeholder="Select School"
                                        options={cleanCategories}
                                        name="school"
                                        onChange={v=>setCategory(v)}
                                    />
                                </Col>
                            </Row>

                        </div>
                        :
                        <div className='mb-12'>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <div className='d-flex align-items-center justify-content-center flex-column'>
                                    <DownloadCloud size={64} />
                                    <h5>Drop Files here or click to upload</h5>
                                    <p className='text-secondary'>
                                        Drop files here or click{' '}
                                        <a href='/' onClick={e => e.preventDefault()}>
                                            browse
                                        </a>{' '}
                                        thorough your machine
                                    </p>
                                </div>
                            </div>
                            {error && (<Alert color='danger' className="mt-1">
                                <div className='alert-body font-small-2'>
                                    <p>
                                        <small className='me-lg-1'>
                                            <span className='fw-bold'>Error:</span>
                                        </small>
                                    </p>
                                    <p>
                                        <small className='me-50'>
                                            {error}
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
                                    Remove
                                </UncontrolledTooltip>
                            </Alert>)}
                            {files.length ? (
                                <ListGroup className='my-2'>{fileList}</ListGroup>
                            ) : null}
                        </div>
                }

            </ModalBody>
            <ModalFooter>
                <Button color="primary"  onClick={() =>single ? addSingleItem() :  handleBulkItemsUpload()}>
                    {
                        loading && <Spinner color='light' size='sm'/>
                    }
                    {single ? "Add Item": "Import Inventory"}
                </Button>
                {!single && <Button color="default" onClick={() => {
                    closeModal(false);
                    setFiles([]);
                }}>
                    Cancel
                </Button>}
            </ModalFooter>
        </Modal>
    )
}

export default  AddItemModal;
