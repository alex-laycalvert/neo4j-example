import Express from "express";
import * as controller from "../controllers/user.js";

const router = Express();

router.route("/").get((req, res) => {
    res.redirect("/api/user/all");
});

router.route("/all").get(async (req, res) => {
    try {
        const users = await controller.getAllUsers();
        res.status(200).json({
            data: users,
        });
    } catch (e) {
        res.status(500).json(e);
    }
});

router.route("/new").post(async (req, res) => {
    try {
        const { firstName, lastName, job } = req.body;
        if (!firstName || !lastName || !job) {
            res.status(400).json({
                message: "must have valid firstName, lastName, and job",
            });
            return;
        }
        const createdUser = await controller.createUser({
            firstName,
            lastName,
            job,
        });
        if (!createdUser) {
            res.status(500).json({
                message: "error creating user",
            });
            return;
        }
        res.status(200).json({
            data: createdUser,
        });
    } catch (e) {
        res.status(500).json(e);
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({
                    message: "must be a valid id",
                });
                return;
            }
            const user = await controller.getUserById(id);
            res.status(200).json({
                data: user,
            });
        } catch (e) {
            res.status(500).json(e);
        }
    })
    .put(async (req, res) => {
        try {
            let update = {
                id: req.params.id,
                type: req.body.type,
            };
            switch (update.type) {
                case "PROPERTY":
                    update.key = req.body.key;
                    update.value = req.body.value;
                    break;
                case "RELATIONSHIP":
                    update.relatedId = req.body.relatedId;
                    update.relationship = req.body.relationship;
                    break;
                default:
                    break;
            }
            const user = await controller.updateUser(update);
            if (!user) {
                res.status(500).json({
                    message: "error updating user",
                });
                return;
            }
            res.status(200).json({
                data: user,
            });
        } catch (e) {
            res.status(500).json(e);
        }
    })
    .delete();

router.route("*").get((req, res) => res.redirect("/api/user"));

export default router;
