const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');


const esRolValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if(!existeRol ){
        throw new Error(`El rol ${ rol } no esta registrado en la DB`)
    }
}

const emailExiste = async( correo = '') => {


    // verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ){
        throw new Error(`El correo: ${ correo } ya esta registrado`)
    }
}
 
const existeUsuarioPorId = async( id ) => {


    // verificar si el ID existe
    const existeUsurario = await Usuario.findById(id);
    if ( !existeUsurario ){
        throw new Error(`El id no existe ${ id }`)
    }
}

const existeCategoriaPorId = async( id ) => {


    // verificar si el ID  de la categoria existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ){
        throw new Error(`El id no existe ${ id }`)
    }
}

const categoriaExiste = async( nombre = '') => {


    // verificar si la categoria existe
    const existeCategoria = await Categoria.findOne({ nombre });
    if ( existeCategoria ){
        throw new Error(`La categotia: ${ nombre } ya esta registrada`)
    }
}
const existeProductoPorId = async( id ) => {


    // verificar si el ID  del producto existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ){
        throw new Error(`El id no existe ${ id }`)
    }
}

const productoExiste = async( nombre = '') => {


    // verificar si el producto existe
    const existeProducto = await Producto.findOne({ nombre });
    if ( existeProducto ){
        throw new Error(`El producto: ${ nombre } ya esta registrado`)
    }
}

const existeCategoriaPorIdsiLoOcupa = async( id ) => {

    if (id){
        // verificar si el ID  de la categoria existe
        const existeCategoria = await Categoria.findById(id);
        if ( !existeCategoria ){
            throw new Error(`El id no existe ${ id }`)
        }
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    categoriaExiste,
    existeProductoPorId,
    productoExiste,
    existeCategoriaPorIdsiLoOcupa
}