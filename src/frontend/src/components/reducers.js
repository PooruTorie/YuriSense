import {combineReducers} from "redux"
import authSliceReducer from "./authSlice"

const rootReducer = combineReducers({
	auth: authSliceReducer
})

export default rootReducer
