import { Router, Request, Response } from "express";
import userModel from "../models/userSchema";
import bcrypt from "bcrypt";
import { createjwt, createRefreshToken } from "../utils/jwtncookie";
import { validation } from "./../utils/validation";
import jwt from "jsonwebtoken";

export const userApi = Router();

userApi.post("/login", (req: Request, res: Response) => {
  (async () => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        const result = await validation(req.body);
        const newUser = new userModel({ ...result });
        await newUser.save();
        res.cookie("jid", createRefreshToken(newUser.id), { httpOnly: true });
        res.json({
          success: "true",
          token: createjwt(newUser.id),
        });
      } else {
        let logged;
        await bcrypt.compare(password, user.password).then(function (result) {
          logged = result;
        });
        if (!logged) throw new Error("Incorrect Password");
        res.cookie("jid", createRefreshToken(user.id), { httpOnly: true });
        res.json({
          success: "true",
          token: createjwt(user.id),
        });
      }
      return;
    } catch (err) {
      res.json({ error: err.message });
    }
  })();
});

userApi.post("/logout", (req: Request, res: Response) => {
  (async () => {
    const token = req.cookies.jid;
    if (!token) {
      return;
    }
    try {
      const payload: any = jwt.verify(
        token,
        process.env.REFRESHTOKENSECRET as string
      );
      if (!payload) {
        return;
      }
      const user = await userModel.findOne({ id: payload.userId });
      if (!user) {
        return;
      }
      res.cookie("jid", createRefreshToken(user.id, "0s"), { httpOnly: true });

      res.json({
        success: true,
        token: null,
        username: null,
      });
      return;
    } catch (err) {
      res.send({
        error: err.message,
      });
      return;
    }
  })();
});

userApi.post("/refreshtoken", (req: Request, res: Response) => {
  (async () => {
    const token = req.cookies.jid;
    if (!token) {
      res.send("Invalid token");
      return;
    }
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

      res.json({
        success: true,
        token: createjwt(user.id),
        username: user.username,
      });
      return;
    } catch (err) {
      res.send({
        error: err.message,
      });
      return;
    }
  })();
});
