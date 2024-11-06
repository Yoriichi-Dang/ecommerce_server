import jwt, { TokenExpiredError } from 'jsonwebtoken'

type JwtPayload = { username: string; email: string }

const createToken = ({ username, email }: JwtPayload, expiresIn: string): string => {
  const token = jwt.sign({ username, email }, process.env.JWT_SECRET as string, {
    expiresIn
  })
  return token
}
const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { exp: number }
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTime) {
      return null
    }
    return decoded
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return null
    } else {
      return null
    }
  }
}
export { verifyToken, createToken, JwtPayload }
