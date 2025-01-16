const { z } = require("zod");

exports.userSchema = z.object({
    email: z.string().email("L'email est invalide").min(1, "L'email est requis"),  
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").min(1, "Le mot de passe est requis") 
});
