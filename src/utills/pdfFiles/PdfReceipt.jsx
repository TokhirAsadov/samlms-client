import React, {useEffect, useRef, useState} from 'react';
import html2pdf from "html2pdf.js/src";
import IconButton from "@mui/material/IconButton";
import {MdOutlineFileDownload} from "react-icons/md";
import styled from "styled-components";
import moment from "moment/moment";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import {BASE_URL, SEARCH} from "../ServiceUrls";

const styles = {
    page: {
        marginTop: 20,
        padding: 30,
        fontFamily: "Arial",
        fontWeight: 400,
        fontSize: 12,
    },
    box_core: {
        border: "1px solid black",
        padding: 10,
    },
    item_1: {
        display: "flex",
        justifyContent: 'space-around',
    },
    item_2: {
        display: "flex",
        marginTop: 8,
        justifyContent: 'space-between',
    },
    date_download: {
        marginTop: 8,
    },
    fio_text: {
        textAlign: "center",
        borderBottom: "1px solid black",
    },
    item_3: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
    },
    item_4: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 8,
        alignItems: 'center',
    },
    item_5: {
        border: '1px solid black',
        padding: 5,
        width: 290,
        textAlign: 'center',
    },
    item_6: {
        display: 'flex',
        width: 288,
        justifyContent: 'space-around',
    },
    item_7: {
        border: '1px solid black',
        padding: 5,
        width: 290,
    }
}
const PdfReceipt = ({studentId,subject}) => {
    const pdfContainerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(null)

    const downloadPDF = async () => {
        setLoading(true);

        const content = pdfContainerRef.current;
        const options = {
            margin: 10,
            filename: `receipt-file${new Date().getTime()}.pdf`,
            image: {type: 'jpeg', quality: 1},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
        }
        await html2pdf().set(options).from(content).save()

        setLoading(false)

    };
    const handleClick=async ()=>{
        await axios.get(BASE_URL + SEARCH + studentId)
            .then((res) => {
                setFullName(res.data.obj[0]?.fullName);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        fullName !==null &&  downloadPDF()
    }, [fullName]);
    return (
        <>
            {loading ? (
                <div>
                    <CircularProgress size={20}/>
                </div>
            ):(
                <IconButton onClick={handleClick}>
                    <MdOutlineFileDownload/>
                </IconButton>
            )}

            <div style={{display: 'none'}}>
                <Container ref={pdfContainerRef}>

                    <div style={styles.page}>
                        <div style={styles.box_core}>
                            <div style={styles.item_1}>
                                <p>Нақд пулларни топшириш эълони</p>
                                <p>Сумма 100 000</p>
                            </div>
                            <p style={styles.date_download}>{moment().format('DD.MM.YYYY')}</p>
                            <div style={styles.item_2}>
                                <p>Нақд пул топширувчи:</p>
                                <p style={styles.fio_text}>&nbsp;&nbsp; {fullName}
                                    O'G'LI &nbsp;&nbsp;</p>
                            </div>
                            <div style={styles.item_2}>
                                <p>Қабул қилувчи банк номи</p>
                                <div style={styles.item_3}>
                                    <b>АИТБ “Ипак Йўли банки” Яккасарой ф-ли</b>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <p>Дебет</p>
                                        <p>10101000600001028001</p>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.item_2}>
                                <p>Банк коди</p>
                                <div style={styles.item_3}>
                                    <div style={{
                                        width: 170,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <p>01028</p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <p>Кредит</p>
                                        <p>20208000800900963001</p>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.item_4}>
                                <p>Пул кирим қилинадиган хўжалик субъекти <br/>
                                    номи ва х.к</p>
                                <div style={styles.item_5}>
                                    <b>QK MCHJ TOSHKENT SHAHRIDAGI YEODJU TEXNIKA INSTITUТI </b>
                                </div>
                            </div>
                            <div style={styles.item_4}>
                                <p>Банк коди</p>
                                <div style={styles.item_5}>
                                    <p>01028</p>
                                </div>
                            </div>
                            <div style={styles.item_4}>
                                <p>Сумма сўз билан</p>
                                <div style={styles.item_5}>
                                    <p>Юз минг сумм 00 тийин</p>
                                </div>
                            </div>
                            <div style={styles.item_4}>
                                <p>Тўлов мақсади</p>
                                <div style={styles.item_7}>
                                    <p>Имтиҳонни қайта топшириш: Шартнома рақами № 11560 2022-03-07,</p>
                                    <b> Фан номи: {subject}</b>
                                </div>
                            </div>
                            <div style={styles.item_4}>
                                <div style={{display: 'flex'}}>
                                    <p>Нақд пул топширувчи имзоси:</p>
                                    <div style={{width: '80px', borderBottom: '1px solid black'}}></div>
                                </div>
                                <div style={styles.item_6}>
                                    <div style={{display: 'flex'}}>
                                        <p>Бухгалтер:</p>
                                        <div style={{width: '80px', borderBottom: '1px solid black'}}></div>
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        <p>Кассир:</p>
                                        <div style={{width: '80px', borderBottom: '1px solid black'}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </Container>
            </div>
        </>
    );
};
const Container = styled.div`
  width: 700px;
  margin: 0 auto;
  font-size: 13px;
  padding: 10px;
  color: black;

  .fw {
    font-weight: bold;
  }
`
export default PdfReceipt;