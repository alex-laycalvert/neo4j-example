import Express from "express";

const router = Express.Router();

import userRouter from "./user.js";

router.use("/user/", userRouter);

export default router;
