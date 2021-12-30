const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
    crearCategoria, 
    obtenerCategoria, 
    obtenerCategorias, 
    actualizarCategoria, 
    borarCategoria,
    obtenerCategoriasEliminadas,
    avilitarCategoria
} = require('../controllers/categorias');
const { existeCategoriaPorId, categoriaExiste } = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/categorias

// obtener todas la categorias - publico
router.get('/',obtenerCategorias);

//obtener una categoria por id - publico 
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria );

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token valido

router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    check('nombre').custom( categoriaExiste ),
    validarCampos
], actualizarCategoria
);

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borarCategoria);

// obtener todas la categorias - publico
router.patch('/',obtenerCategoriasEliminadas);
// Avilitar una categoria borrada - Admin
router.patch('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], avilitarCategoria);



module.exports = router;
