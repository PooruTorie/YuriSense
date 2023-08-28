import {createSlice} from "@reduxjs/toolkit"
import jwt_decode from "jwt-decode"

const initialState = {
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
	tokenExpirationTime: null,
	intervalId: null
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.token = action.payload
			state.isAuthenticated = true
			state.isLoading = false
			state.error = null

			const decodedToken = jwt_decode(action.payload)
			state.tokenExpirationTime = decodedToken.exp
			if (decodedToken.exp < Date.now() / 1000) {
				state.token = null
				state.isAuthenticated = false
			}
		},
		loginFailure: (state, action) => {
			state.token = null
			state.isAuthenticated = false
			state.isLoading = false
			state.error = action.payload.error
			state.tokenExpirationTime = null
		},
		logoutSuccess: (state) => {
			state.token = null
			state.isAuthenticated = false
			state.isLoading = false
			state.error = null
			state.tokenExpirationTime = null
		},
		checkTokenExpiration: (state) => {
			const currentTime = new Date().getTime()
			if (state.tokenExpirationTime && currentTime >= state.tokenExpirationTime * 1000) {
				state.token = null
				state.isAuthenticated = false
				state.tokenExpirationTime = null
			}
		},
		setIntervalId: (state, action) => {
			state.intervalId = action.payload
		}
	}
})

export const {loginSuccess, loginFailure, logoutSuccess, checkTokenExpiration, setIntervalId} = authSlice.actions

export default authSlice.reducer
