import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  transferStudent: {},
  transferStudentId: "",
  transferStudentLoadingStatus: "loading",
}

const dekanTransferStudentSlice = createSlice({
  name: "transferStudent",
  initialState,
  reducers: {
    transferStudentFetching: state =>{ state.transferStudentLoadingStatus = 'loading' },
    transferStudentFetched: (state,action) => {
      state.transferStudentLoadingStatus = "done";
      state.transferStudent = action.payload;
    },
    transferStudentFetchingError: state => { state.transferStudentLoadingStatus = "error" },
    transferStudentFetchedId: (state,action) => {
      state.transferStudentLoadingStatus = "id_done";
      state.transferStudentId = action.payload;
    },
  }
})

const { actions,reducer } = dekanTransferStudentSlice;

export default reducer;
export const { transferStudentFetching, transferStudentFetched, transferStudentFetchingError } = actions;