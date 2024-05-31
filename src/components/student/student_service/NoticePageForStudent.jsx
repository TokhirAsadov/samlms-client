import React, {memo, useEffect, useState} from 'react';
import NoticeForStudent from "./NoticeForStudent";
import axios from "axios";
import {BASE_URL} from "../../../utills/ServiceUrls";
import {useSelector} from "react-redux";

const NoticePageForStudent = () => {
    const studentData = useSelector(state => state?.student?.student) || null;
    const [noticeData, setNoticeData] = useState(null)

    const getNoticeForStudent=()=>{
        axios.get(BASE_URL+`/notificationOuter/getStudentOuterNotifications/${studentData.id}`)
            .then(res=>{
                setNoticeData(res.data.obj);
                console.log(res.data.obj)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getNoticeForStudent()
    }, [])


    return (
        <>
            <NoticeForStudent data={noticeData} studentData={studentData}/>
        </>
    );
};

export default memo(NoticePageForStudent);