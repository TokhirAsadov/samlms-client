import React from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {changeScoreStudent} from "../../../redux/slice/multipartScore/multipartScore_slice";
import {toast} from "react-toastify";


const GradeToday = ({data}) => {
    const dispatch = useDispatch();
    const dataScoreMultipart = useSelector(state => state.dataScoreMultipart)
    const scoreThemeDataUser = dataScoreMultipart?.gradesTheme;
    const scoreDataUser = dataScoreMultipart?.grades;

    const formatScore = (num) => {
        return  num !==null ? parseFloat((num)?.toFixed(3)) : '';
    }

    const findScoreUser = (gr, grTheme) => {
        const f1 = gr.find(item => item?.studentId === data?.studentId);
        const f2 = grTheme.find(item => item?.studentId === data?.studentId);
       const scoreF=f1?.grade !== undefined ? f1?.grade :(f2?.grade !== undefined ? f2?.grade : null)
        //console.log(scoreF,'sf')
        return {
            id: f1?.gradeId || f2?.gradeId || null,
            score: formatScore(scoreF)
        };
    }
    function isNumber(value) {
        if (value === null || isNaN(value) || typeof value === 'undefined') {
            return false;
        }
        value = value.toString().trim();
        return /^-?\d*\.?\d+$/.test(value);
    }

    const handleInputChange = (event, gradeId) => {
        const newValue = +(event.target.value);
        if (isNumber(newValue)){
            const formattedValue = parseFloat(newValue);
            if (!(formattedValue >= 0 && formattedValue <= (dataScoreMultipart?.maxGrade || 6))) {
                toast.warning(`Grade must be between 0 and ${dataScoreMultipart?.maxGrade || 6}`)
            }
            dispatch(changeScoreStudent({
                ...dataScoreMultipart,
                studentId: data?.studentId,
                gradeId,
                grade: formattedValue
            }));
        }


    }

    console.log(findScoreUser(scoreDataUser, scoreThemeDataUser)?.score,'value')
    return (
        <InputBox
            type={'text'}
            value={findScoreUser(scoreDataUser, scoreThemeDataUser)?.score}
            max={dataScoreMultipart?.maxGrade || 6}
            onFocus={(e) => e.target.addEventListener("wheel", function (e) {
                e.preventDefault()
            }, {passive: false})}
            maxLength={2}
            onChange={(e) => handleInputChange(e, findScoreUser(scoreDataUser, scoreThemeDataUser).id)}
        />
    );
};

const InputBox = styled.input`
    margin: 0 auto;
    width: 50px;
    height: 50px;
    padding: 0 5px;
    border-radius: 5px;
    border: 1px solid #a6a6e0;
    display: flex;
    outline: none;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
    color: ${props => props.color ? props.color : "#000"};
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
`;

export default React.memo(GradeToday);
