const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const {registerUser, loginUser, getUserProfile,getAllUsers,updatePassword,updateUserRole} = require('../controller/userController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
// Routes pour l'API /api/users
router.get('/', protect, adminOnly, getAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-password', protect, updatePassword);
router.put('/:id/role', protect, adminOnly, updateUserRole); // Exercice 2 (Admin)
router.get('/profile', protect, getUserProfile);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;