// ** Third Party Components
import {Bar} from 'react-chartjs-2'
import Flatpickr from 'react-flatpickr'
import {Calendar} from 'react-feather'

// ** Reactstrap Imports
import {Card, CardHeader, CardBody, Spinner, CardTitle} from 'reactstrap'
import {useEffect, useState} from "react";
import { useSelector} from "react-redux";
import {generateColors} from "@utils";

const ChartjsHorizontalBarChart = ({ gridLineColor, labelColor}) => {

    const {userData} =  useSelector(store=>store.auth)
    const {fetchingPosSales,posSales,schoolSales, fetchingSchoolSales} =  useSelector(store=>store.dashboard)
    const [barChartData, setBarChartData] =  useState();
    const [chartData, setChartData] = useState();
    const [title, setTitle] = useState("");


    useEffect(()=>{
        if(userData.role === "SCHOOL" && posSales){
            const labels = posSales.length > 0 ? posSales[0].days : [];
            const title = "POS Weekly Sales"
            const colors = generateColors(posSales.length);
            const datasets = posSales.length > 0 ? posSales.map((sale,i)=>{
                return {
                    maxBarThickness: 10,
                    label: sale.name,
                    backgroundColor: colors[i],
                    borderColor: 'transparent',
                    data: sale.sales
                }
            }) : []

            const data = {datasets,title, labels}
            setBarChartData(data)
            setTitle(title)
        }else if(userData.role==="ADMIN" && schoolSales){
            const labels = schoolSales.length > 0 ? schoolSales[0].days : [];
            const title = "School Weekly Sales"
            const colors = generateColors(schoolSales.length);
            const datasets = schoolSales.length > 0 ? schoolSales.map((sale,i)=>{
                return {
                    maxBarThickness: 10,
                    label: sale.name,
                    backgroundColor: colors[i],
                    borderColor: 'transparent',
                    data: sale.sales
                }
            }) : []

            const data = {datasets,title, labels}
            setBarChartData(data)
            setTitle(title)
        }
    }, [posSales, schoolSales])

    useEffect(()=>{
        if(barChartData){
            const data = {
                labels: barChartData.labels,
                datasets: barChartData.datasets
            }
            setChartData(data);

        }
    },[barChartData])

    // ** Chart Options
    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {duration: 500},
        elements: {
            bar: {
                borderRadius: {
                    topRight: 15,
                    bottomRight: 15
                }
            }
        },
        layout: {
            padding: {top: -4}
        },
        scales: {
            x: {
                min: 0,
                grid: {
                    drawTicks: false,
                    color: gridLineColor,
                    borderColor: 'transparent'
                },
                ticks: {color: labelColor}
            },
            y: {
                grid: {
                    display: false,
                    borderColor: gridLineColor
                },
                ticks: {color: labelColor}
            }
        },
        plugins: {
            legend: {
                align: 'end',
                position: 'top',
                labels: {color: labelColor}
            }
        }
    }

    // ** Chart Data

    return (
        <Card>
            <CardHeader
                className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
                <CardTitle tag='h4'>{title}</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="d-flex flex-row justify-content-center align-items-center" style={{height: '280px'}}>
                    {
                        fetchingPosSales || fetchingSchoolSales ?
                            <Spinner/>
                            :
                            chartData && (<Bar data={chartData} options={options} height={280}/>)
                    }
                </div>
            </CardBody>
        </Card>
    )
}

export default ChartjsHorizontalBarChart