const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSingIn, renovarJWT } = require('../controllers/auth');
const { validarCampos, validarJWT } = require('../middlewares');

const router = Router();
// {{url}}/api/auth

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login );

router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSingIn );

router.get('/', validarJWT , renovarJWT );

module.exports = router;