import express from "express";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Enrique.dev' });
});

router.get('/curriculum', (req, res) => {
    res.download('./src/public/files/CV-Enrique.pdf');
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About me' });
});

router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact page' });
});


export default router;
