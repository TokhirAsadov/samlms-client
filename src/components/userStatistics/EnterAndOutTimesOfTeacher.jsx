import React, {memo} from 'react';
import styled from "styled-components";
import moment from "moment";
import {mainColor} from "../../utills/ServiceUrls";
import error from '../../utills/images/error.jpg'
import EmptyDataImg from "../emptyDataImg/EmptyDataImg";

const EnterAndOutTimesOfTeacher = ({time,item}) => {
  return (
    <Container>
      <Header>
        <Dated>{moment(time).format(" MMMM Do YYYY")}</Dated>
        <WeekDay>{moment(time).format(" dddd")}</WeekDay>
      </Header>
      <hr style={{background: mainColor,minHeight:"2.5px"}}/>
      <Body>
        {
          item?.timeAsc ? <BodyWrapper>
                  <BodyItemsWrapper>
                    <BodyItem>Enter</BodyItem>
                    <BodyItem>Out</BodyItem>
                  </BodyItemsWrapper>
                  <BodyItemsWrapper>
                    <BodyItem>{moment(new Date(item?.timeAsc)?.toLocaleString('en-US', { timeZone: 'Asia/Tashkent' })).format("MMMM Do YYYY, HH:mm:ss")}</BodyItem>
                    <BodyItem>{moment(new Date(item?.timeDesc)?.toLocaleString('en-US', { timeZone: 'Asia/Tashkent' })).format("MMMM Do YYYY, HH:mm:ss")}</BodyItem>
                  </BodyItemsWrapper>
                </BodyWrapper>
            :
            <BodyError>
             <EmptyDataImg w={200} h={180}/>
            </BodyError>
        }
      </Body>
    </Container>
  );
};

const BodyError = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  
  &>h4{
    font-size: 14px;
  }
`;

const BodyItem = styled.div`
  flex: 1;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${mainColor};
`;

const BodyItemsWrapper= styled.div`
  width: 100%;
  display: flex;
`;

const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dated = styled.div`
  font-size: 24px;
`;

const WeekDay = styled.div`
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px 10px!important;
`;

export default memo(EnterAndOutTimesOfTeacher);