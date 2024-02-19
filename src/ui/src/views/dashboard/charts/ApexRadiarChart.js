// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import {Card, CardHeader, CardTitle, CardBody, Spinner} from 'reactstrap'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

const ApexRadiarChart = () => {

    const {userData} =  useSelector(store=>store.auth)
    const {linkFetching, linkRequestSummary,cardProvisioningRequestsSummary,provisioningFetching} =  useSelector(store=>store.dashboard)
    const [apexChartData, setApexChartData] =  useState();
    const [chartOptions, setChartOptions] = useState();
    const [title, setTitle] = useState("");

    useEffect(()=>{
        if(userData.role === "ADMIN" && cardProvisioningRequestsSummary){
            const labels = ["Pending", "Provisioned"]
            const series = [cardProvisioningRequestsSummary.pending, cardProvisioningRequestsSummary.provisioned]
            const colors = ['#fe7918','#00d4bd']
            const title = "Card Provisioning Requests"
            const data = { title,labels,series, colors }
            setApexChartData(data)
            setTitle(title)
        }else if(userData.role === "SCHOOL" && linkRequestSummary){
            const labels = ["Pending", "Approved", "Rejected"]
            const series = [linkRequestSummary.pending, linkRequestSummary.approved,linkRequestSummary.rejected]
            const colors = ['#fe7918','#00d4bd','#6e6b7b']
            const title = "Parent Student Link Requests"
            const data = { title,labels,series, colors }
            setApexChartData(data)
            setTitle(title)
        }
    },[linkRequestSummary, cardProvisioningRequestsSummary])
    // ** Chart Options

    useEffect(()=>{
        if(apexChartData){
            const options = {
                legend: {
                    show: true,
                    position: 'bottom'
                },
                labels: apexChartData.labels,

                colors: apexChartData.colors,
                dataLabels: {
                    enabled: true,
                    formatter(val) {
                        return `${parseInt(val)}%`
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            labels: {
                                show: true,
                                name: {
                                    fontSize: '2rem',
                                    fontFamily: 'Montserrat'
                                },
                                value: {
                                    fontSize: '1rem',
                                    fontFamily: 'Montserrat',
                                    formatter(val) {
                                        return `${parseInt(val)}%`
                                    }
                                },
                                total: {
                                    show: true,
                                    fontSize: '1rem',
                                    label: 'Total',
                                    formatter() {
                                        const total = apexChartData.series.reduce((a, b) => a + b, 0)
                                        return `${total.toLocaleString()}`
                                    }
                                }
                            }
                        }
                    }
                },
                responsive: [
                    {
                        breakpoint: 992,
                        options: {
                            chart: {
                                height: 380
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    },
                    {
                        breakpoint: 576,
                        options: {
                            chart: {
                                height: 320
                            },
                            plotOptions: {
                                pie: {
                                    donut: {
                                        labels: {
                                            show: true,
                                            name: {
                                                fontSize: '1.5rem'
                                            },
                                            value: {
                                                fontSize: '1rem'
                                            },
                                            total: {
                                                fontSize: '1.5rem'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
            setChartOptions(options);
        }
    },[apexChartData])

    // ** Chart Series

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody>
                <div className="d-flex flex-row justify-content-center align-items-center" style={{height: '260px'}}>
                {
                    (linkFetching || provisioningFetching) ?

                        <Spinner/>
                            :
                        chartOptions && (<Chart options={chartOptions} series={apexChartData.series} type='donut' height={260} />)
                }
                        </div>

            </CardBody>
        </Card>
    )
}

export default ApexRadiarChart
