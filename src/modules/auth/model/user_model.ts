/**
 * Represents a user in the ecommerce application.
 *
 * @typedef {Object} UserModel
 * @property {string} id - The unique identifier for the user.
 * @property {string} email - The email address of the user.
 * @property {string} password_hash - The hashed password of the user.
 * @property {string} phone - The phone number of the user.
 * @property {string} username - The username of the user.
 * @property {string} full_name - The full name of the user.
 * @property {string} address - The address of the user.
 * @property {string} district - The district where the user resides.
 * @property {string} province - The province where the user resides.
 * @property {string} gender - The gender of the user.
 * @property {Date} day_of_birth - The birth date of the user.
 * @property {string} avatar_url - The URL to the user's avatar image.
 * @property {Date} created_at - The date and time when the user was created.
 * @property {Date} modifield_at - The date and time when the user was created.
 */
type UserModel = {
  id?: string
  email: string
  password_hash: string
  phone: string
  username: string
  full_name?: string
  address?: string
  district?: string
  province?: string
  gender?: string
  day_of_birth?: Date
  avatar_url?: string
  created_at?: Date
  modified_at?: Date
}
export default UserModel
