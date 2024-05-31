import React, {useState} from 'react';
import styled from "styled-components";
import Chart from 'react-apexcharts'
import {mainColor} from "../../../utills/ServiceUrls";
import Spinner from "../../spinner/Spinner";
import {AnimateSharedLayout} from "framer-motion";


const RektorDashboardChart = ({series, isSpinner, labels, title}) => {

    const [options, setOptions] = useState({
        chart: {
            type: 'pie',
            width: 300,
            events: {
                dataPointSelection: function (event, chartContext, config) {

                }
            }
        },
        labels: labels,
        dataLabels: {
            fontSize: '8px'
        },
        title: {
            text: title,
            style: {
                fontSize: '15px',
                fontWeight: 600,
                color: `${mainColor}`
            },
        },
        responsive: [{
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],

    });


    return (
        <AnimateSharedLayout>

            <Container>
                {isSpinner ? <Spinner/> : <Chart options={options} series={series} type="pie" width="330"/>}
            </Container>
        </AnimateSharedLayout>
    )
};


const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eae5e5;
    border-radius: 10px;
    padding: 10px !important;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

`;

export default RektorDashboardChart;