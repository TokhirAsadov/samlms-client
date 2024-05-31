import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Chart from 'react-apexcharts'
import {useSelector} from "react-redux";
import axios from "axios";
import {AnimateSharedLayout, motion} from "framer-motion";
import {BASE_URL, mainColor} from "../../../../utills/ServiceUrls";
import Spinner from "../../../spinner/Spinner";
import BulimExpandedCard from "./BulimExpandedCard";


const BulimChart = ({series,isSpinner,s}) => {

  const [expanded,setExpanded] = useState(false);
  const [openColor,setOpenColor] = useState('');
  const [defaultOpen,setDefaultOpen] = useState(false);
  const [title,setTitle] = useState('');
  const [openTable,setOpenTable] = useState(false);

  const section = useSelector(state => s ? state?.secondBulim?.secondBulim : state?.bulim?.bulim);

  const [options,setOptions] = useState({
    chart: {
      type: 'donut',
      width: 380,
      events: {
        dataPointSelection: function(event, chartContext, config){
          config.dataPointIndex===1 ? setDefaultOpen(false) : setDefaultOpen(true);
          config.dataPointIndex===1 ? setTitle("Kelmaganlar") : setTitle('Kelganlar');
          setOpenTable(false);
          getStatistics(config.dataPointIndex,section?.id);
          setExpanded(true)
        }
      }
    },
    labels: ['Kelganlar', 'Kelmaganlar'],
    title: {
      text: "Statistics Of Today",
      style: {
        fontSize:  '12px',
        fontWeight:  'bold',
        fontFamily:  undefined,
        color:  `${mainColor}`
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    colors: [
      function({ value, seriesIndex, w }) {
        return `${mainColor}`
      },
      function({ value, seriesIndex, w }) {
        if (value < w.config.series[0]/5) {
          setOpenColor('#fff700')
          return '#fff700'
        } else if (value > w.config.series[0]/5 && value < w.config.series[0]/2 ) {
          setOpenColor('#f88017')
          return '#f88017'
        } else {
          setOpenColor('#f00')
          return '#f00'
        }
      },
    ],
    plotOptions: {
      pie: {
        expandOnClick: false,
        size: 400,
        height:'5%',
        donut: {
          size: '55%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              fontSize: '18px',
              color: `${mainColor}`
            }
          }
        }
      }
    }
  });
  const [data,setData] = useState([]);


  useEffect(()=>{
    console.log(s," <- s")
  },[s])


  const getStatistics = (index) => {

    axios.get(BASE_URL+"/section/getStatisticsForSectionDashboard?index="+index+"&sectionId="+section?.id)
      .then(res => {
        setData(res?.data?.obj?.map((i,index)=> ({...i,id:index})));
        setOpenTable(true);
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <AnimateSharedLayout >
      {expanded ? (
        <BulimExpandedCard
          setExpanded={() => setExpanded(false)}
          isDefault={defaultOpen}
          openColor={openColor}
          title={title}
          openTable={openTable}
          data={data}
        />
      ) : (
        <motion.div
          layoutId="kafedraId"
          style={{
            width:'100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Container>
            { isSpinner ? <Spinner /> : <Chart options={options} series={series} type="donut" width="350" />}
          </Container>
        </motion.div>
      )}
    </AnimateSharedLayout>
  )
};


const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default BulimChart;