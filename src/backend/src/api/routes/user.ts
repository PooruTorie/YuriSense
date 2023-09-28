import { Router } from 'express'
import * as argon2 from 'argon2'
import YurisenseAPI from '../yurisense_api'

export default class UserRouter {
   static route: string = '/user'
   private readonly router: Router

   constructor(api: YurisenseAPI) {
      this.router = Router()
      this.router.post(
         '/signup',
         api.auth.authenticateToken,
         async (req, res) => {
            if (!req.user) {
               return res.json({ error: 'token_invalide' })
            }

            const { email, password, firstName, lastName, phone, admin } =
               req.body
            if (
               !password ||
               !email ||
               !firstName ||
               !lastName ||
               !phone ||
               typeof admin == 'undefined'
            ) {
               res.json({ error: 'parameter_missing' })
               return
            }

            if (req.user.admin) {
               return res.json({
                  error: 'no_permission',
               })
            }

            const user = await api.database.user.getByEmail(email)
            if (user) {
               return res.json({
                  error: 'email_duplicate',
               })
            }

            await api.database.user
               .create(email, password, admin, firstName, lastName, phone)
               .then((id) => {
                  res.json({ message: 'User created', userId: id })
               })
               .catch((error) => {
                  console.error('Error:', error)
                  res.json({ error: 'internal_error' })
               })
         },
      )

      this.router.post('/signin', async (req, res) => {
         const { email, password } = req.body
         if (!email || !password) {
            return res.json({ error: 'parameter_missing' })
         }
         const retryData = await api.database.login_retries.getRetryDataByIP(
            req.ip,
         )
         if (retryData) {
            const lastRetryDate = new Date(retryData.lastRetry)
            const waitTimeSeconds = retryData.waitTimeMinutes * 60
            const now = new Date()
            const timeElapsed =
               (now.getTime() -
                  -now.getTimezoneOffset() * 60 * 1000 -
                  lastRetryDate.getTime()) /
               1000
            if (timeElapsed < waitTimeSeconds) {
               return res.json({
                  error: 'waittime_not_over',
                  timeElapsed,
               })
            } else {
               api.database.login_retries.decrememtRetryCount(req.ip)
            }
         }
         const user = await api.database.user.getByEmail(email)
         if (!user) {
            return res.json({ error: 'user_not_found' })
         }
         if (!(await argon2.verify(user.password, password))) {
            if (retryData) {
               if (retryData.retries + 1 == 4) {
                  api.database.login_retries.initWaitTime(req.ip)
               }
               await api.database.login_retries.incrementRetryCount(req.ip)
            } else {
               await api.database.login_retries.createIP(req.ip) // Create retry data for failed attempt
            }
            return res.json({ error: 'login_failed' })
         }
         const userData = {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: email,
            admin: user.admin,
         }
         const token = api.auth.createToken(userData, '8h')
         if (!token) {
            return res.json({ error: 'internal_error' })
         }
         await api.database.login_retries.resetRetryCount(req.ip)
         return res.json({
            yuriToken: token,
         }) // expires in 8h after creation
      })

      this.router.post(
         '/signout',
         api.auth.authenticateToken,
         async (req, res) => {
            if (!req.user) {
               return res.json({ error: 'token_invalide' })
            }
            api.auth.revokeToken(req.user)
            return res.json({
               message: `Token from ${req.user.email} has been revoked`,
            })
         },
      )
   }

   get() {
      return this.router
   }
}
