import { Router } from "express";
import { logsApi } from "./logsApi";
import { userApi } from "./userApi";

const router = Router();

router.use("/logs", logsApi);
router.use("/user", userApi);

export default router;
