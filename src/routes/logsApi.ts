import { Router, Request, Response } from "express";
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
      const logs = user.logs.reverse();
      res.json(logs);
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
  (async () => {
    const user = await isAuth(req.headers);
    if (user === false) {
      res.json({
        error: "Invalid Request",
      });
    } else {
      let log = req.body.data;
      user.logs.map(async (cur) => {
        if (cur.id === log.id) {
          try {
            cur.title = log.title;
            cur.description = log.description;
            cur.rating = log.rating;
            cur.visitedDate = log.visitedDate;
            await user.save();
            res.send({ message: "Update Success" });
            return;
          } catch (err) {
            res.send({ error: "Update Failed" });
            return;
          }
        }
      });
    }
    return;
  })();
});

logsApi.delete("/delete/:id", (req: Request, res: Response) => {
  (async () => {
    const user = await isAuth(req.headers);
    if (user === false) {
      res.json({
        error: "Invalid Request",
      });
    } else {
      try {
        const id = req.params.id;
        // eslint-disable-next-line
        user.logs.id(id).remove();
        await user.save();
        res.send({ message: "Delete Success" });
        return;
      } catch (err) {
        res.send({ error: "Delete Failed" });
        return;
      }
    }
    return;
  })();
});
