import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {extrasmall, large, medium, small, xlarge, xxlarge} from "../../../responsiv";
import {mainColor} from "../../../utills/ServiceUrls";
import Tooltip from "@mui/material/Tooltip";
import './grouptabs.css';
import CircularProgress from "@mui/material/CircularProgress";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import ExportBtnToExcel from "./ExportBtnToExcel";
const SchoolTabs = ({schools,load}) => {

    const [value, setValue] = useState(schools[0]?.schoolName);

    const [date, setDate] = useState([])

    useEffect(() => {
        setDate(schools.filter(item => item.schoolName === value))
    }, [value, schools])


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function pres(a, b) {
        if (!a || !b) return 0
        return Math.ceil(a * 100 / b)
    }

    function pres2(a) {
        return 100 - a
    }

    return (
        <div className="studtabs">
            <Tabs
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                value={value}
                onChange={handleChange}
                indicatorColor=""
            >
                {schools.map((school, key) => (
                    <Tab
                        key={key}
                        component={tabsitem}
                        value={school.schoolName}
                        label={school?.schoolName?.substring(school?.schoolName?.indexOf("f", 1) + 1)}/>
                ))}
            </Tabs>


            {
                <Boxcore>
                    {load && <Box sx={{ display: 'flex',justifyContent:'center' }}>
                        <CircularProgress />
                    </Box>}
                    {!load && date[0]?.allData?.length===0 && <Box>
                        <EmptyDataImg w={200} h={180} />
                    </Box>}
                    <Cardcore>
                        {!load && date[0]?.allData?.map((item, key) => (
                            <Carditem key={key}>
                                <Boximg>
                                    <img width='100%' src={item.photo} alt="rasim"/>
                                </Boximg>
                                <Rigthbox>
                                    <Titlecard>
                                        {item.name}
                                    </Titlecard>
                                    <Numberbox>
                                        <Numstudent color={'#9cd365'}>{item.allCount}</Numstudent>
                                        <Numstudent
                                            color={mainColor}>{pres(item.comeCount, item.allCount)}%</Numstudent>
                                    </Numberbox>
                                    <Progres>
                                        <Tooltip title={`kelgan:${item.comeCount}`}>
                                            <Progresitem bgcolor={mainColor}
                                                         width={`${pres(item.comeCount, item.allCount)}%`}/>
                                        </Tooltip>
                                        <Tooltip title={`kelmagan:${item.allCount - item.comeCount}`}>
                                            <Progresitem bgcolor={"red"}
                                                         width={`${pres2(pres(item.comeCount, item.allCount))}%`}/>
                                        </Tooltip>
                                    </Progres>
                                </Rigthbox>
                            </Carditem>
                        ))}
                    </Cardcore>
                    {
                        date[0]?.allData.length >0 && <Box display={'flex'} justifyContent={'end'} sx={{mt:3}}>
                            <ExportBtnToExcel direction={value} dataToExcel={date[0]?.allData}/>
                        </Box>
                    }
                </Boxcore>
            }


        </div>
    );
};



const tabsitem = styled.div`
  font-size: 13px !important;
  width: 200px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  border-radius: 8px !important;
  color: ${mainColor} !important;
  padding: 5px 20px !important;
  height: 42px !important;
  margin: 5px !important;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px !important;

  &:hover {
    color: #ffffff !important;
    background-color: #5093f1 !important;
  }

  &.Mui-selected {
    color: #ffffff !important;
    background-color: #5093f1 !important;
  }


`
const Boxcore = styled.div`
  position: relative;
  padding:40px;
  margin: 30px 0;
  width: 100%;
  background-color: #FFF;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  ${extrasmall({
    padding:"20px"
  })}
`

const Progresitem = styled.div`
  width: ${props => props.width};
  height: 100%;
  background-color: ${props => props.bgcolor};
`
const Progres = styled.div`
  display: flex;
  width: 100%;
  overflow: hidden;
  height: 8.5px;
  border-radius: 5px;
`
const Numstudent = styled.h6`
  color: ${props => props.color};
`
const Numberbox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const Titlecard = styled.h6`
  font-size: 14px;
`
const Rigthbox = styled.div`
  width: 100%;

`

const Boximg = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Cardcore = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 50px;
${medium({
    gridTemplateColumns: "1fr 1fr ",
})}
  
${medium({
    gridTemplateColumns: "1fr",
})}
  
${small({
    gridTemplateColumns: "1fr",
})}
  
${extrasmall({
    gridTemplateColumns: "1fr",
  gap: "30px",
})}
  
`

const Carditem = styled.div`
  flex: 1;
  padding: 10px;
  background-color: #f1eeee;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  cursor: pointer;
  transition: 0.06s;

  &:hover {
    transform: scale(1.05);
  }
`

export default SchoolTabs;