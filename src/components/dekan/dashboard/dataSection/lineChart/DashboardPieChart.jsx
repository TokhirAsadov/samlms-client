import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor} from "../../../../../utills/ServiceUrls";
import Chart from "react-apexcharts";
import {useSelector} from "react-redux";
import axios from "axios";
import {AnimateSharedLayout,motion} from "framer-motion";
import GroupExpandedCard from "./GroupExpandedCard";

const DashboardPieChart = () => {

  const fails = useSelector(state => state?.badBest?.badBest?.failsOfGroup)

  const [group,setGroup] = useState("");

  const series = [
    {
      name: "Fails",
      data: fails?.filter(({count}) => (count!==null)).map(({count}) =>(count===null ? 0 : count)),
    },
  ];
  const options = {
    chart: {
      id: "simple-bar",
      borderRadius: 10,
      events: {
        dataPointSelection: function(event, chartContext, config){
          setGroup(config.w.config.xaxis.categories[config.dataPointIndex])
          setExpanded(true);
        }
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
      }
    },
    xaxis: {
      labels: {
        show: false
      },
      categories: fails?.filter(({count}) => (count!==null)).map(({name,count}) =>(name)),
    },
  };

  useEffect(()=>{
    console.log(group,"group")

    axios.get(BASE_URL+"/dekan/getGroupFails/"+group)
      .then(res=>{
        setData(
          res?.data.map(({user,fails}) => {
            return {
              id: user?.id,
              fullName: user?.fullName,
              email: user?.email,
              passport: user?.passportNum,
              fails
            }
          })
        )
      })
      .catch(err=>{
        console.log(err)
      })
  },[group])

  const [expanded,setExpanded] = useState(false);
  const [data,setData] = useState([]);

  return (
    <AnimateSharedLayout>
      {
        expanded ? (
            <GroupExpandedCard
              setExpanded={() => setExpanded(false)}
              isDefault={false}
              openColor={mainColor}
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
            <Container >
              <Chart options={options} type="bar" series={series} width="600px" />
            </Container>
          </motion.div>
        )
      }
    </AnimateSharedLayout>
  );
};




const Container = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-top: 10px!important;
  padding: 10px!important;
  background-color: #fff; 
  color: ${mainColor}; 
`;

export default DashboardPieChart;