import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfigs from '../../config/auth'

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailOrPasswordIncorrect = () => {
      return response.status(400).json({
        error: 'Make sure your password or email are correct',
      })
    }

    if (!(await schema.isValid(request.body))) {
      return userEmailOrPasswordIncorrect()
    }

    const { email, password } = request.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      return userEmailOrPasswordIncorrect()
    }

    if (!(await user.checkPassword(password, User.password_hash))) {
      return userEmailOrPasswordIncorrect()
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id }, authConfigs.secret, {
        expiresIn: authConfigs.expiresIn,
      }),
    })
  }
}

export default new SessionController()
