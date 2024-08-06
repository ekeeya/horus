import React, {useCallback, useEffect, useState} from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {DataTable} from 'react-native-paper';
import colors from 'tailwindcss/colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getSalesSummaryReport} from '../../store/reports';

const Ionicons = React.lazy(() => import('react-native-vector-icons/Ionicons'));

const DailySalesReport = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {userData} = useSelector(store => store.auth);

  const {working, dailySummaryEntries, totals} = useSelector(
    store => store.reports,
  );

  useEffect(() => {
    dispatch(
      getSalesSummaryReport({
        posId: userData.user.posCenter.id,
      }),
    );
  }, [dispatch]);

  return (
    <>
      <View className="flex border-b border-b-purple-500 p-2 mt-2 flex-row mb-5 justify-between">
        <View className="flex  flex-row justify-center items-center space-x-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-circle-outline"
              color={colors.purple['600']}
              size={40}
            />
          </TouchableOpacity>
          <View className="flex items-center text-purple-400 p-0.5 rounded-lg">
            <Text className="text-xs font-bold mx-2 text-church-800">
              Daily Aggregated Sales Report
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            dispatch(
              getSalesSummaryReport({
                posId: userData.user.posCenter.id,
              }),
            )
          }>
          <Ionicons
            name="reload-circle-outline"
            color={colors.blue['600']}
            size={40}
          />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex m-5">
        {working ? (
          <ActivityIndicator />
        ) : (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>ITEM</DataTable.Title>
              <DataTable.Title> CATEGORY</DataTable.Title>
              <DataTable.Title numeric>QTY</DataTable.Title>
              <DataTable.Title numeric>AMOUNT</DataTable.Title>
            </DataTable.Header>
            {dailySummaryEntries.map((row, idx) => (
              <DataTable.Row key={idx}>
                <DataTable.Cell>{row.categoryName}</DataTable.Cell>
                <DataTable.Cell>{row.item}</DataTable.Cell>
                <DataTable.Cell numeric>{row.quantitySold}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {row.totalAmountSold.toLocaleString()}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            <DataTable.Row>
              <DataTable.Cell>
                <Text className="font-bold text-black">TOTALS</Text>
              </DataTable.Cell>
              <DataTable.Cell />
              <DataTable.Cell />
              <DataTable.Cell numeric>
                <Text className="font-bold text-black">
                  {totals.toLocaleString()}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        )}
      </ScrollView>
    </>
  );
};
export default DailySalesReport;
