const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/errorHandler");
const { generateToken } = require("../services/authService");
const UserService = require("../services/UserService");

class UserController {
  async register(request, response, next) {
    const { name, email, password, role } = request.body;  

    if (!name || !email || !password) {
      return next(new AppError("Tous les champs sont requis", 400));
    }

    try {
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser) return next(new AppError("Cet email est déjà utilisé", 400));

      const hashedPassword = await bcrypt.hash(password, 10); 
      const user = await UserService.createUser({ 
        name, 
        email, 
        password: hashedPassword, 
        role: role || 'user'  
      });

      const token = generateToken(user.id, user.role);  
      response.status(201).json({ token });
    } catch (error) {
      console.error(error);
      next(new AppError("Erreur lors de l'inscription", 500));
    }
  }

  async login(request, response, next) {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(new AppError("Email et mot de passe sont requis", 400));
    }

    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) return next(new AppError("Utilisateur introuvable", 404));

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return next(new AppError("Mot de passe incorrect", 401));

      const token = generateToken(user.id, user.role); 
      response.status(200).json({ token });
    } catch (error) {
      next(new AppError("Erreur lors de la connexion", 500));
    }
  }

  async changePassword(request, response, next) {
    const { oldPassword, newPassword } = request.body;
    const userId = request.user?.id;

    if (!userId) {
      return next(new AppError("Utilisateur non authentifié", 401));
    }

    if (!oldPassword || !newPassword) {
      return next(new AppError("Les anciens et nouveaux mots de passe sont requis", 400));
    }

    try {
      const user = await UserService.getUserById(userId);
      if (!user) return next(new AppError("Utilisateur non trouvé", 404));

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) return next(new AppError("Mot de passe incorrect", 401));

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      response.status(200).json({ message: "Mot de passe changé avec succès" });
    } catch (error) {
      next(new AppError("Erreur lors du changement de mot de passe", 500));
    }
  }

  async getAllUser(request, response, next) {
    try {
      const users = await UserService.getAllUser();
      response.json(users);
    } catch (error) {
      next(new AppError("Erreur lors de la récupération des utilisateurs", 500));
    }
  }

  async getUserById(request, response, next) {
    try {
      const user = await UserService.getUserById(request.params.id);
      if (!user) return next(new AppError("Utilisateur introuvable", 404));

      response.json(user);
    } catch (error) {
      next(new AppError("Erreur lors de la récupération de l'utilisateur", 500));
    }
  }

  async updateUser(request, response, next) {
    try {
      const user = await UserService.updateUser(request.params.id, request.body);
      response.json(user);
    } catch (error) {
      next(new AppError("Erreur lors de la modification de l'utilisateur", 500));
    }
  }

  async deleteUser(request, response, next) {
    try {
      await UserService.deleteUser(request.params.id);
      response.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      next(new AppError("Erreur lors de la suppression de l'utilisateur", 500));
    }
  }
}

module.exports = new UserController();
