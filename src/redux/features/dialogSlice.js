import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openSubmitDialog: false,
  selectedJobForSubmit: null,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    openSubmitDialog: (state, action) => {
      state.openSubmitDialog = true;
      state.selectedJobForSubmit = action.payload; // Store selected job
    },
    closeSubmitDialog: (state) => {
      state.openSubmitDialog = false;
      state.selectedJobForSubmit = null; // Clear selected job
    },
  },
});

export const { openSubmitDialog, closeSubmitDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
