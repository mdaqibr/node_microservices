const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/', (req, res) => {
  res.send('User route works!');
});

router.post('/validate', userController.validate)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', authMiddleware, userController.profile);

module.exports = router;
