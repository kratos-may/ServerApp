//==========================
//Port
//==========================
process.env.PORT = process.env.PORT|| 3000;
//==========================
//Entorno
//==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//==========================
//Base de datos
//==========================
let urlDB;
if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
//==========================
//JsonWebToken
//==========================
process.env.CADUCIDAD_TOKEN = '48h';
process.env.SEED = process.env.SEED || "secret_key_21459841";
//==========================
//Google config
//==========================
process.env.CLIENT_ID = process.env.CLIENT_ID || "903891432309-8g6ncp2bvs5psi0ir1nia2186bod7qeh.apps.googleusercontent.com"