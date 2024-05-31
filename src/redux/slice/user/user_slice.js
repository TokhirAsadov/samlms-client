import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  user: {},
  userId: "",
  userLoadingStatus: "loading",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userFetching: state =>{ state.userLoadingStatus = 'loading' },
    userFetched: (state,action) => {
      state.userLoadingStatus = "done";
      state.user = action.payload;
    },
    userFetchingError: state => { state.userLoadingStatus = "error" },
    userFetchedId: (state,action) => {
      state.userLoadingStatus = "id_done";
      state.userId = action.payload;
    },
    resetDataUser:()=>initialState
  }
})

const { actions,reducer } = userSlice;

export default reducer;
export const { userFetching, userFetched, userFetchingError,resetDataUser } = actions;