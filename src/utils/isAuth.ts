var jwt = require("jsonwebtoken");

export const isAuth = (headers: any) => {
  const auth = headers["authorization"];
  // if (!auth) throw new Error("No authoriztion token sent");
  if (!auth) throw new Error("Unauthorized");
  const token = auth.split(" ")[1];
  try {
    var decoded = jwt.verify(token, process.env.JWTSECRET);
    return decoded.userId;
  } catch (err) {
    throw new Error("Invalid Token");
  }
};
