import React, {memo, useEffect, useRef, useState} from 'react';
import html2pdf from "html2pdf.js/src";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import {FaRegFilePdf} from "react-icons/fa6";
import axios from "axios";
import {BASE_URL, getHeaders, TOKEN, TokenType} from "../ServiceUrls";
import moment from "moment";
import {toast} from "react-toastify";

const PdfTabel = ({data, departmentId}) => {

    moment.locale('en')
    const pdfContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFileId, setSelectedFileId] = useState(null)
    const {headers} = getHeaders()
    const getTablesData = (kafedraId) => {
        if (kafedraId?.trim() !== '' && data?.length !== 0) {
            axios.get(`${BASE_URL}/table/getTables/${kafedraId}`, {headers})
                .then(res => {
                    setSelectedFileId(res.data.obj.find(t => `${t.month}-${t.year}` === moment(data[0].date).format('MMMM-YYYY'))?.id || null)
                })
                .catch(err => {
                    console.log(err);
                })

        }
    };

    const downloadPDF = async () => {
        try {
            setIsLoading(true);
            moment.locale('en');

            const content = pdfContainerRef.current;
            const options = {
                margin: 5,
                filename: `table-file${new Date().getTime()}.pdf`,
                image: {type: 'jpeg', quality: 1},
                html2canvas: {scale: 2},
                jsPDF: {unit: 'mm', format: 'a4', orientation: 'landscape'},
            };

            const pdfBlob = await html2pdf().set(options).from(content).output('blob');
            const formData = new FormData();
            formData.append('file', new Blob([pdfBlob], {type: 'application/pdf'}), options.filename);

            const token = localStorage.getItem(TOKEN);
            const config = {
                headers: {
                    'Authorization': TokenType + token,
                },
            };

            const endpoint = `${BASE_URL}/table/upload/${moment(data[0]?.date).format('YYYY')}/${moment(data[0]?.date).format('MMMM')}?kafedraId=${departmentId?.departmentId}`;
            await axios.post(endpoint, formData, config);
            await html2pdf().set(options).from(content).save();
            toast.success('Success');
        } catch (error) {
            console.error('Error saving PDF:', error);
            toast.error(`Error saving: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    const upDateDownloadPDF = async () => {
        try {
            setIsLoading(true);
            moment.locale('en');

            const content = pdfContainerRef.current;
            const options = {
                margin: 5,
                filename: `table-file${new Date().getTime()}.pdf`,
                image: {type: 'jpeg', quality: 1},
                html2canvas: {scale: 2},
                jsPDF: {unit: 'mm', format: 'a4', orientation: 'landscape'},
            };

            const pdfBlob = await html2pdf().set(options).from(content).output('blob');
            const formData = new FormData();
            formData.append('file', new Blob([pdfBlob], {type: 'application/pdf'}), options.filename);

            const token = localStorage.getItem(TOKEN);
            const config = {
                headers: {
                    'Authorization': TokenType + token,
                },
            };

            const endpoint = `${BASE_URL}/table/upload/${moment(data[0]?.date).format('YYYY')}/${moment(data[0]?.date).format('MMMM')}?kafedraId=${departmentId?.departmentId}&id=${selectedFileId}`;
            await axios.post(endpoint, formData, config);
            await html2pdf().set(options).from(content).save();
            toast.success('Success');
        } catch (error) {
            console.error('Error saving PDF:', error);
            toast.error(`Error saving: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const workHours = (arr) => {
        const filterArr = arr.filter(item => typeof item?.hourValue === "number" && item?.hourValue !== 0);
        const summHours = filterArr?.reduce((prev, curr) => {
            return {hourValue: (prev?.hourValue || 0) + curr?.hourValue};
        }, {hourValue: 0});

        return summHours?.hourValue || 0;
    };

    function abbreviateMiddleNames(name) {
        const words = name.split(' ').slice(0, 3);
        if (words.length > 1) {
            const sliceWord = words.map((item, index) => {
                if (index > 0) {
                    if (item) {
                        if ((item[0] == 'S' && item[1] == 'H') || (item[0] == 'C' && item[1] == 'H')) {
                            return item[0] + item[1] + "."
                        }
                        return item[0] + ".";
                    }
                } else {
                    return item;
                }
            }).filter(Boolean).join(" ");
            return sliceWord;
        } else {
            return name;
        }
    }

    useEffect(() => {
        getTablesData(departmentId?.departmentId)
    }, [data]);

    console.log(selectedFileId)
    return (
        <>
            {isLoading ? (
                <Button
                    disabled
                    variant={"outlined"}
                    endIcon={<CircularProgress size={18}/>}
                >
                    {selectedFileId ? 'update and download' : 'save and download'}
                </Button>
            ) : (
                <Button
                    variant={'contained'}
                    endIcon={<FaRegFilePdf/>}
                    onClick={selectedFileId ? upDateDownloadPDF : downloadPDF}
                >

                    {selectedFileId ? 'update and download' : 'save and download'}
                </Button>
            )}
            <div style={{display: 'none'}}>
                <Container ref={pdfContainerRef}>
                    <div className={'header'}>
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <div style={{width: 200, textAlign: 'center'}}>
                                <h4>
                                    I confirm: <br/>
                                    Rector <br/>

                                </h4>
                                <br/>
                                <p style={{width: 200, borderBottom: '1px solid #000'}}></p>
                            </div>
                        </div>
                        <h2 style={{textAlign: 'center'}}>KIMYO INTERNATIONAL UNIVERSITY IN TASHKENT</h2>
                        <h3 style={{textAlign: 'center'}}>Department of information technologies</h3>

                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <p>
                                Document number:25 <br/>
                                Date of compilation: {moment(data[0]?.date).format('MMMM YYYY')}
                            </p>
                        </div>

                        <h3 style={{textAlign: 'center'}}>T A B E L</h3>
                        <h4 style={{textAlign: 'center'}}>recording the use of working time</h4>
                    </div>
                    <div className={'main'}>
                        <table>
                            <thead>
                            <tr>
                                <th rowSpan={2}>№</th>
                                <th rowSpan={2}>F.I.O</th>
                                <th rowSpan={2}>Position</th>
                                <th colSpan={data[0]?.monthly?.length}>Attendance and absence notes by day of the
                                    month
                                </th>
                                <th colSpan={2}>Worked for the month</th>
                            </tr>
                            <tr>
                                {data[0]?.monthly?.map((item) => (
                                    <td style={{minWidth: 25}} key={item?.day}>{item?.day}</td>
                                ))}
                                <td>days</td>
                                <td>hours</td>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.slice(0, 14)?.map((person, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td style={{
                                        textAlign: 'start',
                                        width: 140
                                    }}>{abbreviateMiddleNames(person?.fullName?.toUpperCase())}</td>
                                    <td style={{width: 130}}>{person?.userPosition?.label} {person?.rate ? `(${person?.rate})` : ''}</td>
                                    {person?.monthly?.map((item) => (
                                        <td key={item?.day}> {item?.hourValue}</td>
                                    ))}
                                    <td>
                                        {person?.monthly?.filter(item => typeof item?.hourValue === "number" && item?.hourValue !== 0)?.length}
                                    </td>
                                    <td>
                                        {workHours(person?.monthly)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {data.length >= 15 && <> <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/></>}
                        {data?.length > 14 && <table>
                            <thead>
                            <tr>
                                <th rowSpan={2}>№</th>
                                <th rowSpan={2}>F.I.O</th>
                                <th rowSpan={2}>Position</th>
                                <th colSpan={data[0]?.monthly?.length}>Attendance and absence notes by day of the
                                    month
                                </th>
                                <th colSpan={2}>Worked for the month</th>
                            </tr>
                            <tr>
                                {data[0]?.monthly?.map((item) => (
                                    <td style={{minWidth: 25}} key={item?.day}>{item?.day}</td>
                                ))}
                                <td>days</td>
                                <td>hours</td>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.slice(14).map((person, index) => (
                                <tr key={index}>
                                    <td>{index + data?.slice(0, 14).length + 1}</td>
                                    <td style={{
                                        textAlign: 'start',
                                        width: 140
                                    }}>{abbreviateMiddleNames(person?.fullName?.toUpperCase())}</td>
                                    <td style={{width: 130}}>{person?.userPosition?.label} {person?.rate ? `(${person?.rate})` : ''}</td>
                                    {person?.monthly?.map((item) => (
                                        <td key={item?.day}> {item?.hourValue}</td>
                                    ))}
                                    <td>
                                        {person?.monthly?.filter(item => typeof item?.hourValue === "number" && item?.hourValue !== 0)?.length}
                                    </td>
                                    <td>
                                        {workHours(person?.monthly)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>}

                    </div>
                    <div className={'footer'} style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', gap: '5px', marginTop: 15,}}>
                            <p>Meaning of abbreviations: </p>
                            <p>
                                H - Holiday <br/>
                                SL - Sick leave <br/>
                                DO - Day off <br/>
                                V - Vacation <br/>
                            </p>
                        </div>
                        <div style={{
                            width: 700,
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            marginTop: 15,
                            rowGap: 15,
                        }}>
                            <b>Head of the department</b>
                            <p style={{width: 150, borderBottom: '1px solid #000'}}></p>
                            <b>Ш.Т.Сабиров</b>

                            <b>Head of HR Department</b>
                            <p style={{width: 150, borderBottom: '1px solid #000'}}></p>
                            <b>Ф.Ш. Сулайманов</b>
                        </div>


                    </div>

                </Container>
            </div>
        </>
    );
};
const Container = styled.div`
    width: 100%;
    margin: 0 auto;
    font-size: 10px;
    padding: 5px;
    color: black;
    line-height: 1.7;


    table {
        font-size: 10px;
        min-width: 700px;
        border-collapse: collapse;
        width: 100%;
        overflow: hidden;

        table, td, th {
            border: 1px solid #000000;
            padding: 5px;
            font-size: 10px;
            text-align: center;
        }
    }
`;
export default memo(PdfTabel);