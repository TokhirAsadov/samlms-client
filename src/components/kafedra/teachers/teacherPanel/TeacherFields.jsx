import React from 'react';
import styled from "styled-components";
import {BASE_URL, mainColor} from "../../../../utills/ServiceUrls";
import Spinner from "../../../spinner/Spinner";
import {extrasmall, large, medium, small} from "../../../../responsiv";
import moment from "moment/moment";
import Noimg from "../../../../utills/images/no-picture.jpg";

const TeacherFields = ({data, open}) => {
    if (!data) return <Spinner/>

    return (
        <Section>
            {

                open ?
                    <>
                        <UserDetailsWrapper>
                            <PhotoWrapper>
                                {
                                    data.photo?.id ? <img
                                        src={BASE_URL + "/attachment/download/" + data?.photo?.id}
                                        width={"100%"}
                                        alt={data.fullName}
                                        style={{borderRadius: "50%"}}
                                    /> : <img src={Noimg} alt={"img"} style={{width:"100%"}}/>
                                }
                            </PhotoWrapper>
                            <UserDetailsSection>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        ID :
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {data?.login}
                                    </MainDetailTitle>
                                </UserMainDetail>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        Birthday :
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {moment(new Date(data?.bornYear)).format("DD.MM.YYYY")}
                                    </MainDetailTitle>
                                </UserMainDetail>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        Passport :
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {data?.passportNum}
                                    </MainDetailTitle>
                                </UserMainDetail>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        State :
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {data?.citizenship}
                                    </MainDetailTitle>
                                </UserMainDetail>

                                {data?.phones?.map((item, key) => (
                                    <UserMainDetail key={key}>
                                        <MainDetailItemLabel>
                                            {item.phoneType === "MOBILE_PHONE" && "Mobil phone"}
                                            {item.phoneType === "HOME_PHONE" && "Home phone"}
                                            {item.phoneType === "WORK_PHONE" && "Work phone"}
                                        </MainDetailItemLabel>
                                        <MainDetailTitle>
                                            +{item?.phoneNumber}
                                        </MainDetailTitle>
                                    </UserMainDetail>
                                ))}
                            </UserDetailsSection>
                        </UserDetailsWrapper>

                        <TeachingContainer>
                            <UserDetailsSection>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        Lavozimi :
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {data?.positions && data?.positions[0]}
                                    </MainDetailTitle>
                                </UserMainDetail>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        Kafedrasi :
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {data?.kafedraName}
                                    </MainDetailTitle>
                                </UserMainDetail>
                                <UserMainDetail>
                                    <MainDetailItemLabel>
                                        Ish o`rni:
                                    </MainDetailItemLabel>
                                    <MainDetailTitle>
                                        {data?.workerStatus}
                                    </MainDetailTitle>
                                </UserMainDetail>
                            </UserDetailsSection>
                        </TeachingContainer>

                        <FailContainer>
                            <FailWrapper>
                                Umumiy reyting:
                            </FailWrapper>
                        </FailContainer>
                    </>
                    : <Spinner/>
            }
        </Section>
    );
};

const FailWrapper = styled.span`
  width: 80%;
  padding-left: 30px !important;
  position: relative;
  border-radius: 20px;
  font-size: 24px;
  color: ${mainColor};
`;
const FailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px !important;
  padding: 10px 20px !important;
  background-color: #F4F8FD;
  border-radius: 10px;
  width: 100%;
  
`;


const TeachingContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #F4F8FD;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 20px !important;
  padding: 5px 0 !important;
`;

const Section = styled.div`
 
  width: 30%;
 
  padding: 10px !important;
  ${large({
    width: "70%",
    margin: "0 auto",
  })}
  ${medium({
    width: "75%",
    margin: "0 auto",
  })}
  ${small({
    width: "80%",
    margin: "0 auto",
  })}
  ${extrasmall({
    width: "100%",
    margin: "0 auto",
  })}
`;



const MainDetailTitle = styled.span`
  flex: 1;
  margin-left: 20px !important;
  display: block;

  span {
    font-size: 12px;
  }
`;

const MainDetailItemLabel = styled.span`
  flex: 1;
  margin-left: 10px !important;
  color: ${mainColor};
`;

const UserMainDetail = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px !important;
`;

const PhotoWrapper = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ece7e7;
`;

const UserDetailsSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  border-radius: 10px;
`;

const UserDetailsWrapper = styled.div`
  padding-top: 15px;
  background-color: #F4F8FD;
  border-radius: 10px;
  width: 100%;
  margin-bottom: 20px !important;
`;

export default TeacherFields;