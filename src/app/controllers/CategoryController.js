import * as Yup from 'yup'

import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { name } = request.body
    const { filename: path } = request.file

    const CategoryExists = await Category.findOne({
      where: {
        name,
      },
    })

    if (CategoryExists) {
      return response.status(400).json({ error: 'Category already exists' })
    }

    const { id } = await Category.create({ name, path })

    return response.json({ name, id })
  }

  async index(request, response) {
    const category = await Category.findAll()

    return response.json(category)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { name } = request.body
    const { id } = request.params

    const category = Category.findByPk(id)

    if (!category) {
      return response.status(401).json('Make sure your category id is correct')
    }

    let path
    if (request.file) {
      path = request.file.filename
    }

    await Category.update(
      { name, path },
      {
        where: { id },
      },
    )

    return response.status(200).json()
  }
}

export default new CategoryController()
