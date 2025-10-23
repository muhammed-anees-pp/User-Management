import React from 'react'
import api from '../api/axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ username, password },{rejectWithValue}) => {
        try {
            const res = await api.post('users/login/', {username,password})
            localStorage.setItem('access',res.data.access)
            localStorage.setItem('refresh',res.data.refresh)

            const profileRes = await api.get('users/me/')
            return profileRes.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed')
            
        }
    }
)


export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            await api.post('users/register/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            return 'success'

        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed')
            
        }
    }
)


export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('users/me/')
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user')
            
        }
    }
)


export const fetchAllUsers = createAsyncThunk(
    'auth/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/users')
            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed To fetch Users')
            
        }
    }
)


const authSlice = createSlice({
    name: 'auth',
    initialState:{
        user: null,
        loading: false,
        error: null,
        registerStatus: null,
        allUsers: [],
    },
    reducers: {
        logout: (state) =>{
            state.user = null
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
        },
    },

    extraReducers: (builder) =>{
        builder
          .addCase(loginUser.pending, (state)=>{
            state.loading = true
            state.error = null
          })

          .addCase(loginUser.fulfilled,(state,action) => {
            state.loading = false
            state.user = action.payload
          })

          .addCase(loginUser.rejected,(state, action) => {
            state.loading = false
            if ( typeof action.payload === 'string'){
                state.error = action.payload
            }else if (action.payload?.detail){
                state.error = action.payload.detail
            }else{
                state.error = 'Invalid Username or Password'
            }
          })

          .addCase(fetchCurrentUser.fulfilled, (state,action) => {
            state.user = action.payload
          })

          .addCase(registerUser.pending, (state) => {
            state.loading = true
            state.error = null
            state.registerStatus = null
          })

          .addCase(registerUser.fulfilled, (state) => {
            state.loading = false
            state.registerStatus = 'success'
          })

          .addCase(registerUser.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.registerStatus = 'failed'
          })

          .addCase(fetchAllUsers.fulfilled, (state,action) => {
            state.allUsers = action.payload
          })
    }
})


export const { logout } = authSlice.actions
export default authSlice.reducer