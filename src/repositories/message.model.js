import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMessages = async () => {
  return await prisma.message.findMany({ orderBy: { id: 'asc' } });
};

export const getMessage = async (id) => {
  return await prisma.message.findUnique({ where: { id: parseInt(id) } });
};

export const insertMessage = async (userData) => {
  try {
    return prisma.message.create({ data: (userData) });
  } catch (error) {
    // Manejar el error de inserción de manera adecuada
    console.error("Error al insertar el mensaje:", error);
    throw error; // Relanzar el error para que el controlador lo maneje
  }
};

export const updateMessage = async (userData) => {
  return await prisma.message.update({
    where: { id: parseInt(userData.id) },
    data: {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
    },
  });
};

export const updateMessagePath = async (userData) => {
  return await prisma.message.update({
    where: { id: parseInt(userData.id) },
    data: {
      name: userData.name ?? undefined,
      phone: userData.phone ?? undefined,
      email: userData.email ?? undefined,
      message: userData.message ?? undefined,
    },
  });
};

export const deleteMessage = async (id) => {
  return await prisma.message.delete({ where: { id: parseInt(id) } });
};
