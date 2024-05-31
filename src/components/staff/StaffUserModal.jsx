import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../utills/ServiceUrls";
import Noimg from "../../utills/images/no-picture.jpg";

const StaffUserModal = () => {
    return (
        <>
            <TitleHead>Staff Name</TitleHead>
            <Modalbody>
                <CardMain>
                    <PhotoWrapper>
                        <img src={Noimg} alt={"img"} style={{width: "100%"}}/>
                    </PhotoWrapper>
                    <BoxInfo>
                        <RowData>
                            <ColData>
                                ID:
                            </ColData>
                            <ColData endl={"end"}>
                                123456
                            </ColData>
                        </RowData>
                        <RowData>
                            <ColData>
                                Passport:
                            </ColData>
                            <ColData endl={"end"}>
                                AC000000
                            </ColData>
                        </RowData>
                        <RowData>
                            <ColData>
                                Birthday:
                            </ColData>
                            <ColData endl={"end"}>
                                01.07.1970
                            </ColData>
                        </RowData>
                        <RowData>
                            <ColData>
                                State:
                            </ColData>
                            <ColData endl={"end"}>
                                Uzbekistan
                            </ColData>
                        </RowData>

                    </BoxInfo>

                </CardMain>
                <CardMain>
                    <BoxInfo>
                        <RowData>
                            <ColData>
                                Lavozmi:
                            </ColData>
                            <ColData endl={"end"}>
                                Staff
                            </ColData>
                        </RowData>
                        <RowData>
                            <ColData>
                                Phone number:
                            </ColData>
                            <ColData endl={"end"}>
                                +998990000000
                            </ColData>
                        </RowData>


                    </BoxInfo>

                </CardMain>
            </Modalbody>
        </>
    );
};
const BoxInfo = styled.div`

`
const ColData = styled.div`
  flex: 1;
  text-align: ${props => props.endl || "start"};

`
const RowData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const PhotoWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ece7e7;`

const CardMain = styled.div`
  background-color: #f1ecec;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
  
`;


const TitleHead = styled.div`
  position: absolute;
  padding: 10px;
  width: 100%;
  top: 0;
  background-color: ${mainColor};
  border-radius: 10px 10px 0 0;
  z-index: -1;
  font-size: 20px;
  color: #ffffff;
`
const Modalbody = styled.div`
  margin-top: 48px;
  padding: 10px;
  width: 100%;
  overflow: scroll;
`

export default StaffUserModal;