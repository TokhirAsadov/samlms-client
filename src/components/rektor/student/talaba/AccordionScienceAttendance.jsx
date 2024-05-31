import React, {memo, useEffect} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from "styled-components"
import {fetchEducationYearStatistics} from "../../../../redux/actions/educationYear/education_year_statistics_actions";
import {useHttp} from "../../../hook/useHttp";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {educationYearStatisticsFetched} from "../../../../redux/slice/educationYear/education_year_statistics_slice";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

const AccordionScienceAttendance = ({studentData,educationYear}) => {

    const educationYearStatistics = useSelector(state => state?.educationYearStatistics?.educationYearStatistics) || [];

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };


    return (
        <>
            {educationYearStatistics.length>0 ? educationYearStatistics?.map((item, key) => (
                <Accordion key={key} expanded={expanded === key} onChange={handleChange(key)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <AccBox>
                            <h4>{item?.lessonName}</h4>
                            <AccBage bg={item?.nbCount === 0 && "#45d745"}>{item?.nbCount}</AccBage>
                        </AccBox>
                    </AccordionSummary>
                    <AccordionDetails>
                        {item?.nbData?.length > 0 ? item?.nbData?.map((childItem, childKey) => (
                            <BodyItem bg={"red"} jsc={"space-between"} key={childKey}>
                                <p>
                                    {childItem?.date}
                                </p>

                                <p>
                                    {childItem?.section} - section
                                </p>
                            </BodyItem>
                        )) : <BodyItem jsc={"center"} bg={"#45d745"}>
                            Dars qoldirilmagan
                        </BodyItem>}
                    </AccordionDetails>
                </Accordion>
            )):(
                <Box sx={{ width: "100%" }}>
                    <Typography variant="h2"><Skeleton /> </Typography>
                    <Typography variant="h2"><Skeleton  animation="wave" /> </Typography>
                    <Typography variant="h2"><Skeleton animation={false} /> </Typography>
                </Box>
            )}
        </>
    );
};

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
`;

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
`;

export default memo(AccordionScienceAttendance);
