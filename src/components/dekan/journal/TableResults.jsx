import React from 'react';
import styled from 'styled-components';
import {mainColor} from "../../../utills/ServiceUrls";
import Button from "@mui/material/Button";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import * as XLSX from 'xlsx';
import Box from "@mui/material/Box";
import Spinner from "../../spinner/Spinner";


const TableResults = ({data, loading}) => {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.table_to_sheet(document.querySelector('table'));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'table_data.xlsx');
    };


    return (
        <>
            {data?.length > 0 && <Box display={'flex'} justifyContent={'end'} mb={3}>
                <Button variant={"contained"} onClick={exportToExcel}>Export to Excel</Button>
            </Box>}
            <Bodybox>
                {loading ? <Spinner/> : (data.length > 0 ? (
                    <>
                        <table>
                            <tr>
                                <th rowSpan={2}>№</th>
                                <th rowSpan={2}>Full name</th>
                                {data[0]?.subjects?.map((subject, index) => (
                                    <th colSpan={2} key={index}>{subject?.subjectName}</th>
                                ))}
                            </tr>
                            <tr>
                                {Array.from({length: data[0]?.subjects.length * 2}).map((_, index) => (
                                    <th key={index}>{index % 2 === 0 ? "JN" : "YN"}</th>
                                ))}
                            </tr>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.fullName} </td>
                                    {item?.subjects?.map((subject, subIndex) => (
                                        <React.Fragment key={subIndex}>
                                            <td>
                                                {parseFloat(((subject?.allSumGrade || 0) + (subject?.allGradesForAttendance || 0)).toFixed(2)) || "-"}
                                            </td>
                                            <td>
                                                {subject?.endGrade !== null ? subject?.endGrade : "-"}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </table>
                    </>
                ) : (
                    <EmptyDataImg w={200} h={180}/>
                ))}

            </Bodybox>
        </>

    );
};

const Bodybox = styled.div`
    margin-top: 25px;
    width: 100%;
    overflow-x: scroll;

    table {
        min-width: 1500px;
        border-collapse: collapse;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
        }

        tr {
            &:nth-child(even) {
                background-color: #f2f2f2;
            }
        }

        th {
            background-color: ${mainColor};
            color: white;
        }
    }

`;

export default TableResults;
