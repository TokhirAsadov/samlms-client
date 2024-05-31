import React, {memo, useRef, useState} from 'react';
import Logo from "../images/logo.png";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {MdOutlineFileDownload} from "react-icons/md";
import html2pdf from "html2pdf.js/src";

const PdfStatement = ({educationYear, teacherData, dataOfLeaders, content, groupName, subjectName}) => {
    const pdfContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false)
    const yearMatch = educationYear?.name?.match(/\d{4}-\d{4}/);
    const year = yearMatch ? yearMatch[0].replace('-', '/') : null;
    const semesterMatch = educationYear?.name?.match(/\d+-sem/);
    const semester = semesterMatch ? semesterMatch[0].split('-')[0] : null;
    const directionMatch = dataOfLeaders?.direction.replace(/^\(.*?\)\s*/, '');
    const directionName = directionMatch ? directionMatch : null;

    function calculateValue(item) {
        if (item) {
            const calculatedValue = Math.ceil((item.allSumGrade || 0) + (item.allGradesForAttendance || 0));
            return parseFloat(calculatedValue);
        } else {
            return 0;
        }
    }

    const downloadPDF = async () => {
        setIsLoading(true);
        const content = pdfContainerRef.current;
        const options = {
            margin: 10,
            filename: `statement-file${new Date().getTime()}.pdf`,
            image: {type: 'jpeg', quality: 1},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
        }
        await html2pdf().set(options).from(content).save()

        setIsLoading(false)

    };
    return (
        <>
            {isLoading ? (
                <Button size={'small'} variant={"outlined"} endIcon={<CircularProgress size={18}/>}>
                    download
                </Button>
            ) : (
                <Button size={'small'} variant={"contained"} endIcon={<MdOutlineFileDownload size={22}/>}
                        onClick={downloadPDF}>
                    statement pdf
                </Button>
            )}
            <div style={{display: 'none'}}>
                <Container ref={pdfContainerRef}>
                    <div className={'header'}>
                        <div>
                            <img width={130} src={Logo} alt="logo"/>
                        </div>
                        <div>
                            <b className={'head_title'}>TOSHKENT KIMYO XALQARO UNIVERSITETI <br/>
                                KIMYO INTERNATIONAL UNIVERSITY IN TASHKENT</b>
                        </div>
                    </div>
                    <div style={{textAlign: 'center', margin: '10px 0'}}>
                        <b> {"<<"}{directionName}{">>"} <br/>
                            {year} ACADEMIC YEAR <br/>

                        </b>
                        <b> STATEMENT OF RATING № <span style={{
                            width: 80,
                            borderBottom: '1px solid #000'
                        }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></b>
                    </div>

                    <div style={{margin: '10px 0'}}>
                        <p>Discipline: <b>{subjectName}</b></p>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
                        <p>Course: <b>{dataOfLeaders?.course}</b></p>
                        <p>Semester:<b>{semester}</b></p>
                        <p>Group: <b>{groupName}</b></p>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', margin: '10px 0'}}>
                        <p>Number of credits: <b>2</b></p>
                        <p>Hours: <b></b></p>
                    </div>
                    <table>
                        <tbody>
                        <tr>
                            <th>№</th>
                            <th>STUDENTS NAMES</th>
                            <th>ID number</th>
                            <th>CC</th>
                        </tr>
                        {content?.slice(0, 18).map((item, key) => (
                            <tr key={key}>
                                <td style={{textAlign: 'center'}}>
                                    <p>{key + 1}</p>
                                </td>
                                <td>
                                    <p>{item?.fullName} </p>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <p>{item?.userId}</p>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <p>{calculateValue(item)}</p>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <br/>
                    <table>
                        <tbody>
                        {content?.slice(18).map((item, key) => (
                            <tr key={key}>
                                <td style={{textAlign: 'center'}}>
                                    <p>{key + content?.slice(0, 18)?.length + 1}</p>
                                </td>
                                <td>
                                    <p>{item?.fullName} </p>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <p>{item?.userId}</p>
                                </td>
                                <td style={{textAlign: 'center'}}>
                                    <p>{calculateValue(item)}</p>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <p>CC-Current Control</p>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 20}}>
                        <b>Teacher:</b>
                        <p style={{width: 80, borderBottom: '1px solid #000'}}></p>
                        <b>{teacherData.fullName}</b>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 20}}>
                        <b>Head of Department:</b>
                        <p style={{width: 80, borderBottom: '1px solid #000'}}></p>
                        <b>{dataOfLeaders?.headOfDepartment}</b>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 20}}>
                        <b>Course Leader:</b>
                        <p style={{width: 80, borderBottom: '1px solid #000'}}></p>
                        <b>{dataOfLeaders?.courseLeader}</b>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginTop: 20}}>
                        <b>Head of Academic Affairs &#x20;&#x20;&#x20;&#x20; Department:</b>
                        <p style={{width: 80, borderBottom: '1px solid #000'}}></p>
                        <b>{dataOfLeaders?.headOfAcademicAffair}</b>
                    </div>
                </Container>
            </div>
        </>
    );
};
const Container = styled.div`
    width: 700px;
    margin: 0 auto;
    font-size: 14px;
    padding: 10px;
    color: black;
    line-height: 1.7;

    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid black;
    }

    .head_title {
        font-size: 18px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    table, td, th {
        border: 1px solid;
        padding: 6px;
    }

    th {
        text-align: center;
    }
`
export default memo(PdfStatement);
