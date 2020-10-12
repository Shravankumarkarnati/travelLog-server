var jwt = require("jsonwebtoken");
import userModel from "./../models/userSchema";

export const isAuth = async (headers: any) => {
  const auth = headers["authorization"];
  console.log(auth, "auth");
  if (!auth) return false;
  const token = auth.split(" ")[1];
  try {
    var decoded = jwt.verify(token, process.env.JWTSECRET);
    const user = await userModel.findOne({ id: decoded.userId });
    if (user) {
      return user;
    }
    return false;
  } catch (err) {
    return false;
  }
};
