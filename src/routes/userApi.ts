import { Router, Request, Response } from "express";
import userModel from "../models/userSchema";
import bcrypt from "bcrypt";
import { createjwt, createRefreshToken } from "../utils/jwtncookie";
import { isAuth } from "./../utils/isAuth";
import { validation } from "./../utils/validation";
import jwt from "jsonwebtoken";

export const userApi = Router();

userApi.get("/", (req: Request, res: Response) => {
  /// Authorization route
  (async () => {
    try {
      const userId = isAuth(req.headers);
      const user = await userModel.findOne({ id: userId });
      res.json(user);
    } catch (err) {
      res.json({ err: err.message });
    }
  })();
});

userApi.post("/register", (req: Request, res: Response) => {
  (async () => {
    try {
      const result = await validation(req.body);
      const user = new userModel({ ...result });
      await user.save();
      res.json({ success: true });
      return;
    } catch (err) {
      res.json({ error: err.message });
      return;
    }
  })();
});

userApi.post("/login", (req: Request, res: Response) => {
  (async () => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("No User found with this Email.");
      }
      let logged;
      await bcrypt.compare(password, user.password).then(function (result) {
        logged = result;
      });
      if (!logged) throw new Error("Incorrect Password");
      res.cookie("jid", createRefreshToken(user.id), { httpOnly: true });
      res.json({ success: "true", token: createjwt(user.id) });
      return;
    } catch (err) {
      res.json({ error: err.message });
    }
  })();
});

userApi.post("/refresh_token", (req: Request, res: Response) => {
  (async () => {
    const token = req.cookies.jid;
    if (!token) res.send("Incorrect token");
    try {
      const payload: any = jwt.verify(
        token,
        process.env.REFRESHTOKENSECRET as string
      );
      if (!payload) {
        throw new Error("Invalid token");
      }
      const user = await userModel.findOne({ id: payload.userId });
      if (!user) {
        throw new Error("Invalid token");
      }
      res.cookie("jid", createRefreshToken(user.id), { httpOnly: true });
      res.json({ success: true, token: createjwt(user.id) });
    } catch (err) {
      res.send({
        error: err.message,
      });
    }
  })();
});
