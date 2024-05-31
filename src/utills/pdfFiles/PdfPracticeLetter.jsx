import React, {useRef, useState} from 'react';
import html2pdf from "html2pdf.js/src";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import {MdOutlineFileDownload} from "react-icons/md";
import styled from "styled-components";
import Logo from '../images/logo.png'
import QRCode from 'qrcode.react';
import moment from "moment";
import Button from "@mui/material/Button";

const PdfPracticeLetter = ({letterData, studentData}) => {

    const data = {
        queue: letterData?.studentQueue,
        created: letterData?.createdAt,
        fullName: studentData?.fullName,
        directory: studentData?.groupData?.facultyName,
        level: studentData?.groupData?.level,
        group: studentData?.groupData?.name,
        eduDate: letterData?.educationYear,
        firstData: moment(letterData?.fromDate).format('DD.MM.YYYY'),
        secondData: moment(letterData?.toDate).format('DD.MM.YYYY'),
    }
    const pdfContainerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const valueQRcode = window.location.origin + '/file/services/amaliyot/' + studentData?.id;

    const formatQueue = (num) => (num?.toString().padStart(6, '0'))

    const downloadPDF = async () => {
        setLoading(true);

        const content = pdfContainerRef.current;
        const options = {
            margin: 10,
            filename: `practice-letter-file${new Date().getTime()}.pdf`,
            image: {type: 'jpeg', quality: 1},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
        }
        await html2pdf().set(options).from(content).save()

        setLoading(false)

    };

    return (
        <>
            {loading ? (
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

                    <div style={{marginTop: '20px'}}>
                        <p>№ {formatQueue(data?.queue)} <span
                            style={{marginLeft: 30}}>{moment(data.created).format('DD.MM.YYYY')}</span></p>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'end',margin:'30px 0',}}>
                        <div style={{width: 300}}>
                            <b>O'zbekiston Respublikasi Mudofaa vazirligi harbiy loyiha va loyihalashtirish
                                instituti</b>
                        </div>
                    </div>

                    <p className={'text_notice'}>
                        O’zbekiston Respublikasi “Ta’lim to’g’risida”gi Qonunning 35-moddasi hamda O’zbekiston
                        Respublikasi Prezidentining 2017 yil 27 iyuldagi “Oliy ma’lumotli mutaxassislar tayyorlash
                        sifatini oshirishda iqtisodiyot sohalari va tarmoqlarining ishtirokini yanada kengaytirish
                        chora-tadbirlari to’g’risida”gi PQ-3151-sonli Qaroriga muvofiq kasb faoliyati ko’nikmalarini
                        egallash maqsadida universitetning quyida ism-sharifi keltirilgan bitiruvchi kurs talabasi
                        bitiruvoldi malakaviy amaliyotini o’tash uchun Sizning ixtiyoringizga yuborilmoqda.
                    </p>
                    <div className="edu_box" style={{marginTop:30}}>
                        <p style={{width: 200}}>Talabaning F.I.O:</p>
                        <p>Talabaning F.I.O:</p>
                    </div>
                    <div className="edu_box">
                        <p style={{width: 200}}>Bakalavriat ta’lim yo’nalishi:</p>
                        <p>Bakalavriat ta’lim yo’nalishi:</p>
                    </div>
                    <div className="edu_box">
                        <p style={{width: 200}}>Amaliyot muddati: </p>
                        <p>Amaliyot muddati: </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '60px'
                    }}>
                        <div>
                            <p>Hurmat bilan, <br/>
                                <b> Rektor v.b.
                                    K. Axmedjanov
                                </b>
                            </p>

                        </div>
                        <QRCode value={valueQRcode} size={120}/>
                    </div>
                    <div style={{marginTop:150}}>
                        <p>
                            Ijrochi: Z.Bobojonov <br/>
                            Telefon: 78 129 40 40 (ichki 303)
                        </p>
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

    .fw {
        font-weight: bold;
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

    .date_box {
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .item_1 {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .text_notice {
        text-align: justify;
        text-indent: 30px;
        font-size: 15px;

    }

    .edu_box {
        padding: 0 30px;
        display: flex;
        gap: 100px;
        align-items: center;
    }

`
export default PdfPracticeLetter;