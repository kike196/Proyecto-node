import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Verificar la conexión a la base de datos
prisma.$connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  })
  .finally(async () => {
    // Cerrar la conexión después de la verificación
    await prisma.$disconnect();
  });
