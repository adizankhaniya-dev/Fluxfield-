import { client } from "../index";

export const CreateUser = async (
  email: string,
  hashPassword: string,
  name: string,
) => {
  return await client.user.create({
    data: {
      email: email,
      password: hashPassword,
      name: name,
    },
  });
};

export const getuserByEmail = async (email: string) => {
  return await client.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const findById = async (id: string) => {
  return await client.user.findUnique({
    where: {
      id: id,
    },
  });
};
