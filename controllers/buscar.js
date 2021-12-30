const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto} = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //ture

    if( esMongoID ){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    
    //const usuarios = await Usuario.count( para mostrar la cantidad de resultados
    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex}, { correo: regex}],
        $and: [{ estado: true }]
     });

    return res.json({
        results: usuarios
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //ture

    if( esMongoID ){
        const producto = await Producto.findById(termino)
                                .populate('categoria', 'nombre')
                                .populate('usuario', 'nombre')
        return res.json({
            results: ( producto) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    
    const productos = await Producto.find({ nombre: regex, estado: true })
                            .populate('categoria', 'nombre')
                            .populate('usuario', 'nombre')

    return res.json({
        results: productos
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); //ture

    if( esMongoID ){
        const categoria = await Categoria.findById(termino)
                                .populate('usuario', 'nombre')
        return res.json({
            results: ( categoria) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    
    const categorias = await Categoria.find({ nombre: regex, estado: true })
                                .populate('usuario', 'nombre')

    return res.json({
        results: categorias
    });

}


const buscar = ( req, res = response ) =>{

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ){
        return res.status(400).json({
            msg: `Las colecciones permitias son ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        
        default:
          res.status(500).json({
              msg: 'Se le olvido hacer esta busqueda'
          })
    }

   

}

module.exports = buscar;