import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { pool } from '../repositories/dbConnection.js';

//procedimiento para registrarnos
export const register = async (req, res) => {    
    try {
        const { name, user, pass } = req.body;
        const rol = 'user';
        const passHash = await bcryptjs.hash(pass, 8);
        
        await pool.query('INSERT INTO users2 SET ?', { user, name, pass: passHash, rol });
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }       
};

export const login = async (req, res) => {
    try {
        const { user, pass } = req.body;

        if (!user || !pass) {
            return res.render('login', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login',
                title: 'Login'
            });
        }

        const [results] = await pool.query('SELECT * FROM users2 WHERE user = ?', [user]);
        if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
            return res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o Password incorrectas",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login',
                title: 'Login'
            });
        }

        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        });

        //console.log("TOKEN: " + token + " para el USUARIO : " + user);

        const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };
        res.cookie('jwt', token, cookiesOptions);
        res.render('login', {
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: 'success',
            showConfirmButton: false,
            timer: 800,
            ruta: 'dashboard',
            title: 'Login'
        });
    } catch (error) {
        console.log(error);
    }
};

export const isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            const [results] = await pool.query('SELECT * FROM users2 WHERE id = ?', [decodificada.id]);
            if (!results) { return next(); }
            req.user = results[0];
            return next();
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        res.redirect('/login');        
    }
};

export const isLogged = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            const [results] = await pool.query('SELECT * FROM users2 WHERE id = ?', [decodificada.id]);
            if (!results) { return next(); }
            req.user = results[0];
            return next();
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        return next();  
    }
};

export const logout = (req, res) => {
    res.clearCookie('jwt');   
    return res.redirect('/');
};
