
import { createSlice } from "@reduxjs/toolkit";

//!Initial State
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
  },
  // Reducers
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
    },
    logoutAction: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    updateUsernameAction: (state, action) => {
      if (state.user) {
        state.user.username = action.payload;
        // update local storage so the username persists after reload
        localStorage.setItem("userInfo", JSON.stringify(state.user));
      }
    },
  },
});

//! Generate actions
export const { loginAction, logoutAction, updateUsernameAction } =
  authSlice.actions;

//! Generate the reducer
const authReducer = authSlice.reducer;
export default authReducer;
