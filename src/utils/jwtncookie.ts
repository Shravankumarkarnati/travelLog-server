import jwt from "jsonwebtoken";

export const createjwt = (userId: any) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWTSECRET as string,
    { expiresIn: "15m" }
  );
};

export const createRefreshToken = (userId: any, exp?: string) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.REFRESHTOKENSECRET as string,
    { expiresIn: exp || "7d" }
  );
};
