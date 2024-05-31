import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data:null,
}

const dataForUpdateThemeGrade = createSlice({
    name: "dataForUpdateThemeGrade",
    initialState,
    reducers: {
        saveData: (state,action) => {
            state.data =action.payload;
        },
        resetData: (state,action) => {
            state.data =null;
        }
    }
})

const {reducer,actions} =dataForUpdateThemeGrade
export const {saveData,resetData}=actions
export default reducer