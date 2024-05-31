import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    btnval:true,
    btnAction:'open',
}

const btnSlice = createSlice({
    name: "btnvalue",
    initialState,
    reducers: {
        btntoggle: (state,action) => {
            state.btnval = action.payload;
            state.btnAction=action.payload ?'open' :'close'
        },
    }
})

export const {btntoggle}=btnSlice.actions
export default btnSlice.reducer