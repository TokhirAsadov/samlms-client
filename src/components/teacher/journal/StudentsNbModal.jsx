import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import moment from "moment";
import {useSelector} from "react-redux";

const StudentsNbModal = ({data}) => {
    const {subjects,fullName}=data
    const hours =useSelector(state => state.hourSection)


    const filterSubjectArr = subjects?.filter(item => item?.statistics.length === 0 || item.statistics?.some(i=>i?.isCome===false) )?.map(item =>{
        const date=moment().year(item.year).week(item.week).day(item.day).format('DD.MM.YYYY')
        const hourStart=hours.find(h=>h.number===item.section).start
        return {...item, date,hourStart:moment(hourStart).format("HH:mm") }
    }).filter(item => moment(`${item.date} ${item.hourStart}`, 'DD.MM.YYYY HH:mm').isSameOrBefore(moment(),'minute'))

    const uniqueArray = filterSubjectArr?.sort((a, b) => {
        const dateA = moment(`${a.date} ${a.hourStart}`, 'DD.MM.YYYY HH:mm');
        const dateB = moment(`${b.date} ${b.hourStart}`, 'DD.MM.YYYY HH:mm');
        return dateB.diff(dateA);
    });

    return (
        <Container>
            <TitleModal>
                {fullName}
            </TitleModal>
            <Bodybox>
                {uniqueArray?.length > 0 ? uniqueArray?.map((childItem, childKey) => (
                    <BodyItem bg={"red"} jsc={"space-between"} key={childKey}>
                        <p>
                            {childItem.date}
                        </p>

                        <p>
                            {childItem.section} - section
                        </p>
                    </BodyItem>
                )) : <BodyItem jsc={"center"} bg={"#45d745"}>
                    Dars qoldirilmagan
                </BodyItem>}

            </Bodybox>
        </Container>
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
export default StudentsNbModal;
