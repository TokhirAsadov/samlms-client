import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    subjectId: null,
    groupId: null,
    educationId: null,
    id: null,
    maxGrade: null,
    grades: [],
    gradesTheme:[]
};

const dataForChangeScoreMultipart = createSlice({
    name: "dataForChangeScoreMultipart",
    initialState,
    reducers: {
        changeThemeStudent:(state,{payload})=>{
            state.educationId=payload.educationId;
            state.groupId=payload.groupId;
            state.subjectId=payload.subjectId;
            state.id=payload.id || null;
            state.maxGrade=payload.maxGrade || null;
            state.gradesTheme=payload.gradesTheme;
            state.grades=[];
        },
        changeScoreStudent: (state, { payload }) => {
           const foundStudent=state.grades?.find(st=>st.studentId===payload.studentId);
           if (foundStudent){
               foundStudent.grade=payload.grade
           }
           else {
               state.grades.push({studentId:payload.studentId, grade:payload.grade,gradeId:payload.gradeId})
           }

            state.grades = state.grades.filter(st => st.grade !== null && st.grade !== undefined);
        },
        resetDataScore: (state, action) => {
            return initialState;
        },
    },
});

const { reducer, actions } = dataForChangeScoreMultipart;
export default reducer;

export const { changeThemeStudent,changeScoreStudent, resetDataScore } = actions;
