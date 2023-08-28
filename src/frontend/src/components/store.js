import {configureStore, getDefaultMiddleware} from "@reduxjs/toolkit"
import {persistStore, persistReducer} from "redux-persist"
import tokenMiddleware from "./session/tokenMiddleware"
import storage from "redux-persist/lib/storage"

import rootReducer from "./reducers"

const persistConfig = {
	key: "root",
	storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: [
		...getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST"]
			}
		}),
		tokenMiddleware
	]
	//enhancers: [composeWithDevTools()]
})

export const persistor = persistStore(store)

persistor.subscribe(() => {
	store.dispatch({type: "auth/checkTokenExpiration"})
})
