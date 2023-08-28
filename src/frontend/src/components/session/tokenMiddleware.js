import {checkTokenExpiration, logoutSuccess, setIntervalId} from "../authSlice"

let intervalId = null

const tokenMiddleware = (store) => (next) => (action) => {
	let {auth} = store.getState()
	if (auth.token && new Date(auth.tokenExpirationTime * 1000) > new Date()) {
		// If token is valid, schedule the next token expiration check
		if (!intervalId) {
			intervalId = setInterval(() => {
				setTimeout(() => {
					store.dispatch(checkTokenExpiration())
				}, 0)
			}, 60000) // check every minute
			store.dispatch(setIntervalId(intervalId))
		}
	} else if (intervalId) {
		clearInterval(intervalId)
		intervalId = null
		store.dispatch(logoutSuccess())
	}

	return next(action)
}

export default tokenMiddleware
