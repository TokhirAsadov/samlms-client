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

const PdfNotice = ({noticeData, studentData}) => {

    const data = {
        dynamicSection: noticeData?.dynamicSection,
        queue: noticeData?.studentQueue,
        created: noticeData?.createdAt,
        fullName: studentData?.fullName,
        directory: studentData?.groupData?.facultyName,
        level: studentData?.groupData?.level,
        group: studentData?.groupData?.name,
        eduDate: noticeData?.educationYear,
        firstData: moment(noticeData?.fromDate).format('DD.MM.YYYY'),
        secondData: moment(noticeData?.toDate).format('DD.MM.YYYY'),
    }
    const pdfContainerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const valueQRcode = window.location.origin + '/file/services/notice/' + studentData?.id;

    const formatQueue = (num) => (num?.toString().padStart(6, '0'))

    const downloadPDF = async () => {
        setLoading(true);

        const content = pdfContainerRef.current;
        const options = {
            margin: 10,
            filename: `notice-file${new Date().getTime()}.pdf`,
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
                    <div style={{display: 'flex', justifyContent: 'end'}}>
                        <div>
                            <div style={{margin: '30px 0 25px', width: '250px', borderBottom: '1px solid black'}}></div>
                            <div style={{marginBottom: '15px', width: '250px', borderBottom: '1px solid black'}}></div>
                            <h6 style={{textAlign: 'end', fontSize: '16px'}}>Rahbariga</h6>
                        </div>
                    </div>

                    <p style={{textAlign: 'center', fontSize: '16px', marginTop: '30px', marginBottom: '30px'}}>
                        <b>XABARNOMA</b></p>
                    <p className={'text_notice'}>
                        Toshkent Kimyo xalqaro universiteti Sizdan,
                        O’zbekiston Respublikasi Vazirlar Mahkamasining 2017 yil 21 noyabrdagi
                        930-sonli qarori bilan tasdiqlangan “Oliy ta’lim muassasasida sirtqi
                        (maxsus sirtqi) ta’limini tashkil etish tartibi to’g’risida”gi Nizomga asosan
                        sirtqi ta’lim shaklining {data?.directory} yo’nalishi, {data?.level}-kurs, {data?.group} guruhi
                        talabasi <b>{data?.fullName}</b>ga {data?.eduDate?.substring(0, data?.eduDate?.indexOf('o'))} o‘quv
                        yilinig {data?.eduDate?.substring(data?.eduDate?.indexOf('li') + 2, data?.eduDate?.indexOf('s') - 1)}-semestridagi
                        o‘quv {data?.dynamicSection || 'dynamic section'} ishtirok etishi
                        uchun <span style={{borderBottom: '1px solid black'}}>{data?.firstData}</span> dan <span
                        style={{borderBottom: '1px solid black'}}>{data?.secondData}</span> gacha ish joyi va o’rtacha
                        oylik maoshi saqlangan holda qo’shimcha ta’til berishingizni so’raydi.
                    </p>
                    <br/>
                    <div className="edu_box">
                        {/* <p>
                            <b> Сиртқи таълим <br/>
                                йўналишлари раҳбари
                            </b>
                        </p>
                        <p>
                            <b>У.Восиқов</b>
                        </p>*/}
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '30px'
                    }}>
                        <p>
                            {/*<b>Ижрочи:</b> Э.Набиев <br/>
                           <b>Тел.:</b> +998781294040 (163, 164)*/}
                        </p>
                        <QRCode value={valueQRcode} size={120}/>
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
        justify-content: space-between;
    }

`
export default PdfNotice;