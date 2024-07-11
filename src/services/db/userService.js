const UserModel = require("../models/user.model.js");
const logger = require("../../utils/logger.js");

class UserService {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
  async getUsers() {
    try {
      const users = await UserModel.find({}, "first_name email rol role");
      return users;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  }
  async deleteUser(id) {
    try {
      const user = await UserModel.findByIdAndDelete(id);

      if (!user) {
        logger.warning("No se encuentra");
        return null;
      }

      logger.info("Usuario eliminado correctamente!");
      return user;
    } catch (error) {
      throw new Error("Error");
    }
  }
  async modifyUserRole(id, role) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { role: role },
        { new: true }
      );

      if (!user) {
        logger.error("Usuario no encontrado");
        return null;
      }

      logger.info("Rol del usuario actualizado con éxito");
      return user;
    } catch (error) {
      logger.error("Error al actualizar el rol del usuario", error);
      throw error;
    }
  }
}

module.exports = UserService;
