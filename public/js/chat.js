const url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://rest-server-node-e.herokuapp.com/api/auth/';
 
 let usuario = null;
 let socket = null;

// Referencias HTML

const txUid      = document.querySelector('#txUid');
const txtmensaje = document.querySelector('#txtmensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const btnSalir   = document.querySelector('#btnSalir');
const ulMensajes = document.querySelector('#ulMensajes');



// Validar el token del locar storage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    } );

    const {usuario: userDB , token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;
    
    await conectarSocket();
    
}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('Socket online')
    });
    
    socket.on('disconnect', () =>{
        console.log('Socket offline')
    });

    socket.on('recibir-mensajes', dibujarMensajes );
    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privados', (payload)=>{
       console.log('Privado', payload );
    });
}

const dibujarUsuarios = ( usuarios = []) => {

    let usersHtml = '';
    usuarios.forEach( ({nombre, uid }) => {
        
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre }</h5>
                    <spam class="fs-6 text-muted">${uid}</spam>
                </p>
            </li>  
        `
    });

    ulUsuarios.innerHTML = usersHtml;
    
}

const dibujarMensajes = ( mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        
        mensajesHTML += `
            <li>
                <p>
                    <spam class="text-primary"> ${ nombre }: </spam>
                    <spam>${mensaje}</spam>
                </p>
            </li>  
        `
    });

    ulMensajes.innerHTML = mensajesHTML;
    
}

txtmensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtmensaje.value;
    const uid = txUid.value;

    if( keyCode !== 13 ){ return; }
    if( mensaje.length === 0){ return;}

    socket.emit('enviar-mensajes', {mensaje, uid } );

    txtmensaje.value = ''; 

})

const main = async() => {
    
    // valalidar JWT
    await validarJWT();

}


main();
