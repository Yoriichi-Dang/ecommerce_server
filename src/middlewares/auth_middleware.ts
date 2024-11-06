import { JwtPayload, verifyToken } from '@/utils/auth/jwt'
import { NextFunction, Request, Response } from 'express'

class AuthMiddleware {
  verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      res.status(401).send('Token is required')
      return
    }

    try {
      const decoded: JwtPayload | null = verifyToken(token)
      if (!decoded) {
        res.status(401).send('Invalid token')
        return
      }
      req.body.decoded = decoded
      next()
    } catch {
      res.status(401).send('Invalid token')
      return
    }
  }
}
export default AuthMiddleware
