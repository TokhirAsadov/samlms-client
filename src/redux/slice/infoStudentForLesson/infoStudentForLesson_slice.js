import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    dataInfoStudents:null,
}

const infoStudentForLessonSlice = createSlice({
    name: "infoStudentForLessonSlice",
    initialState,
    reducers: {
        addInfoStudentLesson: (state,action) => {
            state.dataInfoStudents = action.payload;
        },
    }
})

const { actions,reducer } = infoStudentForLessonSlice;

export const {addInfoStudentLesson } = actions;
export default reducer;
