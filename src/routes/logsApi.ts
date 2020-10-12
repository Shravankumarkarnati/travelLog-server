import { Router, Request, Response } from "express";
import logModel from "./../models/logSchema";
import { isAuth } from "./../utils/isAuth";

export const logsApi = Router();

logsApi.get("/", (req: Request, res: Response) => {
  (async () => {
    const user = await isAuth(req.headers);
    if (user === false) {
      res.json({
        error: "Invalid Request",
      });
    } else {
      res.json(user.logs);
    }
    return;
  })();
});

logsApi.post("/create", (req: Request, res: Response) => {
  (async () => {
    const user = await isAuth(req.headers);
    if (user === false) {
      res.json({
        error: "Invalid Request",
      });
    } else {
      const allLogs = user.logs;
      allLogs.push(req.body.data);
      const saved = await user.save();
      res.json({
        logs: saved.logs,
      });
      return saved;
    }
    return;
  })();
});

logsApi.post("/update", (req: Request, res: Response) => {
  let log = req.body;
  const id = log._id;
  delete log._id;
  (async () => {
    const wut = await logModel.findByIdAndUpdate(id, { ...log });
    res.send(wut);
  })();
});

logsApi.delete("/delete/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  (async () => {
    const del = await logModel.deleteOne({ _id: id });
    res.json(del);
  })();
});
