const { response } = require("express");

const { Categoria } = require('../models')


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
 
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
             .populate('usuario', 'nombre')
             .skip( Number(desde ))
             .limit(Number( limite ))
    ]);
      
     res.json({
         total,
         categorias
     });
 }

// obtenerCategoria - populate  
const obtenerCategoria = async(req, res = response ) =>{
    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);


}

const crearCategoria = async( req, res = response )=>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre }, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //Guardar DB
    await categoria.save();

    res.status(201).json( categoria );

}

// actualizarCategoria 
const actualizarCategoria = async(req, res = response ) => {
    
    const {id} = req.params;
    // destruccturamos lo que no queremos cambiar, y todo lo demas lo almacenamos en la data
    const {estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id,  data, {new: true}).populate('usuario', 'nombre');

    res.json(categoria);
}


// borarCategoria - estadofalse
const borarCategoria = async(req, res = response ) => {
    
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});

    res.json(categoriaBorrada);
}

// mostrar categorias borradas
const obtenerCategoriasEliminadas = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: false };
 
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
             .populate('usuario', 'nombre')
             .skip( Number(desde ))
             .limit(Number( limite ))
    ]);
      
     res.json({
         total,
         categorias
     });
 }

 // avilitarCategoria - estado true
 const avilitarCategoria = async(req, res = response ) => {
    
    const { id } = req.params;
    const {nombre, ...data } = req.body;

    const categoriaAvilitada = await Categoria.findByIdAndUpdate(id, {estado: true}, {new: true});

    res.json(categoriaAvilitada);
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borarCategoria,
    obtenerCategoriasEliminadas,
    avilitarCategoria
}