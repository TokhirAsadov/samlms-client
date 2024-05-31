import React, {useState} from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {useTranslation} from "react-i18next";
import {TextField} from "@mui/material";
import {mainColor} from "../../utills/ServiceUrls";
import {BsCalendarEvent} from 'react-icons/bs'
import {AiOutlineClockCircle} from 'react-icons/ai'
import {extrasmall, large, medium, small} from "../../responsiv";
import Modal from "@mui/material/Modal";
import {RiCloseLine} from "react-icons/ri";

const Notificationmenu = ({NotificationDatausers}) => {

    const [cardheight, setcardheight] = useState(false)
    const [open, setOpen] = useState(false);
    const [oneHistory, setOneHistory] = useState([])
    const [titleHistory, setTitleHistory] = useState("")

    const handleOpen = (item) => {
        setOpen(true)
        setOneHistory(item)
    };
    const handleClose = () => setOpen(false);



    const {t} = useTranslation()
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const {children, value, index, ...other} = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{p: 3}}>
                        <div>{children}</div>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }


    const onSub = (e) => {
        e.preventDefault()
        const objdata = {
            title: e.target.titleval.value,
            datestart: e.target.datestart.value,
            datend: e.target.datend.value,
            textarea: e.target.descrval.value,
        }
        console.log(objdata)
        e.target.reset()
    }
    const handlefil = (e) => {
        e.preventDefault()
        const objdata = {
            title: e.target.mavzu.value,
            date: e.target.filtime.value
        }
        console.log(objdata)
        e.target.reset()
    }

    return (
        <Container>
            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label={t("navbar_menu_qabul")} {...a11yProps(0)} />
                        <Tab label={t("navbar_menu_javob")} {...a11yProps(1)} />
                        <Tab label={t("navbar_menu_tarix")} {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <BoxTabPanel>
                        <Form onSubmit={onSub}>
                            <BoxInput>
                                <TextField required id="titleval" label="Title" variant="outlined" fullWidth/>
                            </BoxInput>
                            <Datebox>
                                <BoxInput>
                                    <label htmlFor="datestart">Boshlanish vaqti: </label>
                                    <Inputdate required type="datetime-local" id="datestart"
                                               name="datestart"
                                    />
                                </BoxInput>
                                <BoxInput>
                                    <label htmlFor="datend">Tugash vaqti: </label>
                                    <Inputdate required type="datetime-local" id="datend"
                                               name="datend"
                                    />
                                </BoxInput>
                            </Datebox>
                            <BoxInput>
                                <Textarea required minlength="1" id='descrval' placeholder="Description"/>
                            </BoxInput>
                            <BoxInput>
                                <Btnsend>Send</Btnsend>
                            </BoxInput>
                        </Form>
                    </BoxTabPanel>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <BoxTabPanel>
                        <Form onSubmit={onSub}>
                            <BoxInput>
                                <TextField required id="titleval" label="Title" variant="outlined" fullWidth/>
                            </BoxInput>
                            <Datebox>
                                <BoxInput>
                                    <label htmlFor="meeting-time">Boshlanish vaqti: </label>
                                    <Inputdate required type="datetime-local" id="datestart"
                                               name="datestart"
                                    />
                                </BoxInput>
                                <BoxInput>
                                    <label htmlFor="meeting-time">Tugash vaqti: </label>
                                    <Inputdate required type="datetime-local" id="datend"
                                               name="datend"
                                    />
                                </BoxInput>
                            </Datebox>
                            <BoxInput>
                                <Textarea required id="descrval" minlength="1" placeholder="Description"/>
                            </BoxInput>
                            <BoxInput>
                                <Btnsend>Send</Btnsend>
                            </BoxInput>
                        </Form>
                    </BoxTabPanel>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <BoxTabPanel>
                        <form onSubmit={handlefil}>
                            <FilterBox>
                                <TitleInput
                                    id='mavzu'
                                    placeholder={"Mavzu"}/>
                                <Dateinputfil
                                    type="date"
                                    id="filtime"/>

                                <Btnfilter>Filter</Btnfilter>
                            </FilterBox>
                        </form>
                        <hr style={{width: "100%", margin: 0, border: "0.5px!important"}}/>
                        <Timebox>
                            {NotificationDatausers?.map((item, key) => (
                                <Timecard key={key} onClick={() => handleOpen(item)}>
                                    <Timeinfo>
                                        <AiOutlineClockCircle size={25}/>
                                        <Texth6>{item.createtime.substring(0, item.createtime.indexOf("-", 1)).trim()}</Texth6>
                                    </Timeinfo>
                                    <Timeinfo>
                                        <BsCalendarEvent size={25}/>
                                        <Texth6>{item.createtime.substring(item.createtime.indexOf("-", 1) + 1).trim()}</Texth6>
                                    </Timeinfo>
                                </Timecard>
                            ))}

                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={stylenotific} component={stylenotif}>
                                    <CloseButton onClick={handleClose}><RiCloseLine/></CloseButton>
                                    <Historybox>
                                        <Userbox> {oneHistory.user}</Userbox>
                                        <Historytitle style={{textAlign: "center",}}><b>Mavzu:</b> {oneHistory.title}
                                        </Historytitle>
                                        <Historytitle><b>Tavsifi: </b>{oneHistory.desc}</Historytitle>
                                        <Historytitle><b>Xabarni yuborgan vaqti: </b>{oneHistory.createtime}
                                        </Historytitle>
                                        <Historytitle><b>Boshlanish vaqti: </b>{oneHistory.qabul}</Historytitle>
                                        <Historytitle><b>Tugash vaqti: </b>{oneHistory.tugash}</Historytitle>

                                    </Historybox>

                                </Box>
                            </Modal>
                        </Timebox>
                    </BoxTabPanel>
                </TabPanel>
            </Box>
        </Container>
    );
};

