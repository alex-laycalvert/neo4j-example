import Express from "express";
import * as controller from "../controllers/user.js";

const router = Express();

router.route("/").get(controller.getAllUsers);
router.route("/all").get(controller.getAllUsers);
router.route("/new").post(controller.createUser);
router
    .route("/:id")
    .get(controller.getUser)
    .post(controller.updateUser)
    .delete(controller.deleteUser);

export default router;
