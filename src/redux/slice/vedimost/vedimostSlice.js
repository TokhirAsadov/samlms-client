import {createSlice} from "@reduxjs/toolkit";

const initialState = {
   data:null,
    loading:false,
    error:false,
}

const vedimostSlice = createSlice({
    name: "vedimost",
    initialState,
    reducers: {
        dataVedimostLoad: state =>{
            state.loading = true;
            state.error = false;
            state.data = null;
        },
        dataVedimostFetched: (state,action) => {
            state.loading = false;
            state.error = false;
            state.data = action.payload;
        },
        dataVedimostFetchingError: state => {
            state.loading = false;
            state.error = true;
            state.data = null;
        },
        resetDataVedimost:()=>initialState
    }
})

const { actions,reducer } = vedimostSlice;

export default reducer;
export const { dataVedimostLoad,
    dataVedimostFetched,
    dataVedimostFetchingError,
    resetDataVedimost } = actions;