const Userbox = styled.div`
    position: absolute;
    padding: 10px;
    background-color: ${mainColor};
    color: #FFF;
    width: 100%;
    top: 0;
    left: 0;
    font-size: 20px;
    font-weight: normal;
`
const Historybox = styled.div`
    position: relative;
    padding: 35px 15px;

`
const Historytitle = styled.div`
    margin-top: 20px;
    font-size: 20px;
    font-weight: normal;
`
const CloseButton = styled.button`
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    color: ${mainColor};
    cursor: pointer;
    font-size: 26px;
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
`;


const stylenotif = styled.div`
    overflow: hidden;
    ${extrasmall({
        width: "98vw !important",
    })}
`
const stylenotific = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 2
};
const Btnfilter = styled.button`
    border: none;
    width: 80%;
    color: #fff;
    border-radius: 5px;
    padding: 5px 20px;
    background-color: ${mainColor};

    &:hover {
        opacity: 0.8;
    }
`
const Dateinputfil = styled.input`
    padding: 5px;
    outline-color: ${mainColor};
    border-radius: 5px;
    border: 1px solid silver;
`
const TitleInput = styled.input`
    width: 100%;
    padding: 5px;
    outline-color: ${mainColor};
    border-radius: 5px;
    border: 1px solid silver;
`
const FilterBox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 40px;
    grid-gap: 25px;
    ${small({
        gridTemplateColumns: "1fr 1fr"
    })}
    ${medium({
        gridTemplateColumns: "1fr 1fr"
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr 1fr"
    })}`
const Timebox = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: 80px;
    grid-gap: 25px;
    ${small({
        gridTemplateColumns: "1fr 1fr"
    })}
    ${medium({
        gridTemplateColumns: "1fr 1fr"
    })}
    ${extrasmall({
        gridTemplateColumns: "1fr 1fr"
    })}
`
const Timecard = styled.div`
    padding: 10px;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    background-color: ${mainColor};
`
const ArrowCard = styled.div`
    position: absolute;
    bottom: 5px;
    right: 15px;
    cursor: pointer;

    &:hover {
        color: ${mainColor};
    }
`
const Texth6 = styled.h6`
`
const Timeinfo = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
`

const Btnsend = styled.button`
    margin: 0 auto;
    font-size: 17px;
    font-weight: normal;
    width: 150px;
    padding: 5px;
    background-color: ${mainColor};
    color: #fff;
    border-radius: 5px;

    &:hover {
        background-color: #0e0eef;
    }
`
const Textarea = styled.textarea`
    width: 100%;
    padding: 8px;
    min-height: 100px;
    max-height: 200px;
    border-radius: 5px;
    border: 1px solid silver;
    outline-color: ${mainColor};
`
const Datebox = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    ${medium({
        flexDirection: "column",
        gap: "10px"
    })}
    ${large({
        flexDirection: "column",
        gap: "10px"
    })}
    ${extrasmall({
        flexDirection: "column",
        gap: "10px"
    })}
`
const Inputdate = styled.input`
    width: 165px;
    padding: 5px;
    border: 1px solid silver;
    border-radius: 5px;
    outline-color: ${mainColor};
`
const BoxTabPanel = styled.div`
    width: 100%;
    height: 320px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`
const BoxInput = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;

`
const Container = styled.div`
    padding: 10px;
`
export default Notificationmenu;