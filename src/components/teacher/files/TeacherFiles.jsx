import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {mainColor} from "../../../utills/ServiceUrls";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";
import {FaPaperclip} from "react-icons/fa";


const TeacherFiles = () => {

    const datafeke = [

        {
            lesson: "Ochiq dars",
            lessoninfo: []
        },

        {
            lesson: "Sovrindor talabalar",
            lessoninfo: []
        },

        {
            lesson: "Tezislar",
            lessoninfo: []
        },
        {
            lesson: "Maqolalar",
            lessoninfo: []
        },
        {
            lesson: "ITI da ishtirok",
            lessoninfo: []
        },
        {
            lesson: "Xalqaro (impakt-faktorli) nashrlar",
            lessoninfo: []
        },
        {
            lesson: "Ixtirolar",
            lessoninfo: []
        },
        {
            lesson: "Monografiya",
            lessoninfo: []
        },
        {
            lesson: "Darslik, qo`llanma",
            lessoninfo: []
        },
        {
            lesson: "Yakka mualliflikdagi darslik yoki qo`llanma",
            lessoninfo: []
        },
        {
            lesson: "Ilmiy rahbarligidagi bitta DSc yoki ikkita PhD himoyasi dissersatsiya himoyasi",
            lessoninfo: []
        },
        {
            lesson: "Doktorlik (DSc yoki PhD) dissersatsiyasini himoyasi",
            lessoninfo: []
        },
        {
            lesson: "Xorijda malaka oshirish yoki stajirofka o`tash",
            lessoninfo: []
        },
        {
            lesson: "Akademik ilmiy unvoniga egalik",
            lessoninfo: []
        },

    ]
    const [value, setValue] = useState(datafeke[0]?.lesson);

    const [date, setDate] = useState([])

    useEffect(() => {
        setDate(datafeke.filter(item => item.lesson === value))
    }, [value])
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Container>
            <Header>
                <Row>
                    <Title>Diplom: </Title>
                    <Label>
                        <input style={{display: "none"}}
                            // onChange={savePhoto}
                        />
                        <Icon><FaPaperclip/></Icon>
                    </Label>
                </Row>
            </Header>
            <hr style={{width: "100%"}}/>

            <div className='teacherfiletabs'>
                <Tabs
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    value={value}
                    onChange={handleChange}
                    indicatorColor=""
                >
                    {datafeke.map((itm, key) => (
                        <Tab
                            component={tabsitem}
                            key={key}
                            value={itm.lesson}
                            label={(
                                <TabsTitle fs={itm?.lesson.length > 35 && "10px"}>{itm?.lesson}</TabsTitle>
                            )
                            }/>
                    ))}
                </Tabs>
            </div>
            <Tabsbox>
                {date[0]?.lessoninfo.length > 0 ? date[0]?.lessoninfo.map((item, key) => (
                    <Tabsitems key={key}>
                        {item.allCount}
                    </Tabsitems>
                )) : (
                    <EmptyDataImg w={"200"} h={"180"}/>
                )}
            </Tabsbox>

        </Container>
    );
};

const Tabsbox = styled.div`
    width: 100%;
    padding: 1rem;
    background-color: #ffffff;
    min-height: 300px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
`
const TabsTitle = styled.div`
    font-size: ${props => props.fs || "15px"}
`;
const Tabsitems = styled.div`
`;
const tabsitem = styled.div`
    width: 230px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px !important;;
    color: ${mainColor};
    padding: 5px 20px !important;
    height: 42px !important;
    margin: 5px !important;
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;

    &:hover {
        color: #ffffff !important;
        background-color: #5093f1 !important;
    }

    &.Mui-selected {
        color: #ffffff !important;
        background-color: #5093f1 !important;
    }
`;



const Label = styled.label`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 0.5rem;
    cursor: pointer;
`

const Icon = styled.div`
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background-color: #fff;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
        background-color: rgba(255, 255, 255, 0.4);
    }
`;


const Title = styled.div`
    font-size: 24px;
`;

const Row = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    color: ${mainColor};
`;

const Header = styled.div`
    width: 100%;
`;

const Container = styled.div`
    
    width: 100%;
    padding: 10px;
`;


export default TeacherFiles;