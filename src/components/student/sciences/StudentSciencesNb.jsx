import React, {memo} from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";


const StudentSciencesNb = ({data}) => {

    const sortedNbData = data && data?.nbData?.slice()?.sort((a, b) => {
        let dateA = new Date(a.date.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
        let dateB = new Date(b.date.replace(/(\d{2}).(\d{2}).(\d{4})/, '$3-$2-$1'));
        let dateComparison =dateB-dateA ;
        if (!dateComparison) {
            return  b?.section-a?.section ;
        }
        return dateComparison;
    });

    return (
        <>
            <TitleModal>
                {data?.lessonName}
            </TitleModal>
            <Bodybox>
                {data?.nbData.length > 0 ? sortedNbData?.map((childItem, childKey) => (
                            <BodyItem bg={"red"} jsc={"space-between"} key={childKey}>
                                <p>
                                    {childItem?.date}
                                </p>

                                <p>
                                    {childItem.section} - section
                                </p>
                            </BodyItem>
                        )
                ) : <BodyItem jsc={"center"} bg={"#45d745"}>
                    Dars qoldirilmagan
                </BodyItem>}

            </Bodybox>
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

export default memo(StudentSciencesNb);
