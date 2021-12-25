const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        this.usariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //conectar a base de datos
        this.conectarDB();



        //Middlewares
        this.middlewares();

        
        // rutas de mi applicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //cors
        this.app.use(cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        //directorio publico
        this.app.use( express.static('public') );
    }

    routes(){

        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.usariosPath, require('../routes/usuarios'));
       
    }


    listen(){
        this.app.listen(this.port, ()=> {
            console.log('Servidor corriendo en puerto', this.port);
        } );
    }



}


module.exports = Server;
