const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next )=>{

    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que corresponde al uid 
        const usuario = await Usuario.findById( uid );

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en DB'
            })
        }

        //verificar si el usuario tiene su estado en true
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }


        req.usuario = usuario;
        next();
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
        
    }

}

const comprobarJWT = async( token = '' ) => {
    
    try {

        if( token.length < 10 ){
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const usuario = await Usuario.findById( uid );

        if ( usuario ){
            if( usuario.estado ){
                return usuario
            }else{
                return null;
            }
        }else{
            return null;
        }

        
    } catch (error) {
        return null;
    }
}


module.exports = {
    validarJWT,
    comprobarJWT
}
