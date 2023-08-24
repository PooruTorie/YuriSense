import { Router } from 'express'
import TempiAPI from '../tempi_api'
import * as fs from 'fs'

export default class UserRouter {
   static route: string = '/user'
   private readonly router: Router

   constructor(api: TempiAPI) {
      this.router = Router()

      this.router.post('/signup', async (req, res) => {
         const { username, password, isAdmin } = req.body
         if (!username || !password || !isAdmin) {
            return res.sendStatus(400)
         }

         if (isAdmin != (true || false)) {
            return res
               .status(400)
               .json({ error: 'isAdmin is not type boolean' })
         }

         await api.database
            .createUser(username, password, isAdmin)
            .then((result) => {
               console.log('User created:', result)
               res.status(200).json({
                  message: 'User created:' + result,
               })
            })
            .catch((error) => {
               console.error('Error:', error)
            })
      })
   }

   get() {
      return this.router
   }
}