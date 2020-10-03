import { Router, Request, Response } from "express";
import logModel from "./../models/logSchema";

export const logsApi = Router();

logsApi.get("/", (_: Request, res: Response) => {
  (async () => {
    const logs = await logModel.find();
    res.json(logs);
  })();
});

logsApi.post("/create", (req: Request, res: Response) => {
  const log = new logModel(req.body);
  (async () => {
    const logged = await log.save();
    res.json(logged);
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
