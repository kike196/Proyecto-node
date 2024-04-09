import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMessages = async () => {
  return prisma.message.findMany({ orderBy: { id: 'asc' } });
};

export const getMessage = async (id) => {
  return prisma.message.findUnique({ where: { id } });
};

export const insertMessage = async (userData) => {
  try {
    return prisma.message.create({ data: userData });
  } catch (error) {
    // Manejar el error de inserción de manera adecuada
    console.error("Error al insertar el mensaje:", error);
    throw error; // Relanzar el error para que el controlador lo maneje
  }
};

export const updateMessage = async (userData) => {
  return prisma.message.update({
    where: { id: userData.id },
    data: {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
    },
  });
};

export const updateMessagePath = async (userData) => {
  return prisma.message.update({
    where: { id: userData.id },
    data: {
      name: userData.name ?? undefined,
      phone: userData.phone ?? undefined,
      email: userData.email ?? undefined,
      message: userData.message ?? undefined,
    },
  });
};

export const deleteMessage = async (id) => {
  return prisma.message.delete({ where: { id } });
};
