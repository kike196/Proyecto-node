import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { 
        title: req.__('Bienvenido') + ' - Enrique.dev', 
        alert: false 
    });
});

router.get('/curriculum', (req, res) => {
    const currentLocale = req.getLocale();
    
    // Definir los archivos posibles
    const cvFiles = {
        en: './src/public/files/Enrique_Aranaga_Resume.pdf',
        es: './src/public/files/Enrique_Aranaga_Currículum.pdf'
    };
    
    // Elegir el archivo según el idioma
    let cvFile = cvFiles[currentLocale] || cvFiles.es;
    
    // Verificar si el archivo existe
    const filePath = path.resolve(cvFile);
    
    if (fs.existsSync(filePath)) {
        // Descargar el archivo si existe
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error al descargar el CV:', err);
                // Fallback al archivo en español
                const fallbackPath = path.resolve(cvFiles.es);
                if (fs.existsSync(fallbackPath)) {
                    res.download(fallbackPath);
                } else {
                    res.status(404).send('CV no encontrado');
                }
            }
        });
    } else {
        // Si el archivo no existe, intentar con el archivo en español
        const fallbackPath = path.resolve(cvFiles.es);
        if (fs.existsSync(fallbackPath)) {
            res.download(fallbackPath);
        } else {
            res.status(404).send('CV no encontrado');
        }
    }
});

router.get('/about', (req, res) => {
    res.render('about', { 
        title: req.__('Acerca de mi') + ' - Enrique.dev' 
    });
});

router.get('/contact', (req, res) => {
    res.render('contact', { 
        title: req.__('Contacto') + ' - Enrique.dev', 
        alert: false 
    });
});


export default router;