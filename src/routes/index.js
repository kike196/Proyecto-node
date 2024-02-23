import { Router } from "express";

const router = Router();

//estamos enviando objetos desde el backend usando pares clave valor, al ser variables pueden tener cualquier nombre, title o titulo 
router.get('/', (req, res) => {
    res.render('index', {title: 'My first web with Node,js'});
});

router.get('/about', (req, res) => {
    res.render('about', {title: 'About me'});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: 'Contact page'});
});

export default router