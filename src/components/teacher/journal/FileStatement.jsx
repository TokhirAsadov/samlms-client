import React, {memo, useEffect, useState} from 'react';
import PdfDocument from "../../../utills/pdfFiles/PdfStatement";
import {useSelector} from "react-redux";
import axios from "axios";
import {BASE_URL, getHeaders} from "../../../utills/ServiceUrls";

const FileStatement = ({educationYear, content, groupName, subjectName}) => {
    const teacherData = useSelector(state => state.teacher.teacher)
    const {headers}=getHeaders()
    const [dataOfLeaders, setDataOfLeaders] = useState(null)
    useEffect(() => {
        axios.get(`${BASE_URL}/teacher/getDataOfLeaders/${teacherData?.id}/${groupName} `,{headers})
            .then(response =>{
                setDataOfLeaders(response.data.obj)
            })
            .catch(error =>{
                console.log(error)
            })
    }, []);

    return (
        <>
            <PdfDocument
                dataOfLeaders={dataOfLeaders}
                teacherData={teacherData}
                educationYear={educationYear}
                content={content?.sort((a,b)=>{
                    if (a.fullName > b.fullName) return 1;
                    else if (a.fullName < b.fullName) return -1;
                    return 0;
                })}
                groupName={groupName}
                subjectName={subjectName}
            />
        </>
    );
};

export default memo(FileStatement);