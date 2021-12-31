const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extencionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) =>{
        
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length -1 ];

     //validar la extencion
    if( !extencionesValidas.includes(extension) ){
        return reject( `La extencion ${ extension } no es permitida, solo se permite: ${ extencionesValidas }`);      
    }
  

    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );

    archivo.mv(uploadPath, (err) => {
        if (err) {
            reject(err);
        }

        resolve(uploadPath);
    });
    });

    

}


module.exports = {
    subirArchivo
}
