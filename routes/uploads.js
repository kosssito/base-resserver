const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivosSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitias } = require('../helpers');


const router = Router();

router.post( '/', validarArchivosSubir, cargarArchivo );

router.put( '/:coleccion/:id',[ 
    validarArchivosSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitias( c, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary );
//], actualizarImagen )

router.get ('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitias( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen );


module.exports = router;