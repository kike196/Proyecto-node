import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import indexRoutes from "./routes/index.js";

const app = express();

//sirve para tener de forma dinámica la ruta absoluta 
const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);
//console.log('views', join(__dirname, 'views'));

//join proporciona el \ delimitador para unir las rutas de acceso, concatedena evitando problemas entre sistemas operativos 
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(indexRoutes);

app.use(express.static(join(__dirname, 'public')));


const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`Server is listening on port ${PORT}...`)