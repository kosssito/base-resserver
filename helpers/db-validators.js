const Role = require('../models/role');
const usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if(!existeRol ){
        throw new Error(`El rol ${ rol } no esta registrado en la DB`)
    }
}

const emailExiste = async( correo = '') => {


    // verificar si el correo existe
    const existeEmail = await usuario.findOne({ correo });
    if ( existeEmail ){
        throw new Error(`El correo: ${ correo } ya esta registrado`)
    }
}
 
const existeUsuarioPorId = async( id ) => {


    // verificar si el ID existe
    const existeUsurario = await usuario.findById(id);
    if ( !existeUsurario ){
        throw new Error(`El id no existe ${ id }`)
    }
}


module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}