import { Request, Response } from 'express'
import ProfileService from '../service/profile_service'
import UserDto from '../dto/user_dto'
import UserModel from '../model/user_model'
import { hashPassword } from '@/utils/auth/password'

class ProfileController {
  private profileService: ProfileService
  constructor() {
    this.profileService = new ProfileService()
  }
  getProfile = async (req: Request, res: Response): Promise<void> => {
    const decoded = req.body.decoded
    const user_dto: UserDto = await this.profileService.getProfile(decoded.email)
    if (!user_dto) {
      res.status(404).send({ message: 'User not found' })
      return
    }
    res.status(200).send(user_dto)
  }
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const decoded = req.body.decoded
    const payload = req.body
    const user_model: UserModel = {
      email: payload.email,
      phone: payload.phone,
      username: payload.username,
      full_name: payload.full_name,
      address: payload.address,
      district: payload.district,
      province: payload.province,
      gender: payload.gender,
      day_of_birth: payload.day_of_birth,
      avatar_url: payload.avatar_url,
      password_hash: ''
    }
    const user_dto: UserDto | undefined = await this.profileService.updateProfile(decoded.email, user_model)
    if (!user_dto) {
      res.status(400).send({ message: 'Error updating user profile' })
      return
    }
    res.status(200).send(user_dto)
  }
  updatePassword = async (req: Request, res: Response): Promise<void> => {
    const decoded = req.body.decoded
    const password = req.body.password
    const hash_password = await hashPassword(password)
    const result = await this.profileService.updatePassword(decoded.email, hash_password)
    if (!result) {
      res.status(400).send({ message: 'Error updating password' })
      return
    }
    res.status(200).send({ message: 'Password updated successfully' })
  }
  updateAvatar = async (req: Request, res: Response): Promise<void> => {
    const decoded = req.body.decoded
    const avatar_url = req.body.avatar_url
    const result = await this.profileService.updateAvatar(decoded.email, avatar_url)
    if (!result) {
      res.status(400).send({ message: 'Error updating avatar' })
      return
    }
    res.status(200).send({ message: 'Avatar updated successfully' })
  }
}
export default ProfileController
