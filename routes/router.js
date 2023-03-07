const express = require('express');
const router = express.Router();
const HomeController = require('../controller/HomeController');
const UserController = require('../controller/UserController');
const UserAuth = require('../_middleware/AdminAuth');

router.get('/', HomeController.index);

router.post('/login', UserController.login);
router.post('/user', UserAuth, UserController.create);
router.get('/users', UserAuth, UserController.findAll);
router.get('/user/:id', UserController.findById);
router.post('/edituser', UserAuth, UserController.update);
router.delete('/user/:id', UserAuth, UserController.delete)

router.post('/newpassword', UserController.recoverPassword);
router.post('/registernewpassword', UserController.registerNewPassword);

module.exports = router;

