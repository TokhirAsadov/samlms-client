import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import html2pdf from "html2pdf.js/src";
import IconButton from "@mui/material/IconButton";
import {MdOutlineFileDownload} from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import {BASE_URL, SEARCH} from "../../../../utills/ServiceUrls";
import moment from "moment/moment";

const PdfContr = ({subject,idCard,penalty}) => {
    const pdfContainerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState(null)
    const [passportNum, setPassportNum] = useState(null)

    const downloadPDF = async () => {
        setLoading(true);

        const content = pdfContainerRef.current;
        const options = {
            margin: 10,
            filename: `contract-file${new Date().getTime()}.pdf`,
            image: {type: 'jpeg', quality: 1},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
        }
        await html2pdf().set(options).from(content).save()

        setLoading(false)

    };
    const handleClick=async ()=>{
        await axios.get(BASE_URL + SEARCH + idCard)
            .then((res) => {
                setFullName(res.data.obj[0]?.fullName);
                setPassportNum(res.data.obj[0]?.passport);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        fullName !==null && passportNum !==null &&  downloadPDF()
    }, [fullName]);

    return (
        <>
            {loading ? (
                <div>
                    <CircularProgress size={20}/>
                </div>
            ) : (
                <IconButton onClick={handleClick}>
                    <MdOutlineFileDownload/>
                </IconButton>
            )}
            <div style={{display: 'none'}}>
                <Container ref={pdfContainerRef}>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}> АКАДЕМҚАРЗДОРЛИК (ФАНЛАР ФАРҚИ)НИ ҚАЙТА
                        ТОПШИРИШ
                        БЎЙИЧА ШАРТНОМА №<span
                            style={{borderBottom: '1px solid black'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </p>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                        <p>{moment().format('DD.MM.YYYY')}</p>
                        <p>Тошкент шаҳри</p>
                    </div>
                    <p style={{textIndent: '30px', textAlign: 'justify'}}>
                        "ТОШКЕНТ КИМЁ ХАЛҚАРО УНИВЕРСИТЕТИ" масъулияти чекланган жамият (кейинги ўринларда матнда
                        "Университет"
                        деб юритилади) номидан Устав асосида иш юритувчи ректор КУДАЙБЕРГЕНОВ ЖАНПОЛАТ
                        ШАМУРАТОВИЧ бир томондан ва талабалик гувоҳномаси (ID) рақами <span
                        className={'fw'}>{idCard}</span> бўлган <span className={'fw'}>{fullName}</span>
                        ни (талабанинг фамилияси, исми ва отасининг исми)
                        (Талаба ва Тўловчи бир шахс ҳисобланади ҳамда кейинги ўринларда матнда "Талаба/Тўловчи" деб
                        юритилади)
                        иккинчи томондан ҳамда Ўқув-услубий бошқарма бошлиғи лавозими асосида иш юритувчи АЛЛАБЕРГАНОВ
                        РОМАН
                        КУРАМБАЕВИЧ иштирокида (биргаликда – “Тарафлар” деб аталишади) мазкур шартномани туздилар
                    </p>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>1.Шартнома предмети</p>
                    <p>
                        1.1. Қуйидаги академқарздорлик (фанлар фарқи)ни қайта топширилишини ташкил этиш:<span
                        className={'fw'}>{penalty}</span><br/>
                        а) Фан номи (аниқ ва тўлиқ, инглиз тилида ёзилиши шарт):<span className={'fw'}>{subject}</span>
                        <br/>
                        б) Фан ўқитилган академгуруҳнинг ўқув тили (тегишлиси белгиланади): ○ ЎЗБЕК ○ РУС ○ ИНГЛИЗ <br/>
                        в) Қуйидагилардан тегишлиси имзо билан тасдиқланади:
                    </p>
                    <div style={{paddingLeft: '27px'}}>
                        <p style={{borderTop: '1px solid black', borderBottom: '1px solid black', paddingLeft: '3px'}}>
                            <span className={'fw'}>I ҲОЛАТ:</span>Академқарздорлик 2022-2023 ўқув йилигача юзага
                            келган <br/>
                            (“биринчи имконият” – бепул, “кейинги имконият” – пуллик асосида)
                            &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={'fw'}>Имзо:</span>
                        </p>
                        <p style={{borderBottom: '1px solid black', paddingLeft: '3px'}}>
                            <span className={'fw'}> II ҲОЛАТ:</span> Академқарздорлик ўқишни кўчириш (тиклаш) натижасида
                            фанлар <br/>
                            фарқи (T) сифатида аниқланган (“биринчи имконият” – бепул, “кейинги имконият” <br/>
                            – пуллик асосида; Университет ички тартиб қоидаларнинг 19.4. ва 19.5-бандлари) <span
                            className={'fw'}>Имзо:</span>
                        </p>
                        <p style={{borderBottom: '1px solid black', paddingLeft: '3px'}}>
                            <span className={'fw'}>III ҲОЛАТ:</span> Академқарздорлик жорий ва якуний назорат натижалари
                            йиғиндиси <br/>
                            натижасида (F) юзага келган (“биринчи имконият” – бепул, “кейинги имконият” – <br/>
                            пуллик асосида; Университет ички тартиб қоидаларнинг 19.3. ва 19.5-бандлари)
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={'fw'}>Имзо:</span>
                        </p>
                        <p style={{borderBottom: '1px solid black', paddingLeft: '3px'}}>
                            <span className={'fw'}>IV ҲОЛАТ:</span> Академқарздорлик якуний имтиҳонга узрсиз сабабларга
                            кўра
                            иштирок <br/>
                            этмаганлиги натижасида (FA) юзага келган <br/>
                            (пуллик асосида, Университет ички тартиб қоидаларнинг 19.5.-банди)
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={'fw'}>Имзо:</span>
                        </p>
                        <p style={{borderBottom: '1px solid black', paddingLeft: '3px'}}>
                            <span className={'fw'}>V ҲОЛАТ:</span> Академқарздорлик имтиҳондан тегишли далолатнома
                            асосида <br/>
                            четлаштирилганлиги натижасида (Cancel) юзага келган <br/>
                            (пуллик асосида, Университет ички тартиб қоидаларнинг 19.5.-банди)
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <span className={'fw'}>Имзо:</span>
                        </p>
                    </div>
                    <p style={{marginTop: '10px'}}>
                        1.2. Университет мазкур шартнома тузилган даврда мазкур фан бўйича имтиҳонни қайта топширилишини
                        ташкил
                        этиш мажбуриятини ўз зиммасига олади.
                        <br/> 1.3. Талаба/Тўловчи Университет томонидан белгиланган тарифлар бўйича тақдим этиладиган
                        хизматларни тўлаш мажбуриятини ўз зиммасига олади. Бунда тўлов миқдори имтиҳонни ташкил этишга
                        кетадиган
                        харажатлардан келиб чиққан ҳолда белгиланади.

                    </p>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>2.Тарафларнинг ҳуқуқ ва мажбуриятлари:</p>
                    2.1. Университет мажбуриятлари:
                    <br/> 2.1.1. Имтиҳонларни қайта топшириш учун Университет Устави ва Университет ички тартиб
                    қоидаларида
                    назарда тутилган зарур шарт-шароитларни яратиш.
                    <br/> 2.1.2. Талабаларга қонун билан берилган ҳуқуқларининг эркин амалга оширилишини ва Университет
                    Уставига
                    мувофиқ мажбуриятларнинг бажарилишини таъминлаш.
                    <br/> 2.1.3.Тўлов миқдори Университет томонидан ўзгартирилганда Талабага/Тўловчига ўз вақтида хабар
                    бериш.
                    <br/> 2.2. Университет ҳуқуқлари:
                    <br/> 2.2.1. Талаба/Тўловчи томонидан ўз мажбуриятларини бажарилиши устидан доимий мониторинг олиб
                    бориш.
                    <br/> 2.2.2. Мазкур Шартнома бўйича тўлов кечиктирилган тақдирда, Талаба/Тўловчи томонидан
                    Университет
                    ички-тартиб қоидалари бузилган тақдирда талабага интизомий чора қўллаш, талабанинг қайта топшириш
                    имтиҳонига
                    кириши ёки Университет ресурсларидан фойдаланиш ҳуқуқини чеклаш, зарур ҳолларда имтиҳондан
                    четлашлаштириш
                    бўйича қарорни қабул қилиш.
                    <br/> 2.3. Талаба/Тўловчи мажбуриятлари
                    <br/> 2.3.1. Талаба/Тўловни амалга оширишда тўловнинг мақсадига қуйидагилар аниқ кўрсатилиши лозим:
                    талабанинг фамилияси исми ва отасининг исми ҳамда шартноманинг рақами ва тузилган санаси.
                    <br/> 2.3.2. Талаба/Тўловчи мазкур Шартнома бўйича шартнома мажбуриятларини бажариш имкониятига эга
                    бўлмаган
                    тақдирда, Университетни ёзма равишда хабардор қилиши лозим. Ёзма хабарнома
                    берилмаган <br/><br/> тақдирда,
                    Университет
                    ушбу Шартномани бир томонлама бекор қилиш ҳуқуқига эга бўлади. Талаба/Тўловчи ушбу ҳолатда
                    Университетга
                    даъвоси йўқлигига мутлақо рози бўлади.
                    <br/> 2.3.3. Университетда амалда бўлган ички тартиб қоидаларига, ўқув интизомига ҳамда умумэътироф
                    этилган
                    хулқ-атвор қоидаларига қатьий риоя қилиш.
                    Ички тартиб қоидалари билан танишдим: <br/>
                    <b> Ф.И.О:{fullName}&nbsp;&nbsp;&nbsp;&nbsp;Имзо:<span
                        style={{borderBottom: '1px solid black'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></b>
                    <br/> 2.3.4. Қайта топшириш имтиҳонига белгиланган вақтда келиш. Қайта топшириш имтиҳони
                    бошланганидан
                    сўнг
                    келган, яъни кечиккан талаба имтиҳонга киритилмайди ҳамда ушбу талаба тегишли фан бўйича
                    “қониқарсиз”
                    баҳо
                    олган ҳисобланади.
                    <br/> 2.3.5. Қайта топшириш имтиҳони бошланишидан олдин талабалик гувоҳномаси (ID карта), паспорт
                    ёки
                    унинг
                    ўрнини босувчи ҳужжатнинг аслини аудитория назоратчисига кўрсатиш. Талабалик гувоҳномаси (ID карта)
                    ёки
                    шахсни тасдиқловчи ҳужжатини тақдим этмаган талаба имтиҳонга киритилмайди.
                    <br/> 2.3.6. Шартномани ва/ёки қўшимча шартномаларни имзолаб, бир асл нусхасини Университетнинг
                    Регистратор
                    бўлимига белгиланган муддатларда қайта топшириш имтиҳони бошлангунга қадар тақдим этиш.
                    <br/> 2.3.7. Тўлов амалга оширилгандан сўнг, тўловни тасдиқловчи хужжатни Университетнинг
                    Регистратор
                    бўлимига белгиланган муддатларда қайта топшириш имтиҳони бошлангунга қадар тақдим қилиш.
                    <br/> 2.3.8. Тарафлар томонидан келишилган бошқа шартлар ва кафолатларни бажариш.
                    <br/> 2.3.9. Паспорт маълумотлари, манзил ва алоқа телефонлари ўзгарган вақтидан эътиборан икки кун
                    ичида
                    Университетнинг Регистратор бўлимига хабар бериш.
                    <br/> 2.4. Талаба ҳуқуқлари:
                    <br/> 2.4.1. Талаба қайта топшириш имтиҳони натижалари эълон қилинган кундан бошлаб 3 иш куни ичида
                    апелляция аризасини Университетнинг Регистратор бўлимига топшириши мумкин. Апелляция натижаси ариза
                    топширилган кундан бошлаб 5 иш куни ичида талабага эълон қилинади.
                    <br/> 2.4.2. Фанларни ўзлаштиришда турли ҳил қийинчиликлар юзага келганда, Университет ўқитувчилари
                    ва
                    ходимлари томонидан ўқув-услубий ёрдам олиш.
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>3. Ҳисоб-китоб қилиш тартиби</p>
                    <p>
                        3.1. Университет томонидан белгиланган тариф 100 000 (юз минг) сўмни ташкил этади.
                        <br/> 3.2. Университет хизматларнинг нархи ўзгарилишини ўзида сақлаб қолади. Бундай ҳолатда
                        Тарафларга
                        қўшимча хабар етказилади.
                        <br/> 3.3. Тўлов амалга оширилган кун деб Университет банк ҳисобига тушган кун ҳисобланади.
                        <br/> 3.4. Юқорида кўрсатилган тўлов шартлари бузилган тақдирда, Университет Талабани қайта
                        топшириш
                        имтиҳонига киритмасликка ҳақли.
                    </p>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>4.Шартномани бекор қилиш:</p>
                    <p>
                        4.1. Шартнома қуйидаги ҳолларда бекор қилинган ҳисобланади:
                        <br/> 4.1.1. Тарафларнинг ўзаро розилиги билан.
                        <br/> 4.1.2. Талаба Университет талабалари сафидан четлаштирилганда.
                        <br/> 4.1.3. Тарафлардан бирининг шартнома шартларини бажармаганида.
                        <br/> 4.1.4. Университет ёки тўловчи ташкилот тугатилганида (ушбу ҳолда янги шартнома
                        расмийлаштирилади).
                    </p>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>5.Қўшимча шартлар:</p>
                    <p>
                        5.1. Тарафларнинг жавобгарлиги амалдаги қонунчилик, Университет Устави, ички тартиб қоидалари,
                        Университет раҳбариятининг буйруқлари асосида белгиланади.
                        <br/> 5.2. Тарафларга боғлиқ бўлмаган ҳолатларда (форс-мажор), яъни табиий офатлар, уруш
                        ҳаракатлари, иш
                        ташлаш ва х.к. юз берганда, агар тарафлардан бири шу ҳодиса туфайли шартнома шартларини бажара
                        олмаса,
                        тарафга нисбатан жавобгарлик чоралари кўрилмайди. Форс-мажор ҳодисаси юз бергани ва шу сабабли
                        шартнома
                        шарти бажарилиши имконияти йўқлиги хужжат билан тасдиқланган бўлиши керак. Талабанинг Интернетга
                        уланиш
                        имконияти йўқлиги форс-мажор ҳолати ҳисобланмайди.
                        <br/> 5.3. Ушбу Шартнома тарафлар уни имзолаган кундан бошлаб кучга киради ва тўлиқ ижро
                        этилгунга
                        қадар
                        амалда бўлади.
                        <br/> 5.4. Тарафлар ўртасида пайдо бўладиган низолар тарафларнинг ўзаро келишувларига асосан,
                        бундай
                        келишувга эришилмаган тақдирда Ўзбекистон Республикасининг амалдаги Қонунчилиқ ҳужжатларида
                        белгиланган
                        тартибда ҳал этилади.
                    </p>
                    <br/> <br/> <br/> <br/>
                    <p style={{textAlign: 'center', fontWeight: 'bold'}}>Тарафларнинг юридик манзиллари:</p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px'
                        }}
                    >
                        <div>
                            <p style={{textAlign: 'center', fontWeight: 'bold'}}>ТТўлов олувчи:</p>
                            <p style={{textAlign: 'center', fontWeight: 'bold'}}>"ТОШКЕНТ КИМЁ ХАЛҚАРО <br/>
                                УНИВЕРСИТЕТИ" МЧЖ
                            </p>
                            <p>
                                Почта манзили: Тошкент шаҳри,
                                <br/> Яккасарой тумани, Усмон Носир кўчаси, 156 уй
                                <br/> Телефон: +998 (78) 129-40-40
                                <br/> (ички рақам 123)
                                <br/> Университетнинг реквизитлари:
                                <br/> Ҳ/р: 2020 8000 8009 0096 3001
                                <br/> АИТБ "ИПАК ЙЎЛИ" банки Яккасарой филиали
                                <br/> МФО: 01028
                                <br/> СТИР: 305 652 539
                                <br/> ОКЭД: 85420

                            </p>
                        </div>
                        <div>
                            <p style={{textAlign: 'center', fontWeight: 'bold'}}> Талаба / Тўловчининг Ф.И.О.:</p>
                            <p className={'fw'}>{fullName}</p>
                            <p>Паспорт серияси ва рақами: <span className={'fw'}>{passportNum}</span></p>
                            <p>Қачон ва ким томонидан берилган: </p>
                            <div style={{borderBottom: '0.2px solid black', margin: '20px 0 5px'}}></div>
                            <div style={{borderBottom: '0.2px solid black', margin: '20px 0 5px'}}></div>
                            <div style={{borderBottom: '0.2px solid black', margin: '20px 0 5px'}}></div>
                            <p>Яшаш манзили (прописка бўйича): </p>
                            <div style={{borderBottom: '0.2px solid black', margin: '20px 0 5px'}}></div>
                            <div style={{borderBottom: '0.2px solid black', margin: '20px 0 5px'}}></div>
                            <div style={{borderBottom: '0.2px solid black', margin: '20px 0 5px'}}></div>
                            <div style={{display: "flex"}}>
                                <p style={{display: 'flex'}}>Телефон рақами: +998
                                </p>
                                <div style={{width: '55%', borderBottom: '1px solid black'}}></div>
                            </div>

                        </div>
                    </div>
                    <p style={{textAlign: 'center', fontWeight: 'bold', marginTop: '10px'}}>Тарафларнинг имзолари:</p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px'
                        }}
                    >
                        <div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <b>Университет ректори <br/>
                                    Ж.Ш. КУДАЙБЕРГЕНОВ
                                </b>
                                <img width={120} height={60} src="/assets/rektor.png" alt="imzo"/>
                            </div>

                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <b>Ўқув-услубий бошқарма бошлиғи <br/>
                                    Р.К. Аллаберганов
                                </b>
                                <img width={75} height={60} src="/assets/oquvb.jpg" alt="imzo"/>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <b>Бош ҳисобчи <br/>
                                    Ж.Э. Курбанбаев
                                </b>
                                <img width={165} height={60} src="/assets/bugalter.png" alt="imzo"/>
                            </div>

                        </div>
                        <div>
                            <b>Талаба / Тўловчи </b>
                            <div style={{display: 'flex', gap: '5px', marginTop: '30px'}}>
                                <div
                                    style={{width: '80%', borderTop: '1px solid black', textAlign: 'center'}}>(Ф.И.О.)
                                </div>
                                <div style={{width: '20%', borderTop: '1px solid black', textAlign: 'center'}}>(имзо)
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
  font-size: 10px;
  padding: 10px;
  color: black;

  .fw {
    font-weight: bold;
  }
`
export default PdfContr;