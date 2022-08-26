import dotenv from "dotenv/config";
import Express from "express";
import router from "./routes/index.js";
import { initDriver } from "./utils/neo4j.js";

const { PORT, NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE } =
    process.env;

const start = async () => {
    const app = Express();
    initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD);

    app.use("/api", Express.urlencoded({ extended: true }));
    app.use("/api", Express.json());
    app.use("/api", router);

    app.listen(PORT, () => {
        console.log(`Express Server listening on port ${PORT}`);
    });
};
start();
