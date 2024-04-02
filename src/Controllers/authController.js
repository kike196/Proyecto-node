import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { pool } from '../repositories/dbConnection.js';
import * as usersModel from "../repositories/users.model.js";

//procedimiento para registrarnos
export const register = async (req, res) => {    
    try {
        const { name, user, email, phone, pass, confirmPass, 'g-recaptcha-response': grecaptcha  } = req.body;
        const rol = 'user';
        if (pass !== confirmPass) {
            return res.status(400).render( 'register', {  
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Las contraseñas no coinciden",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'Register' 
            });
        }
        const passHash = await bcryptjs.hash(pass, 8);

        const userData = { user, name, email, phone, pass: passHash, rol }

        // Obtener desde la base de datos la lista de usuarios
        const users = await usersModel.getUsers();

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${grecaptcha}`, {
            method: 'POST'
        });
        const data = await response.json();

        // Validar que todos los campos obligatorios estén presentes
        if (!user || !name || !email || !phone || !pass) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Todos los campos son obligatorios.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }

        // Verificar si algún usuario ya tiene el correo electrónico proporcionado
        const userAlreadyExists = users.some(existingUser => existingUser.user === user);
        if (userAlreadyExists) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ya ese nombre de usuario esta registrado.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }

        // Validar el formato del correo electrónico con regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Por favor, proporcione un correo electrónico válido.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }

        // Verificar si algún usuario ya tiene el correo electrónico proporcionado
        const emailAlreadyExists = users.some(user => user.email === email);
        if (emailAlreadyExists) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ya ese correo electrónico esta registrado.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }
        
        // Si se proporciona un número de teléfono, validar su formato con regular expression
        if (phone) {
            const phoneRegex = /^(\+?\d{1,3}\s?)?((\(\d{2,5}\))|\d{2,5})[-.\s]?\d{2,5}[-.\s]?\d{2,5}[-.\s]?\d{2,5}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).render('register', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Por favor, proporcione un número de teléfono válido.",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'register',
                    title: 'register'
                });
            }
        }

        // Verificar si algún usuario ya tiene el número de teléfono proporcionado
        const phoneAlreadyExists = users.some(user => user.phone === phone);
        if (phoneAlreadyExists) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Ya ese número de teléfono esta registrado.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }

        // Validar reCAPTCHA
        if (!grecaptcha) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Por favor, complete el reCAPTCHA.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }

        if (!data.success) {
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "Error en la validación de reCAPTCHA.",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }

        try {
            await usersModel.insertUser(userData);
            return res.status(200).render( 'login', {  
                alert: true,
                alertTitle: "Bienvenido",
                alertMessage: "¡Cuenta creada exitosamente!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: 'login',
                title: 'login' 
            });
        } catch (error) {
            console.error('Error al registrarse:', error);
            return res.status(500).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "¡Hubo un error al registrar el usuario!",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                title: 'register'
            });
        }
        
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

        const [results] = await pool.query('SELECT * FROM users WHERE user = ?', [user]);
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
            title: 'dashboard'
        });
    } catch (error) {
        console.log(error);
    }
};

export const isAuthenticated = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [decodificada.id]);
            if (!results) { 
                return res.redirect('/login');
            }

            req.user = results[0];

            if (req.user.rol === 'Admin' || req.user.rol === 'admin') {
                return next();
            } else if (req.user.rol === 'user') {
                return next();
            } else {
                return res.redirect('/login');
            }
        } catch (error) {
            console.log(error);
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && (req.user.rol === 'Admin' || req.user.rol === 'admin')) {
      return next();
    } else {
        return res.status(403).redirect('/');
      //return res.status(403).json({ message: 'Acceso prohibido' }); 
    }
};

export const isLogged = async (req, res, next) => {
    let db = true;
    if (req.cookies.jwt) {
        try {
            const decodificada = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            const [results] = await pool.query('SELECT * FROM users WHERE id = ?', [decodificada.id]);
            if (!results) { 
                req.dbConnection = db;
                return next(); 
            }
            req.user = results[0];
            req.dbConnection = db;
            return next();
        } catch (error) {
            console.log(error);
            return next();
        }
    } else if (pool) {
        pool.getConnection()
            .then((connection) => {
                console.log('Conexión exitosa a la base de datos');
                // Si la conexión es exitosa, libera la conexión inmediatamente
                connection.release();
                req.dbConnection = db;
                return next(); 
            })
            .catch((error) => {
                console.error('Error al conectar a la base de datos:', error.message);
                db = false;
                req.dbConnection = db;
                return next();  
            });
    }
};


export const logout = (req, res) => {
    res.clearCookie('jwt');   
    return res.redirect('/');
};
