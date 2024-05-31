import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    year: null,
    week: null,
    day: null,
    subjectId: null,
    groupId: null,
    educationId: null,
    attendances: [],
};

const dataForChangeAttendance = createSlice({
    name: "allStudentForChangeAttendance",
    initialState,
    reducers: {
        changeAttendance: (state, { payload }) => {
            state.year = payload.year;
            state.week = payload.week;
            state.day = payload.day;
            state.subjectId = payload.subjectId;
            state.groupId = payload.groupId;
            state.educationId = payload.educationId;
            const { studentId, section, isCome, room ,id} = payload;
            const existingAttendanceIndex = state.attendances.findIndex(
                (st) => st.studentId === studentId && st.section === section
            );

            if (existingAttendanceIndex !== -1) {
                state.attendances[existingAttendanceIndex] = {
                    ...state.attendances[existingAttendanceIndex],
                    isCome,
                    room,
                };
            } else {
                state.attendances.push({
                    id,
                    studentId,
                    isCome,
                    room,
                    section,
                });
            }
            state.attendances = state.attendances.filter(
                (st) => typeof st.isCome === "boolean"
            );
        },
        changeAttendanceAll:(state,{payload})=>{
            state.year = payload.year;
            state.week = payload.week;
            state.day = payload.day;
            state.subjectId = payload.subjectId;
            state.groupId = payload.groupId;
            state.educationId = payload.educationId;
            state.attendances=payload.attData;
            state.attendances = state.attendances.filter(
                (st) => typeof st.isCome === "boolean"
            );
        },
        resetData: () => {
            return initialState;
        },
    },
});

const { reducer, actions } = dataForChangeAttendance;
export default reducer;

export const { changeAttendance, changeAttendanceAll,resetData } = actions;
