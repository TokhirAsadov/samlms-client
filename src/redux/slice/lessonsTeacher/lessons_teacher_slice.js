import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    forLessonsData:null,
    selectedGroup: null,

}

const lessonsTeacherSlice = createSlice({
    name: "lessonsTeacherSlice",
    initialState,
    reducers: {
        addLessonInfo: (state,action) => {
            state.forLessonsData = action.payload;
        },
        addSelectedGroup: (state,action) => {
            state.selectedGroup=action.payload;
        }
    }
})

const { actions,reducer } = lessonsTeacherSlice;

export const {addLessonInfo ,addSelectedGroup} = actions;
export default reducer;
