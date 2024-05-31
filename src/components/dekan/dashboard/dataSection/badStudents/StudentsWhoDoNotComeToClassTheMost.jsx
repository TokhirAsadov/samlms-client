import React from 'react';
import {BASE_URL, color_2, mainColor} from "../../../../../utills/ServiceUrls";
import styled from 'styled-components'
import img from './../bestStudents/img/dekanAccount.png'
import SimpleBar from 'simplebar-react';
import {useSelector} from "react-redux";
import {FaUserAlt} from "react-icons/fa";

const scrollStyle = {
  width: 300,
  maxHeight: 640
}

const StudentsWhoDoNotComeToClassTheMost = () => {

  const badBest = useSelector(state => state?.badBest?.badBest)
  const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  const allStudents=badBest?.allStudents?.map(({user,group,statistics:data}) => {
    let value = 0;
    days?.map( item => {
      let d = new Date(new Date().setDate(new Date().getDate() - item)).getDay();
      if (data[item]===null && d!==0 && d!==6) {
        value++;
      }
    })
    return {user,group,value}
  }).sort((a, b) => (a > b ? -1 : 1));


  return (
    <Container>
      <Header>Students who did not come to class in the last 30 days</Header>
      <SimpleBar style={scrollStyle}>
        <ItemWrapper>
          {

            allStudents?.map(item =>(
              <Wrapper key={item?.user?.id}>
                <Item >
                  {
                    item?.user?.photos?.id ? <img
                      src={BASE_URL+"/attachment/download/" + item?.user?.photos?.id}
                      width={"40px"} height={"40px"}
                      alt={item?.user?.fullName}
                      style={{borderRadius: "50%", border: `1px solid ${mainColor}`}}
                    /> : <Icon><FaUserAlt/></Icon>
                  }
                  <ItemFields>
                    <Name>{item?.user?.fullName}</Name>
                    <Group>{item?.group?.name}<Value>{item?.value}</Value></Group>
                  </ItemFields>
                </Item>
                <hr style={{width: "80%"}}/>
              </Wrapper>
            ))
          }
      </ItemWrapper>
      </SimpleBar>
    </Container>
  );
};

const Value = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px!important;
  line-height: 10px;
  font-size: 10px;
  background-color: #ff0000;
  border-radius: 50%;
  color: #ffffff;
`;

const Wrapper=styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Icon = styled.div`
  width: 40px;height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 1px solid ${mainColor};
  border-radius: 50%;
`;

const Group = styled.span`
  width: 100%;
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  color: ${color_2};
`
const Name = styled.span`
  display: flex;
  font-size: 16px;
  color: ${mainColor};
`

const ItemFields = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;



const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: column;
  max-height: 700px;
`;

const Header=styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
`

const Container = styled.div`
  min-height: 360px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  margin-top: 10px!important;
  margin-bottom: 10px!important;
  padding: 10px!important;
  background-color: #fff; 
  color: ${mainColor};
`;

export default StudentsWhoDoNotComeToClassTheMost;