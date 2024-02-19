/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image, ScrollView,Alert
} from 'react-native';

import  NumericPad  from  'react-native-numeric-pad'
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from "react-native-vector-icons/Ionicons"
import { SimpleGrid} from 'react-native-super-grid';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import PaymentConfirmationSheet from "../components/PaymentConfirmationSheet";
import RecentTransactionsSheet from "../components/RecentTransationsSheet";
const {width, height} = Dimensions.get("window");
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {handleLogout} from "../store/auth";
import {useDispatch, useSelector} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import { CommonActions } from '@react-navigation/native';
import {getCard, resetError, resetCardDetails, setPaid, setPaymentAmount, getTransactions} from "../store/payment";
import {ALERT_TYPE, Dialog} from "react-native-alert-notification";

const Home =()=>  {

    const [amount, setAmount] = useState("0")
    const [payAmount, setPayAmount] = useState(0)
    const [cardNo, setCardNo] = useState();
    const [user, setUser] = useState({})
    const [pos, setPos] = useState({})
    const [showPaymentSheet,setShowPaymentSheet] =  useState(false)
    const [showTransactions,setShowTransactions] =  useState(false)
    const [frequentAmounts, setFrequentAmounts] = useState([500,1000,1500,2000,3000,4000, 5000, 10000,20000, 50000])
    const numpadRef = useRef(null)

    const navigation = useNavigation()

    const dispatch = useDispatch();
    const {userData} = useSelector(store=>store.auth);
    const {cardDetails, paymentAmount, paid} = useSelector(store=>store.payment);

     const  readNdef= async()=> {
         if(paymentAmount === 0 ){
             Dialog.show({
                 type: ALERT_TYPE.DANGER,
                 title: 'Error',
                 textBody:`Please first select or type in an amount!`,
                 button:"Dismiss",
                 autoClose:5000
             })
         }else{
             setShowPaymentSheet(true);
             try {
                 console.log("Scanning for NFC tags")
                 // register for the NFC tag with NDEF in it
                 await NfcManager.requestTechnology(NfcTech.Ndef)
                 setCardNo("6534566850742394")
                 // the resolved tag object will contain `ndefMessage` property
                 const tag = await NfcManager.getTag();
                 console.log('Tag found', tag);
             } catch (ex) {
                 console.warn('Oops!', ex);
             } finally {
                 // stop the nfc scanning
                 NfcManager.cancelTechnologyRequest();
             }
         }
    }

    const handleSetAmount = (val)=>{
        const amount = val ? parseInt(val).toLocaleString() : "0";
        setAmount(amount)
    }

    useEffect(()=>{
        const a = amount.replaceAll(",","")
        setPayAmount(parseFloat(a));
        dispatch(setPaymentAmount(parseFloat(a)))
    },[amount])
    const handlePaymentsSheetOnClose = ()=>{
        setCardNo(null);
        setAmount("0")
        setShowPaymentSheet(false);
        dispatch(resetCardDetails())
        dispatch(setPaymentAmount(0))
        numpadRef.current.clearAll();
        dispatch(setPaid(false))
        dispatch(resetError())
        dispatch(getTransactions(userData.user.id))
    }
    const handleRecentTransactionsSheetOnClose = ()=>{
        setShowTransactions(false)
    }
    const logOut = ()=>{
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            {
                text: 'Cancel',
                onPress: () => console.log(''),
                style: 'cancel',
            },
            {text: 'LOGOUT', onPress: () => dispatch(handleLogout())},
        ]);

    }
    useEffect(()=>{
        if(userData === null){
            navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            }));
        }else{
            //I am logged in
            setUser(userData.user);
            setPos(userData.user.posCenter)
        }
    }, [userData])

    useEffect(()=>{
        if(cardNo){
            dispatch(getCard(cardNo));
        }

    },[cardNo])
    return (
        <GestureHandlerRootView style={styles.container}>
            {(userData !==null) &&
                <View style={styles.topView}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.buttonTop} onPress={() => {
                            setShowTransactions(true)
                        }}>
                            <Ionicons  name="notifications" color="#fe7918" size={25}/>
                        </TouchableOpacity>
                        <View style={styles.nameContainer}>
                            <Text style={styles.schoolText}>{pos.schoolName}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonTop} onPress={logOut}>
                            <Entypo name="log-out" color="#fe7918" size={25}/>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.posDetailsContainer}>
                        <Text style={styles.textBold}>{pos.name}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image style={styles.tinyLogo} source={require("../assests/logo.png")}/>
                        <Text>{user.fullName}</Text>
                    </View>
                </View>}
            <View style={styles.divider}></View>
            <View style={styles.screenContainer}>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{amount}</Text>
                    <Text style={styles.amountText}>/=</Text>
                </View>
            </View>
            <View style={styles.divider}></View>
            <View style={{flex:0.5}}>
                <View  style={styles.freqAmountContainer}>
                    <ScrollView>
                        <SimpleGrid
                            itemDimension={80}
                            data={frequentAmounts}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={()=>handleSetAmount(item)} style={styles.freqAmount}>
                                    <Text style={styles.freqText}>{item.toLocaleString()}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                </View>
            </View>
            <View style={styles.divider}></View>
            <View style={styles.bottomView}>
                <View style={styles.numPadView}>
                    <NumericPad
                        ref={numpadRef}
                        numLength={8}
                        buttonSize={60}
                        activeOpacity={0.1}
                        onValueChange={value => handleSetAmount(value)}
                        allowDecimal={true}
                        buttonAreaStyle={{ height:"100%", borderRadius:10, padding:10 }}
                        buttonItemStyle={{ backgroundColor: '#eeeeee', borderRadius:10,width:width/3.5, height:(width/6) }}
                        rightBottomButton={<Ionicons name={'backspace-outline'} size={28} color={'#000'}/>}
                        onRightBottomButtonPress={() => {numpadRef.current.clear()}
                        }
                    />
                </View>
            </View>
            <View style={styles.bottomMost}>
                <View style={styles.scanButtonContainer}>
                    <TouchableOpacity onPress={readNdef} style={styles.scanButton}>
                        <Image source={require("../assests/contactless.png")} style={styles.scanIcon} />
                        <Text style={styles.scanText}>SCAN</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {paymentAmount > 0 &&
                (<PaymentConfirmationSheet
                    show={showPaymentSheet}
                    cardDetails={cardDetails}
                    onClose={handlePaymentsSheetOnClose}
                />)}
            <RecentTransactionsSheet
                show={showTransactions}
                onClose={handleRecentTransactionsSheetOnClose}
            />
        </GestureHandlerRootView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor:"#ffff"
    },
    topView: {
        flex: 1,
        paddingHorizontal:10,
        marginTop:10
    },
    bottomView: {
        flex:2
    },
    headerContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginHorizontal:10,
    },
    nameContainer:{
        flexDirection:"row",
        marginTop:5,
        justifyContent:'space-evenly'
    },
    textBold:{
        fontWeight:"bold"
    },
    posDetailsContainer:{
        paddingTop:10,
        alignItems:'center',
        justifyContent:"center"
    },
    schoolText:{
        fontSize:16,
        fontWeight:"bold"
    },
    posText:{},
    dailySalesContainer:{
        alignItems:"center",
        justifyContent:"center",
        marginTop:10
    },
    imageContainer:{
        marginTop:10,
        alignItems:"center",
        justifyContent:'center',
    },
    tinyLogo: {
        width: 70,
        height: 70,
        borderRadius:20,
        backgroundColor:'#e3e3e3'
    },
    buttonTextContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:"center",
        flexDirection:"row",
    },
    screenContainer:{
        flex:0.5,
        justifyContent:"center",
    },
    amountContainer:{
        flexDirection:'row',
        padding:10,
        borderRadius:5,
        alignItems:'center',
        backgroundColor:"#eeeeee",
        marginHorizontal:10,
        justifyContent:'center'
    },
    amountCurrency:{
        fontSize:20,
        fontWeight:"bold"
    },
    amountText:{
        fontSize:40,
        fontWeight:"bold",
        color:"#11192b",
        marginRight:3
    },
    buttonText:{
        color:"#fff",
        fontSize:24,
        fontWeight:"600",
    },
    freqAmountContainer:{
        flexDirection:"row",
        marginHorizontal:5,
        justifyContent:"flex-start",
        height:width/4,
        elevation:10
    },
    freqAmount:{
        backgroundColor:"#effafc",
        justifyContent:"center",
        alignItems:'center',
        borderRadius:10,
        paddingHorizontal:15,
        marginHorizontal:5,
        height:30
    },
    freqText:{
        fontWeight:"bold",
        fontSize:11
    },
    numPadView:{
        flex:1,
        marginTop:10,
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    divider:{
        width:width-10,
        backgroundColor:"#eeeeee",
        borderColor:"#eeeeee",
        marginVertical:5,
        borderWidth:0.2,
    },
    bottomMost:{
        flex:0.4,
        position:'relative',
        marginBottom:15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanButtonContainer:{
        position: 'absolute',
        bottom: 10,
        width: width/1.5, // Align the child to the right side of the parent
        height: 60,
        marginRight:15,
        justifyContent:"center",
    },
    scanButton:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:"#fe7918",
        borderRadius:50,
        height:'100%'
    },
    scanIcon:{
        height:30,
        width:30
    },
    scanText:{
        marginLeft:20,
        color:"#fff",
        fontWeight:"800",
        fontSize:30
    },
    buttonTop:{
        backgroundColor:"#eeeeee",
        padding:10,
        borderRadius:30
    }

});

export default Home;
