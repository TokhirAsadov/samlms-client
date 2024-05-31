import React from 'react';
import Button from "@mui/material/Button";
import * as XLSX from 'xlsx';

const ExportData = ({allStudentsData, dataAllScore, groupName}) => {

    const formatScore = (num) => parseFloat((num || 0)?.toFixed(3));
    const totalScore = (data, stId) => {
        const allDataStudents = data.map(st => st.students)?.flat()
        const findStudentAttendanceScore = allStudentsData.find(student => student.studentId === stId)?.allGradesForAttendance
        const filterStudent = allDataStudents.filter(scoreData => scoreData.studentId === stId)
        const totalScore = filterStudent.reduce((acc, curr) => acc + (Number(curr.grade) || 0), 0) + parseFloat(findStudentAttendanceScore?.toFixed(3));

        return parseFloat(totalScore.toFixed(3));
    }
    const exportToExcel = (dataAllScore, allStudentData, fileName = `${groupName}.xlsx`) => {

        const headers = ['№', 'Full name', ...dataAllScore.map(theme => theme.themeName), 'ATTENDANCE', 'Total'];
        const dataRows = allStudentData.map((student, index) => {
            const row = [index + 1, student.fullName];
            dataAllScore.forEach(theme => {
                const score = theme.students.find(s => s.studentId === student.studentId);
                row.push(score ? formatScore(score.grade) : 'N/A');
            });
            row.push(student?.allGradesForAttendance ? formatScore(student?.allGradesForAttendance) : 0)
            row.push(totalScore(dataAllScore, student.studentId));

            return row;
        });

        const worksheetData = [[groupName], headers, ...dataRows];
        const ws = XLSX.utils.aoa_to_sheet(worksheetData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Scores');
        XLSX.writeFile(wb, fileName);
    };

    return (
        <Button variant={'outlined'} color="inherit" onClick={() => exportToExcel(dataAllScore, allStudentsData)}>
            export
        </Button>
    );
};

export default ExportData;