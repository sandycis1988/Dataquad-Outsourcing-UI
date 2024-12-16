// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './features/formSlice'
import authReducer from './features/authSlice'
import forgotPasswordReducer from './features/forgotPasswordSlice'
import employeeReducer from './features/employeeSlice'
import jobFormReducer from '../redux/features/jobFormSlice';


export const store = configureStore({
  reducer: {
    form:formReducer,
    auth: authReducer,
    forgotPassword: forgotPasswordReducer,
    employee: employeeReducer,
    jobForm: jobFormReducer,

  },
});
