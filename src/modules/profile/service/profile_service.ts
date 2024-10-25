import UserDto from '../dto/user_dto'
import UserModel from '../model/user_model'
import ProfileRepository from '../repository/profile_repository'

class ProfileService {
  private profileRepository: ProfileRepository
  constructor() {
    this.profileRepository = new ProfileRepository()
  }
  async getProfile(email: string): Promise<UserDto> {
    const user_model: UserModel = await this.profileRepository.findUserByEmail(email)
    const user_dto: UserDto = {
      email: user_model.email,
      phone: user_model.phone,
      username: user_model.username,
      full_name: user_model.full_name,
      address: user_model.address,
      district: user_model.district,
      province: user_model.province,
      gender: user_model.gender,
      day_of_birth: user_model.day_of_birth,
      avatar_url: user_model.avatar_url
    }
    return user_dto
  }
  async updatePassword(email: string, password: string): Promise<boolean> {
    const result: boolean = await this.profileRepository.updateUserPassword(email, password)
    return result
  }
  async updateAvatar(email: string, avatar_url: string): Promise<boolean> {
    const result = await this.profileRepository.updateAvatarByEmail(email, avatar_url)
    return result
  }
  async updateProfile(email: string, payload: UserModel): Promise<UserDto | undefined> {
    const user_model: UserModel | undefined = await this.profileRepository.updateUserByEmail(email, payload)
    if (!user_model) {
      return undefined
    }
    const user_dto: UserDto = {
      email: user_model.email,
      phone: user_model.phone,
      username: user_model.username,
      full_name: user_model.full_name,
      address: user_model.address,
      district: user_model.district,
      province: user_model.province,
      gender: user_model.gender,
      day_of_birth: user_model.day_of_birth,
      avatar_url: user_model.avatar_url
    }
    return user_dto
  }
}
export default ProfileService
