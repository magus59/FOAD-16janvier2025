const { where } = require("sequelize");
const User = require("../models/User");

class UserService {
  async getAllUser() {
    return await User.findAll();
  }

  async getUserById(userId) {
    return await User.findByPk(userId);
  }

  async createUser(user) {
    const { name, email, password, role = "user" } = user;
    return await User.create({
      name,
      email,
      password,
      role,
    });
  }

  async updateUser(id, user) {
    return await User.update(user, {
      where: {
        ID_User: id,
      },
    });
  }

  async deleteUser(id) {
    return await User.destroy({
      where: {
        ID_User: id,
      },
    });
  }

  async getUserByEmail(email) {
    return await User.findOne({
      where: { email },
    });
  }
}

module.exports = new UserService();
