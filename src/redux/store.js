// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './features/formSlice'
import authReducer from './features/authSlice'


export const store = configureStore({
  reducer: {
    form:formReducer,
    auth: authReducer,

  },
});
