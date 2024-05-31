import {
    Button,
    Col,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner
} from "reactstrap";
import Select from "react-select";
import { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {addCategories} from "@src/views/apps/inventory/store";


const providers =[
    { label: 'AntDesign', value: 'AntDesign' },
    { label: 'Entypo', value: 'Entypo' },
    { label: 'EvilIcons', value: 'EvilIcons' },
    { label: 'Feather', value: 'Feather' },
    { label: 'FontAwesome', value: 'FontAwesome' },
    { label: 'FontAwesome5', value: 'FontAwesome5' },
    { label: 'FontAwesome6', value: 'FontAwesome6' },
    { label: 'SimpleLineIcons', value: 'SimpleLineIcons' },
    { label: 'Octicons', value: 'Octicons' },
    { label: 'FontAwesome5Brands', value: 'FontAwesome5Brands' },
    { label: 'Fontisto', value: 'Fontisto' },
    { label: 'Ionicons', value: 'Ionicons' },
    { label: 'MaterialCommunityIcons', value: 'MaterialCommunityIcons' },
    { label: 'MaterialIcons', value: 'MaterialIcons' },
    { label: 'Zocial', value: 'Zocial' }
]
const AddCategoryModal = ({open, closeModal})=>{


    const [name, setName] = useState("");
    const [file, setFile] = useState("");
    const [icon, setIcon] = useState("");
    const [preview, setPreview] = useState("");
    const [provider, setProvider] =  useState({label:"Select Icon provider", value:""})

    const {loading } = useSelector(store=>store.inventory)
    const dispatch =  useDispatch();


    const addSingleCategory = async()=>{
        const payload = {
            name,
            icon,
            provider:provider.value,
            image:`${name.toLowerCase().replaceAll(" ", "_")}.png`,
        }
        console.log(payload)
        await dispatch(addCategories([payload]))
        closeModal(false)
    }


    return(
        <Modal
            isOpen={open}
            className='modal-dialog-centered'
            modalClassName="danger">
            <ModalHeader className='bg-transparent' toggle={() => (closeModal())}>
                Add Category
            </ModalHeader>
            <ModalBody>
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
                                Specify Category name e.g Drinks
                            </small>
                        </Col>
                    </Row>
                    <Row className='gy-1 pt-75 text-center'>
                        <Col xs={12}>
                            <Label className='form-label' for='name'>
                                Icon
                            </Label>
                            <Input id='icon'
                                   value={icon}
                                   placeholder='Icon'
                                   onChange={e => setIcon(e.target.value)} />
                            <small className='text-muted'>
                                Use icon name visit <a href="https://oblador.github.io/react-native-vector-icons/" target="_blank">Here</a> for Icon names to use
                            </small>
                        </Col>
                    </Row>
                    <Row className='gy-1 pt-75 text-center'>
                        <Col xs={12}>
                            <Label className='form-label' for=''>
                                Provider
                            </Label>
                            <Select
                                isSearchable
                                isClearable={false}
                                value={provider}
                                placeholder="Select Icon Provider"
                                options={providers}
                                name="school"
                                onChange={v=>setProvider(v)}
                            />
                        </Col>
                    </Row>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary"  onClick={() => addSingleCategory()}>
                    {
                        loading && <Spinner color='light' size='sm'/>
                    }
                    Add Category
                </Button>
                <Button color="default" onClick={() => {
                    closeModal(false);
                }}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default  AddCategoryModal;
