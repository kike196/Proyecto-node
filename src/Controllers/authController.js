import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res) => {
    try {
        const { name, user, email, phone, pass, confirmPass, 'g-recaptcha-response': grecaptcha } = req.body;
        const rol = 'user';
        if (pass !== confirmPass) {
            return res.status(400).render('register', {
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

        const existingUser = await prisma.user.findFirst({ where: { OR: [{ user }, { email }, { phone }] } });
        if (existingUser) {
            let message = "";
            if (existingUser.user === user) message = "El nombre de usuario ya está registrado.";
            if (existingUser.email === email) message = "El correo electrónico ya está registrado.";
            if (existingUser.phone === phone) message = "El número de teléfono ya está registrado.";
            return res.status(400).render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: message,
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

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${grecaptcha}`, {
            method: 'POST'
        });
        const data = await response.json();

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

        await prisma.user.create({ data: userData });
        return res.status(200).render('login', {
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

        const existingUser = await prisma.user.findFirst({ where: { user } });
        if (!existingUser || !(await bcryptjs.compare(pass, existingUser.pass))) {
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

        const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
        });

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
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                return res.redirect('/login');
            }
            req.user = user;
            return next();
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
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRETO);
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!user) {
                req.dbConnection = db;
                return next();
            }
            req.user = user;
            req.dbConnection = db;
            return next();
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        req.dbConnection = db;
        return next();
    }
};

export const logout = (req, res) => {
    res.clearCookie('jwt');
    return res.redirect('/');
};
