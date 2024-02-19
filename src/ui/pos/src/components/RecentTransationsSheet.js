import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import BottomSheet, {BottomSheetBackdrop, BottomSheetFlatList} from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {getTransactions} from "../store/payment";
import {formatCreditCardNumber, renderDateTime} from "../utils";


const {width, height} = Dimensions.get("window")
const RecentTransactionsSheet = ({show, onClose})=>{

    const [index, setIndex] =  useState(1);

    const dispatch = useDispatch();
    const {payments, loading} =  useSelector(store=>store.payment);
    const {userData} =  useSelector(store=>store.auth);
    const data = useMemo(
        () =>
            Array(50)
                .fill(0)
                .map((_, index) => `index-${index}`),
        []
    );
    const snapPoints = useMemo(() => ["25%", "50%"], []);
    const bottomSheetRef = useRef(null);
    const handleSheetChanges = useCallback((index) => {
        setIndex(index);
        if(index === -1){
            onClose()
        }
    }, []);

    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    useEffect(()=>{
        if(show){
            setIndex(1);
        }else{
            handleClosePress()
            setIndex(-1)
        }
    }, [show])

    useEffect(()=>{
        dispatch(getTransactions(userData.user.id))
    },[])

    const handleRefresh = ()=>{
        dispatch(getTransactions(userData.user.id))
    }
    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );
    const renderItem = useCallback(
        ({ item }) => (
            <View key={item.id} style={styles.itemContainer}>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.transactionImageContainer}>
                        <Image source={require("../assests/check-mark.png")} style={styles.imageIcon}/>
                    </View>
                    <View style={styles.paymentDetails}>
                        <Text style={styles.cardNo}>{formatCreditCardNumber(item.debitAccount.cardNo)}</Text>
                        <Text style={styles.studentName}>{item.debitAccount.name}</Text>
                        <Text style={styles.date}>{renderDateTime(item.createdAt)}</Text>
                    </View>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.currencyText}>UGX </Text>
                    <Text style={styles.amountText}>{item.amount.toLocaleString()}</Text>
                </View>
            </View>
        ),
        []
    );

    return(
        <BottomSheet
            ref={bottomSheetRef}
            index={index}
            enablePanDownToClose={true}
            bottomInset={0}
            backgroundStyle={{backgroundColor:"#fe7918", color:"#fff"}}
            style={styles.sheetContainer}
            backdropComponent={renderBackdrop}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            refreshing={loading}
            onRefresh={handleRefresh}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Recent Transactions</Text>
                <TouchableOpacity onPress={handleClosePress}>
                    <Ionicons name="close-circle-outline" size={30}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,backgroundColor: "#f6f6f6"}}>
                {
                    loading ?
                        <View style={{ alignItems:"center", margin:20}}>
                            <ActivityIndicator />
                        </View>
                        :
                        payments.length > 0 ?
                                (<BottomSheetFlatList
                                    data={payments}
                                    keyExtractor={(i) => i.id}
                                    renderItem={renderItem}
                                    contentContainerStyle={styles.contentContainer}
                                />)
                                :
                                (<View style={{ alignItems:"center", margin:20}}>
                                    <Text >No recent transactions found</Text>
                                </View>)

                }

            </View>
        </BottomSheet>
    )
}
const styles = StyleSheet.create({

    sheetContainer: {
        // add horizontal space
        marginHorizontal: 0,
        elevation:10
    },
    actionSheetContentContainer: {
        flex: 1,
        backgroundColor:"#fafafc",
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    },
    contentContainer: {
        backgroundColor: "white",
    },
    itemContainer: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:'center',
        padding: 6,
        margin: 6,
        marginHorizontal:10,
        height:width/6,
        borderRadius:10,
        backgroundColor: "#f6f6f6",
    },
    headerContainer:{
        marginLeft:10,
        flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:"blue"
    },
    closeSheetContainer:{
        marginRight:10,
        bottom:20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        color:"#11192b",
        fontWeight: 'bold',
    },
    amountContainer:{
        flexDirection:"row",
        marginRight:10
    },
    transactionImageContainer:{
        height:50,
        width:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#eeeeee"
    },
    imageIcon:{
        height:30,
        width:30
    },
    currencyText:{
        fontSize:10,
        paddingTop:4,
        color:"#65a38c"
    },
    amountText:{
        fontWeight:'bold',
        color:"#65a38c"
    },
    paymentDetails:{
        marginTop:2,
        marginHorizontal:10
    },
    cardNo:{
        fontWeight:"bold",
        color:"#11192b",
    },
    studentName:{
        fontSize:12
    },
    date:{
        fontSize:10
    }
});
export  default  RecentTransactionsSheet;
