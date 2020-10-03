import jwt from "jsonwebtoken";

export const createjwt = (userId: any) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWTSECRET as string,
    { expiresIn: "1h" }
  );
};

export const createRefreshToken = (userId: any) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.REFRESHTOKENSECRET as string,
    { expiresIn: "7d" }
  );
};
