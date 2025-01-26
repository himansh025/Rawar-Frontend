import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice.js';
import uploadReducer from './uploadSlice.js';
// import toastReducer from './toastSlice.js';
// import searchReducer from './SearchSlice.js'
import reloadSlice from './reloadSlice.js';
import dataslicer from './dataSlice.js'
import emailReducer from './emailSlice.js'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    // toast:toastReducer,
    // search:searchReducer,
    email: emailReducer,
    load:reloadSlice,
    data:dataslicer
  },
});