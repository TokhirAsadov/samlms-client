import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import moment from "moment";

const OneSciencesdata = ({data}) => {
    const {fan, studentName, nb} = data;
    console.log(data)

    const groupedArr = data?.nb2?.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        return a.para - b.para;

    }).reduce((acc, obj) => {
        const found = acc.find(group => group[0].name === obj.name);
        if (found) {
            found.push(obj);
        } else {
            acc.push([obj]);
        }
        return acc;
    }, [])

    return (
        <Container>
            <TitleModal>
                {fan}
                {studentName}
            </TitleModal>
            <Bodybox>
                {groupedArr?.length > 0 ? groupedArr?.map((item, key) => (
                        <Accordion key={key}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <AccBox>
                                    <h4> {item?.[0]?.name}</h4>
                                    <AccBage bg={item?.length === 0 && "#45d745"}>{item?.filter(i=>i?.date<=moment().format('DD.MM.YYYY'))?.length}</AccBage>
                                </AccBox>
                            </AccordionSummary>
                            <AccordionDetails>
                                {item && item?.length > 0 ? item?.map((childItem, childKey) => {
                                    console.log(childItem.date)
                                   if ( childItem?.date <= moment().format('DD.MM.YYYY')){
                                    return <BodyItem bg={"red"} jsc={"space-between"} key={childKey}>
                                        <p>
                                            {childItem?.date}
                                        </p>

                                        <p>
                                            {childItem?.para} - section
                                        </p>
                                    </BodyItem>
                                }}) : <BodyItem jsc={"center"} bg={"#45d745"}>
                                    Dars qoldirilmagan
                                </BodyItem>}

                            </AccordionDetails>
                        </Accordion>
                    ))
                    :
                    <BodyItem jsc={"center"} bg={"#45d745"}>
                        Dars qoldirilmagan
                    </BodyItem>

                }
            </Bodybox>
        </Container>
    )
        ;
};

const AccBox = styled.div`
  padding: 0 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  h4 {
    font-size: 15px;
  }
`
const AccBage = styled.div`
  font-size: 12px;
  background-color: ${props => props.bg || "red"};
  border-radius: 5px;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`
const BodyItem = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.jsc};
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 15px;
  color: white;
  background-color: ${props => props.bg};

  p {
    margin: 0;
  }
`;

const Bodybox = styled.div`
  margin-top: 70px;
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
export default OneSciencesdata;