import React, {memo, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {GrFormNext, GrFormPrevious} from "react-icons/gr";
import moment from "moment/moment";
import styled from "styled-components";
import {getHeaders, mainColor} from "../../../utills/ServiceUrls";
import * as XLSX from "xlsx";
import {useDispatch, useSelector} from "react-redux";
import ItemAllStudentNbModal from "./ItemAllStudentNbModal";
import LinearProgress from "@mui/material/LinearProgress";
import ItemNbForExcel from "./ItemNbForExcel";
import DynamicAttendanceAllStudents from "./DynamicAttendanceAllStudents";
import {getAllStudentData} from "../../../redux/actions/allNbModalForTeacher/allNbModalForTeacher_action";
import SaveNbAllStudentsBtn from "./SaveNbAllStudentsBtn";

function AllStudentsNbModal({groups, lessons, groupSelect, scien}) {
    const {headers} = getHeaders();
    const [time, setTime] = useState(new Date());
    const [days, setDays] = useState([]);
    const dispatch = useDispatch()
    const [modalDynamic, setModalDynamic] = useState(false)
    const educationYear = useSelector(state => state?.educationYear?.educationYear) || null;
    const dataStudents = useSelector(state => state.AllNbStudentForTeacher.data)
    const load = useSelector(state => state.AllNbStudentForTeacher.isLoading)
    const errorData = useSelector(state => state.AllNbStudentForTeacher.isError)
    const [dataForAttendance, setDataForAttendance] = useState(null)
    const subjectId = lessons?.find(l => l?.name === scien)?.id
    const groupId = groups?.find(g => g?.name === groupSelect)?.id
    const hours = useSelector(state => state.hourSection)
   const confData={eduId: educationYear?.id, groupId, subjectId, hours, headers: getHeaders()}

    const openModal = () => {
        setModalDynamic(true)
    }
    const closeModal = () => {
        setModalDynamic(false)
        setDataForAttendance(null)
    }

    function arrayToCommaSeparatedString(arr) {
        if (Array.isArray(arr)) {
            return arr.join(',');
        } else {
            return '';
        }
    }

    const exportToExcel = () => {
        const data = [];

        const headerRow = ['№', 'Full name', ...days, 'total'];
        data.push(headerRow);
        dataStudents.map((item, index) => {
            const body = [
                index + 1,
                item.fullName,
                ...days.map((day) =>
                    new Date(time.getFullYear(), time.getMonth(), day) <= new Date() ?
                        arrayToCommaSeparatedString(ItemNbForExcel({data: item, day, time})) :
                        ''),
                item?.subjectNb
            ]
            data.push(body)
            console.log(body)
        })


        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Create a worksheet and add data
        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'StudentsData');

        // Save the workbook to a file
        XLSX.writeFile(workbook, 'students_data.xlsx');
    };

    const prevMonth = () => {
        setTime(new Date(time.getFullYear(), time.getMonth() - 1))
    }
    const nextMonth = () => {
        setTime(new Date(time.getFullYear(), time.getMonth() + 1))
    }

    useEffect(() => {
        setDays(() => Array.from(Array(moment(time).daysInMonth()).keys()).map(i => i + 1))
    }, [time])


    useEffect(() => {
        dispatch(getAllStudentData(confData))
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                <Button sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    alignItems: 'center',
                    backgroundColor: "#fcfafa"
                }}>
                    <div style={buttonStyles} onClick={prevMonth}><GrFormPrevious/></div>
                    <input type="month" id="start" name="start"
                           min="2022-04"
                           value={moment(time).format("YYYY-MM")}
                           onChange={e => setTime(new Date(e.target.value))}
                           style={monthInput}
                           lang='en'
                    />
                    <div style={buttonStyles} onClick={nextMonth}><GrFormNext/></div>
                </Button>
            </Box>
            <BodyBox>
                <table>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>
                            <p>Full name</p>
                        </th>
                        {days.map(day => <th key={day}>{day}</th>)}
                        <th>&sum;</th>
                    </tr>
                    </thead>
                    <tbody>

                    {!load && dataStudents?.map((student, index) => (
                        <tr key={index}>
                            <td style={{textAlign: "center"}}>{index + 1}</td>
                            <td>{student?.fullName}</td>
                            {days.map((day, i) => (
                                new Date(time.getFullYear(), time.getMonth(), day) <= new Date() ?
                                    <ItemAllStudentNbModal
                                        openModal={openModal}
                                        key={i}
                                        setDataForAttendance={setDataForAttendance}
                                        data={student}
                                        day={day}
                                        time={time}
                                    />
                                    : <td key={i}></td>
                            ))}
                            <td>{student?.subjectNb}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {load && <Box sx={{width: '100%', marginTop: '20px'}}>
                    <LinearProgress/>
                </Box>}
            </BodyBox>
                <SaveNbAllStudentsBtn exportToExcel={exportToExcel} confData={confData} dataStudents={dataStudents}/>
            <DynamicAttendanceAllStudents
                open={modalDynamic}
                handleCloseModal={closeModal}
                dataForAttendance={dataForAttendance}
                eduId={educationYear?.id}
                subjectId={subjectId}
                groupId={groupId}
            />
        </>
    );
}

const BodyBox = styled.div`
    margin-top: 25px;
    width: 100%;
    overflow: scroll;
    height: 64vh;

    table {
        min-width: 1500px;
        border-collapse: collapse;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;

        td, th {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 15px;
        }

        th {
            text-align: center;
        }

        tr {
            &:nth-child(even) {
                background-color: #fcf9f9;
            }
        }

        th {
            background-color: ${mainColor};
            color: white;
        }
    }

`;
const monthInput = {
    border: "none",
    outline: "none",
    background: "transparent",
}
const buttonStyles = {
    width: "40px!important",
    height: "40px!important",
    fontSize: "24px",
}
export default memo(AllStudentsNbModal);