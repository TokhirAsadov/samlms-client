import React from 'react';
import Chart from 'react-apexcharts';
import {mainColor} from "../../../../../utills/ServiceUrls";

const DashboardLineChart = () => {

  const options = {
      chart: {
        id: 'realtime',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false,
        // positions: top
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Fails',
        align: 'left',
        color: `${mainColor}`
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'number',
      },
      // yaxis: {
      //   max: 100
      // },
      legend: {
        show: true,
        position: 'top',
        // horizontalAlign: 'right'
      },
    };
  const series = [
    {
      name: "semester - 1",
      data: [     1,2,3,4,5,6,7,8,9,10,11,12,13,14,
        15,16,17,18,19,12,21,22,23,24,25,
        26,14,28,29,30,31,32,33,34,35,36,
        37,38,14,20,41,42,43,44,45,46,47,
        48,49,50
      ],
      color: "#6C5DD3"
    },{
      name: "semester - 2",
      data: [     1,2,3,4,5,6,7,8,9,10,11,12,13,14,
        15,16,17,18,19,20,21,22,23,24,25,
        26,27,28,29,30,31,32,33,34,35,36,
        37,38,39,40,41,42,43,44,45,46,47,
        48,49,50
      ],
      color: "#216FED"
    },
  ]

  return (
    <div>
      <Chart options={options} series={series} type="line" width={700} height={350} />
    </div>
  );
};

export default DashboardLineChart;