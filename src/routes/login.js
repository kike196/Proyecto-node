import express from 'express';
import jwt from 'jsonwebtoken';
import keys from '../settings/keys.js'; // Importar las claves

const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', (req, res) => {
    // Verificar credenciales de inicio de sesión
    if (req.body.usuario == 'admin' && req.body.clave == '12345') {
        const payload = {
            check: true
        };

        // Utilizar la clave importada
        const key = keys.key;

        // Firmar el token JWT
        const token = jwt.sign(payload, key, {
            expiresIn: 86400 // expira en 24 horas
        });

        res.json({
            message: 'AUTENTICACIÓN EXITOSA!',
            token: token
        });
    } else {
        // Respuesta en caso de credenciales incorrectas
        res.json({
            message: 'USUARIO O CONTRASEÑA INCORRECTOS'
        });
    }
});

// Middleware para verificar token
const verificacion = express.Router();

verificacion.use((req, res, next)=>{
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (!token) {
        // Respuesta si no hay token proporcionado
        res.status(401).send({
            error: 'Es necesario un token de autorización'
        })
        return
    } 
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (token) {
        // Verificar el token JWT
        jwt.verify(token, keys.key, (error, decoded)=> {
            if (error) {
                // Respuesta si el token no es válido
                return res.json({
                    message: 'el token no es valido'
                });
            } else {
                // Pasar la decodificación del token al siguiente middleware
                req.decoded = decoded;
                next();
            }
        })
    }
})

// Ruta protegida que requiere verificación de token
router.use('/info', verificacion, (req, res) => {
    res.json('INFORMACIÓN IMPORTANTE ENTREGADA');
});

export default router;
