import React from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";

const Results = ({data}) => {
    const {studentResults, studentName} = data

    const allGrade = (percentage) => {
        const grade = [
            {
                alph: "A+",
                Min: 95,
                Max: 100,
            },
            {
                alph: "A",
                Min: 90,
                Max: 94,
            },
            {
                alph: "B+",
                Min: 85,
                Max: 89,
            },
            {
                alph: "B",
                Min: 80,
                Max: 84,
            },
            {
                alph: "C+",
                Min: 75,
                Max: 79,
            },
            {
                alph: "C",
                Min: 70,
                Max: 74,
            },
            {
                alph: "D+",
                Min: 65,
                Max: 69,
            },
            {
                alph: "D",
                Min: 60,
                Max: 64,
            },
            {
                alph: "F",
                Min: 0,
                Max: 59,
            },
            {
                alph: "FA",
                Min: 0,
                Max: 0,
            },
        ]

        if (percentage !== 0) {
            return grade.find(item => item.Min <= percentage)
        }
        return grade.find(item => item.Min <= percentage && item.Max <= percentage)

    }

    return (
        <Container>
            <TitleModal>
                {studentName}
            </TitleModal>
            <Bodybox>
                <TableResult>
                    {/*header*/}
                    <TableResultRow fw={"bold"} bg={"#f3efef"}>
                        <TableResultCol >
                            Year
                        </TableResultCol>
                        <TableResultCol >
                            Semester
                        </TableResultCol>
                        <TableResultCol >
                            Subject
                        </TableResultCol>
                        <TableResultCol >
                            Credit
                        </TableResultCol>
                        <TableResultCol >
                            Score
                        </TableResultCol>
                        <TableResultCol >
                            Grade
                        </TableResultCol>
                    </TableResultRow>
                    {/* body */}
                    {studentResults.map((item,key)=>(
                        <TableResultRow key={key} bg={item.allScore<=59 && "red"}>
                            <TableResultCol>
                                {item.year}
                            </TableResultCol>
                            <TableResultCol>
                                {item.semestr}
                            </TableResultCol>
                            <TableResultCol>
                                {item.subject}
                            </TableResultCol>
                            <TableResultCol>
                                {item.credit}
                            </TableResultCol>
                            <TableResultCol>
                                {item.allScore}%
                            </TableResultCol>
                            <TableResultCol>
                                {allGrade(item.allScore).alph}
                            </TableResultCol>
                        </TableResultRow>
                    ))}
                </TableResult>
            </Bodybox>
        </Container>
    );
};
const TableResultCol = styled.div`
  width: 100%;
  padding: 5px;
  border: 1px solid #cebfbf;
  text-align: center;
`;

const TableResultRow = styled.div`
  background: ${props => props.bg || "#FFF"};
  color: ${props => props.bg==="red"? "#FFF":"#000"};
  display: grid;
  font-weight:  ${props => props.fw || "normal"};
  grid-template-columns: 0.5fr 0.3fr 0.9fr 0.3fr 0.3fr 0.3fr;
`
const TableResult = styled.div`

`

const Bodybox = styled.div`
  margin-top: 50px;
  padding: 10px;
  min-height: 300px;
  max-height: 350px;
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

export default Results;