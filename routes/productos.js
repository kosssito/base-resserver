const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
    crearProducto, 
    obtenerProducto, 
    obtenerProductos, 
    actualizarProducto, 
    borarProducto
} = require('../controllers/productos');
const { 
    existeProductoPorId, 
    existeCategoriaPorId, 
    productoExiste, 
    existeCategoriaPorIdsiLoOcupa 
} = require('../helpers/db-validators');

const router = Router();

// {{url}}/api/productos

// obtener todas la productos - publico
router.get('/',obtenerProductos);

//obtener una producto por id - publico 
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de una categoria de Mongo').isMongoId(),
    validarCampos,
    check('categoria').custom( existeCategoriaPorId),
    check('nombre').custom( productoExiste ),
    validarCampos
], crearProducto );

// Actualizar producto - privado - cualquiera con token valido

router.put('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo').isMongoId(),
    validarCampos,
    check('id').custom( existeProductoPorId ),
    check('nombre').custom( productoExiste ),
    check('categoria').custom( existeCategoriaPorIdsiLoOcupa),
    validarCampos
], actualizarProducto
);

// Borrar un producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo valido').isMongoId(),
    //validarCampos,
    check('id').custom( existeProductoPorId ),
    validarCampos
], borarProducto);


module.exports = router;









