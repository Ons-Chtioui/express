const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    email: {
      type: String,
      required: [true, "L'email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Adresse email invalide']
    },
    // Champ mot de passe ajouté tp4
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    role: {
      type: String,
      enum:{
        values: ['user', 'admin'],
        message:'{VALUE} n\'est pas un rôle autorisé'

      }, 

      default: 'user'
    },
    age: {
      type: Number,
      min: [4, "L'âge minimum est de 4 ans"]
    },
   
    // Nouveaux champs demandés dans la question 1
    bio: {
      type: String,
      maxlength: [200, 'La biographie ne peut pas dépasser 200 caractères']
    },
    phone: {
      type: String,
      match: [/^\d{8}$/, 'Numéro de 8 chiffres requis']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);