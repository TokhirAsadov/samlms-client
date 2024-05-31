import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../../../../utills/ServiceUrls";
import img from './img/dekanAccount.png';
import SimpleBar from 'simplebar-react';
import { useSelector } from "react-redux";
import { FaUserAlt } from "react-icons/fa";

const scrollStyle = {
  width: 720,
  maxHeight: 180,
  padding: 10
}

const BestStudents = () => {

  const bestStudents = useSelector(state => state?.badBest?.badBest?.bestStudents);

  return (
    <Container>
      <Header>
        Best Students
      </Header>
      <SimpleBar style={scrollStyle}>
        <Wrapper>
          <ItemRow>
            {
              bestStudents?.map(item=>(
                <Item key={item?.id}>
                  {
                    item?.user?.photos?.id ? <img
                      src={"http://localhost:8081/api/v1/desktop/attachment/download/" + item?.user?.photos?.id}
                      width={"120px"} height={"120px"}
                      alt={item?.user?.fullName}
                      style={{borderRadius: "50%", border: `1px solid ${mainColor}`}}
                    /> : <Icon><FaUserAlt/></Icon>
                  }
                  <ItemFieldWrap>
                    <Name>{item?.user?.fullName}</Name>
                    <Group>Group: {item?.group?.name}</Group>
                  </ItemFieldWrap>
                </Item>
              ))
            }
          </ItemRow>
        </Wrapper>
      </SimpleBar>

    </Container>
  );
};

const Icon = styled.div`
  width: 120px;
  height: 120px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  border: 1px solid ${mainColor};
  border-radius: 50%;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  
`;

const ItemFieldWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ItemRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  padding-right: 1rem!important;
  padding-left: 1rem!important;
  overflow: hidden;
`;

const Group = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.2px;
`;
const Name = styled.span`
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 11px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-direction: column;
`;




const Header = styled.div`
  width: 100%;
  display: flex;
  font-size: 34px;
  letter-spacing: 1.1px;
  padding-top: 1rem!important;
  padding-left: 1rem!important;
`;


const Container = styled.div`
  max-height: 250px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  flex-direction: column;
  border-radius: 10px;
  margin-top: 10px!important;
  margin-bottom: 10px!important; 
  background-color: #fff; 
  color: ${mainColor};
  overflow: hidden;
`;

export default BestStudents;