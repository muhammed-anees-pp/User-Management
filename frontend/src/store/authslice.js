import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import API from '../api'

export const loginUser=createAsyncThunk('auth/login',async(formData,thunkAPI)=>{
    try{
        const res = await API.post('/api/login/',formData);
        localStorage.setItem('access',res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("is_admin", res.data.is_admin);

        return res.data;
    }catch (error) {
      let message = "Login failed";
      if (error.response?.data) {
        if (error.response.data.non_field_errors) {
          message = error.response.data.non_field_errors.join(" ");
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        } else {
          message = JSON.stringify(error.response.data);
        }
      }
      return thunkAPI.rejectWithValue(message);
    }
});

export const registerUser = createAsyncThunk('auth/register',async(formData,thunkAPI)=>{
    try{
        const res = await API.post('/api/register/',formData);
        return res.data
    }catch (error) {
      let message = "Registration failed";
      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === "string") {
          message = errors;
        } else if (typeof errors === "object") {
          message = Object.values(errors).flat().join(" ");
        }
      }
      return thunkAPI.rejectWithValue(message);
    }
})

export const getProfile = createAsyncThunk("auth/profile", async () => {
  const res = await API.get("/api/profile/");
  return res.data;
});

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:false,
        error:null,
        isAdmin:false
    },
    reducers:{
      logout: (state) => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("is_admin");

        state.user = null;
        state.isAdmin = false;
        state.loading = false;
        state.error = null;
      },
      clearError: (state) => {
        state.error = null;
      }    
    },
    extraReducers:(builder)=>{
        builder
            .addCase(loginUser.pending,(state)=>{state.loading=true;})
            .addCase(loginUser.fulfilled,(state,action)=>{
                state.loading = false;
                state.error = null;
                state.isAdmin=action.payload.is_admin;
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading=false
                state.user = action.payload;
            });

    },
});

export const {logout, clearError}=authSlice.actions;
export default authSlice.reducer;