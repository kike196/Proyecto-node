import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async () => {
  return await prisma.user.findMany({ orderBy: { id: 'asc' } });
};

export const getUser = async (id) => {
  try {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    throw new Error(`Error fetching user: ${error.message}`);
  }
};


export const insertUser = async (userData) => {
  return await prisma.user.create({ data: parseInt(userData) });
};

export const updateUser = async (userData) => {
  return await prisma.user.update({
    where: { id: parseInt(userData.id) },
    data: {
      name: userData.name,
      phone: userData.phone,
      email: userData.email
    }
  });
};

export const updateUserPath = async (userData) => {
  return await prisma.user.update({
    where: { id: parseInt(userData.id) },
    data: {
      name: userData.name ?? undefined,
      user: userData.user ?? undefined,
      phone: userData.phone ?? undefined,
      email: userData.email ?? undefined,
      pass: userData.pass ?? undefined,
      rol: userData.rol ?? undefined
    }
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id: parseInt(id) } });
};
