import React, {useEffect, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import moment from "moment";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import axios from "axios";

const SubjectStatistics = ({studentData}) => {

    const {fullName, studentId, subjectId,groupId,educationId} = studentData
    const [data,setData]=useState([])
    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const {headers} = getHeaders();

    const fetchData = async () => {
        await axios.get(`${BASE_URL}/downloadCounter/getDownloadCountOfOneStudent/${educationId}?groupId=${groupId}&subjectId=${subjectId}&studentId=${studentId}`,{headers})
          .then(response => {
              console.log(response?.data,"response")
              setData(response?.data?.obj)
          })
          .catch(error => {
              console.log(error)
          })
    }

    useEffect(()=>{
        fetchData();
    },[])

    return (
        <Container>
            <TitleModal>
                {fullName}
            </TitleModal>
            <Bodybox>
                {data[0]?.lines?.map((item, index) => (
                    <Accordion key={index} expanded={expanded === index} onChange={handleChange(index)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{
                                color: `${mainColor}`,
                                fontWeight: "bold"
                            }}>{item.queue + "-Mavzu:" + " " + item.themeName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CounterBox>
                                <ItemCount><b>File name </b></ItemCount>
                                <ItemCount><b>Number of downloads</b></ItemCount>
                                <ItemCount><b>last download time </b></ItemCount>
                            </CounterBox>
                            {item.counter.length > 0 ? item.counter.map((fileInfo, index) => (
                                <CounterBox key={index}>
                                    <ItemCount><p> {fileInfo.fileName.substring(0, fileInfo.fileName.indexOf("_"))}</p>
                                    </ItemCount>
                                    <ItemCount><p>{fileInfo.count} </p></ItemCount>
                                    <ItemCount><p>{moment(fileInfo.lastDownloadTime).format('DD.MM.YYYY HH:MM')} </p>
                                    </ItemCount>
                                </CounterBox>

                            )):(
                               <EmptyDataImg w={"140"} h={"120"}/>
                            )}

                        </AccordionDetails>
                    </Accordion>
                ))}


            </Bodybox>

        </Container>
    );
};


const CounterBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`
const ItemCount = styled.div`
  text-align: center;
  border: 1px solid silver;
  padding: 5px;
`
const Bodybox = styled.div`
  margin-top: 50px;
  padding: 10px;
  min-height: 300px;
  max-height: 450px;
  overflow-y: scroll;
`
const TitleModal = styled.div`
  position: absolute;
  font-size: 20px;
  color: #ffffff;
  background-color: ${mainColor};
  width: 100%;
  top: -1px;
  border-radius: 8px 8px 0 0;
  padding: 10px;
  z-index: 9;
`
const Container = styled.div`
`
export default SubjectStatistics;
