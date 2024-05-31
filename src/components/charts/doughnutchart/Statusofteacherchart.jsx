import React, {useState} from 'react';
import ApexChart from "react-apexcharts";
import {mainColor} from "../../../utills/ServiceUrls";
import Spinner from "../../spinner/Spinner";
const Statusofteacherchart = ({title,series,labels,isSpinner}) => {


    const [data,setdata]=useState(
        {
            series:series,
            options: {
                chart: {
                    width: 300,
                    type: 'pie',
                },
                title: {
                    text: title,
                    style: {
                        fontSize:  '16px',
                        fontWeight:  'bold',
                        color:  `${mainColor}`
                    },
                },
                labels: labels,
                responsive: [{
                    breakpoint: 300,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
        }

    )
    return (
        <>
            {isSpinner ? <Spinner/> : <ApexChart options={data.options} series={data.series} type="pie" width={330} />}
        </>
    );
};

export default Statusofteacherchart;