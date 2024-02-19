// ** Third Party Components
import 'chart.js/auto';
import {PolarArea} from 'react-chartjs-2'

// ** Reactstrap Imports
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody, Spinner,
} from 'reactstrap'
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

const ChartjsPolarAreaChart = props => {
    // ** Props
    const [chartData, setChartData] = useState([]);
    const {loading, statistics} = useSelector(store => store.dashboard)


    const {labelColor} = props

    useEffect(() => {
        if (statistics) {
            const data = [statistics.students.active, statistics.students.pending, statistics.students.suspended, statistics.students.disabled]
            setChartData(data)
        }
    }, [statistics])

    // ** Chart Options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {duration: 500},
        layout: {
            padding: {
                top: -5,
                bottom: -45
            }
        },
        scales: {
            r: {
                grid: {display: false},
                ticks: {display: false}
            }
        },
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 25,
                    boxWidth: 9,
                    color: labelColor,
                    usePointStyle: true
                }
            }
        }
    }

    // ** Chart Data
    const data = {
        labels: ['Active', 'Pending', 'Suspended', 'Disabled'],
        datasets: [
            {
                borderWidth: 0,
                label: '# of cards',
                data: chartData,
                backgroundColor: ["#28dac6", "#fe7918", "#e94500", "#4F5D70"]
            }
        ]
    }

    return (
        <Card>
            <CardHeader
                className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
                <CardTitle tag='h4'>Cards Summary</CardTitle>
            </CardHeader>
            <CardBody>
                <div className="d-flex flex-row justify-content-center align-items-center" style={{height: '260px'}}>
                    {
                        loading ?
                            <Spinner/>
                            :
                            <PolarArea data={data} options={options} height={260}/>
                    }

                </div>
            </CardBody>
        </Card>
    )
}

export default ChartjsPolarAreaChart
