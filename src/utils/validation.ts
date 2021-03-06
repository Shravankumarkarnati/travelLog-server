import bcrypt from "bcrypt";

const saltRounds = 10;

interface InputType {
  username: string;
  password: string;
}

export const validation = async ({ username, password }: InputType) => {
  if (!username || username.length < 5) {
    throw new Error("Invalid Username : Length Must be Atleast 5.");
  } else if (!password || password.length < 5) {
    throw new Error("Invalid Password : Length Must be Atleast 5.");
  }
  return bcrypt.hash(password, saltRounds).then((hash) => {
    return {
      username,
      password: hash,
    };
  });
};
