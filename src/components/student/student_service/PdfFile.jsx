import React, {useRef, useState} from 'react';
import Logo from '../../../utills/images/logo.png';
import moment from "moment";
import html2pdf from "html2pdf.js/src";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import {MdOutlineFileDownload} from "react-icons/md";
import QRCode from "qrcode.react";
import styled from "styled-components";


const PdfFile = ({contentPdf}) => {
    const [isLoading, setIsLoading] = useState(false)
    const pdfContainerRef = useRef(null);
    const valueQRcode = window.location.origin + '/file/services/reference/' + contentPdf?.id;

    const downloadPDF = async () => {
        setIsLoading(true);
        const content = pdfContainerRef.current;
        const options = {
            margin: 10,
            filename: `certificateOfStudentStatus${new Date().getTime()}.pdf`,
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
                    download
                </Button>
            )}
        <div style={{display: 'none'}}>
            <Container ref={pdfContainerRef}>
                <div className={'header'}>
                    <div>
                        <img width={140} src={Logo} alt="logo"/>
                    </div>
                    <div>
                        <b className={'head_title'}>TOSHKENT KIMYO XALQARO UNIVERSITETI <br/>
                            KIMYO INTERNATIONAL UNIVERSITY IN TASHKENT</b>
                        <br/> <br/>
                        <i style={{fontSize: '14px'}}>100121, Toshkent shahri, Yakkasaroy tumani, Usmon Nosir
                            ko`chasi, 156 uy.
                            Tel.: +998781294040. Veb-sayt: www.kiut.uz. Elektron pochta: info@kiut.uz</i>
                    </div>
                </div>
                <div className={'date'}>
                    <p>№:{contentPdf?.id}</p>
                    <p>{moment(contentPdf?.time).format("DD.MM.YYYY")}</p>
                </div>
                <div className={'app_number'}>
                    <p>Application number: {contentPdf?.numeration}</p>
                </div>
                <p className={'core_title'}>
                    CERTIFICATE OF STUDENT STATUS
                </p>

                <div className={'item'}>
                    <p className={'info'}>Full Name:</p>
                    <p className={'info2'}>{contentPdf?.fullName}</p>
                </div>

                <div className={'item'}>
                    <p className={'info'}>Passport Number:</p>
                    <p className={'info2'}>{contentPdf?.passport}</p>
                </div>

                <div className={'item'}>
                    <p className={'info'}>Major:</p>
                    <p className={'info2'}>{contentPdf?.direction}</p>
                </div>
                <div className={'item'}>
                    <p className={'info'}>Grade:</p>
                    <p className={'info2'}>{contentPdf?.grade}</p>
                </div>
                <div className={'item'}>
                    <p className={'info'}>Language of Instruction:</p>
                    <p className={'info2'}>{contentPdf?.eduLang}</p>
                </div>
                <div className={'item'}>
                    <p className={'info'}>Mode of Study:</p>
                    <p className={'info2'}>{contentPdf?.eduType}</p>
                </div>
                <div className={'item'}>
                    <p className={'info'}>Length of Study:</p>
                    <p className={'info2'}>{contentPdf?.lengthOfStudying}</p>
                </div>
                <div className={'item'}>
                    <p className={'info'}>Remark: Rector’s order:</p>
                    <p className={'info2'}>{contentPdf?.rektororder}</p>
                </div>
                <p className={'info_text'}>
                    Additional information: Kimyo international University in Tashkent provides educational
                    services in the field of higher education based on state license No044527 dated on
                    21.10.2022 issued by the State Inspectorate for Supervision of Quality in Education under
                    the Cabinet of Ministers of the Republic of Uzbekistan and the Decree of the Cabinet
                    Ministers of the Republic of Uzbekistan No.1007 dated on 17.12.2019.
                </p>
                <p className={'given_text'}>
                    This Certificate of student status is given to:
                </p>
                <div className={'flex_footer'}>
                    <div className={'footer'}>
                        <p>
                            Course leader:  {contentPdf?.dean}
                        </p>
                    </div>
                    <div className={'qr_code_box'}>
                        <QRCode value={valueQRcode} size={120}/>
                    </div>
                </div>

            </Container>
        </div>
        </>
    );
};

const Container = styled.div`
    width: 640px;
    margin: 0 auto;
    font-size: 15px;
    padding: 10px;
    color: black;
    line-height: 1.5;

    p{
        margin: 0;
        padding:0;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid black;
    }

    .head_title {
        font-size: 18px;
    }

    .date {
        padding: 0 25px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .date_text {
        font-size: 12px;
    }


    .app_number {
        padding: 0 25px;
        margin: 0;
        display: flex;
        justify-content: flex-start;
    }

    .core_title {
        text-align: center;
        margin-top: 20px;
        font-weight: 500;
    }

    .item {
        margin-top: 15px;
        padding-left: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .info {
        width: 40%;
    }

    .info2 {
        width: 60%;
    }

    .info_text {
        margin-top: 15px;
        padding: 0 20px;
        line-height: 1.5;
        text-align: justify;
    }

    .given_text {
        padding-bottom: 20px;
        margin-top: 20px;
        margin-bottom: 10px;
        border-bottom: 1px solid #000;
    }

    .footer {
        margin-top: 25px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .flex_footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    

    .qr_code_box {
        margin-top: 25px;
    }

`;

export default PdfFile;
