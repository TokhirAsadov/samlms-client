import React, {useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import {BiArrowBack} from "react-icons/bi";
import {BsFillFileEarmarkTextFill, BsImages, BsLink45Deg} from "react-icons/bs";
import styled from "styled-components";
import {BASE_URL, getHeaders, mainColor} from "../../../utills/ServiceUrls";
import {extrasmall} from "../../../responsiv";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import axios from "axios";
import {RiFileExcel2Fill} from "react-icons/ri";
import {AiFillFileText, AiFillFileZip} from "react-icons/ai";
import {FaFilePdf, FaFilePowerpoint, FaFileWord} from "react-icons/fa";
import {IoDocumentSharp} from "react-icons/io5";
import MessagesTeacherAndStudents from "./MessagesTeacherAndStudents";
import EmptyDataImg from "../../emptyDataImg/EmptyDataImg";


const StudentSubjectTheme = () => {

    const {subjectName} = useParams()
    const student = useSelector(state => state?.student?.student)
    const {headers} = getHeaders();

    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const {dataInfoStudents} = useSelector(state => state.infoStudentForLessonSlice)

    const [data, setData] = useState([]);



    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await axios.get(`${BASE_URL}/groupConnect/getLinesForStudent/${dataInfoStudents?.educationYearId}?groupId=${student?.groupData?.id}&subjectId=${dataInfoStudents?.lessonId}&teacherId=${dataInfoStudents?.teacherId}`, {headers})
            .then(response => {

                setData(response?.data?.lines)
            })
            .catch(err => {
                console.log(err)
            })
    }


    function typeFileIcon(fileData, typeUrl, fileName) {

        if (fileData === ".doc" || fileData === ".docx") {
            return <> <FaFileWord size={20} color="white"/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".jpg" || fileData === ".jpeg" || fileData === ".png") {
            return <> <BsImages size={20} color={"#FFF"}/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".xls" || fileData === ".xlsx") {
            return <> <RiFileExcel2Fill size={20} color={"#FFF"}/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p></>
        }
        if (fileData === ".txt") {
            return <> <AiFillFileText size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".ppt" || fileData === ".pptx") {
            return <> <FaFilePowerpoint size={20} color={"#FFF"}/>
                <p>{fileName.substring(0, fileName.indexOf("_"))}</p></>
        }
        if (fileData === ".pdf") {
            return <> <FaFilePdf size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (fileData === ".zip") {
            return <> <AiFillFileZip size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        if (typeUrl === "URL") {
            return <> <BsLink45Deg size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
            </>
        }
        return <> <IoDocumentSharp size={20} color={"#FFF"}/> <p>{fileName.substring(0, fileName.indexOf("_"))}</p>
        </>
    }

    const fetchDownloadFile = async (fileName) => {

        // console.log(fileName, "file name")
        await axios.get(`${BASE_URL}/topicFile/uploadFromSystem?fileName=${fileName}&subject=${subjectName}`, {headers})
            .then(response => {
                // console.log(response,"-------------------------------------------------------------")
                window.location.href = `${BASE_URL}/topicFile/uploadFromSystemUser?fileName=${fileName}&subject=${subjectName}`
            })
            .catch(err => {
                console.log(err, "create lines err")
            })
    }


    return (
        <Container>
            <TitleMain>
                <p>{subjectName}</p>

                <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<BiArrowBack/>}>
                    Back
                </Button>
            </TitleMain>
            <MainCard>


                {data?.length > 0 ? data?.map((item, index) => (
                    <MainCardBody key={index}>
                        <TitleTTheme>
                            <BsFillFileEarmarkTextFill size={20}/>
                            <p>
                                {item.queue}-Mavzu:{item.theme.name}
                            </p>
                        </TitleTTheme>
                        <CardFile>
                            {item?.files?.map((file, key) => (
                                <CardFileWrapper key={key}>
                                    {file.type !== "URL" ? (
                                        <CardFileItem onClick={() => fetchDownloadFile(file?.name)}>
                                            {typeFileIcon(file?.fileType, file?.type, file?.name)}
                                        </CardFileItem>
                                    ) : (
                                        <CardFileItem href={file?.url !== null && file?.url} target="_blank">
                                            {typeFileIcon(file?.fileType, file?.type, file?.name)}
                                        </CardFileItem>
                                    )}
                                </CardFileWrapper>
                            ))}

                        </CardFile>

                    </MainCardBody>
                )) : (
                    <EmptyDataImg w={"200"} h={"180"}/>
                )}
            </MainCard>

            {/* message modal */}
            <MessagesTeacherAndStudents open={open} setOpen={setOpen} scroll={scroll}/>


        </Container>
    );
};


const CardFile = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
`
const CardFileWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`
const CardFileItem = styled.div`
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 10px;
    border-radius: 5px;
    background-color: #0a62af;
    opacity: 0.8;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;

    :hover {
        opacity: 1;
    }
`
const TitleTTheme = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #053767;

    p {
        font-size: 18px;
        font-weight: bold;
    }
`;

const MainCardBody = styled.div`
    margin-bottom: 50px;
`
const MainCard = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    margin-top: 15px;
`;
const TitleMain = styled.h1`
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
        color: ${mainColor};
        font-size: 25px;
        font-weight: bold;

        ${extrasmall({
            textAlign: "start",
            fontSize: "15px",
        })}

    }
`;


const Container = styled.div`
    width: 100%;
    padding: 1rem;
`;

export default StudentSubjectTheme;
