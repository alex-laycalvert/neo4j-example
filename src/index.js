import dotenv from "dotenv/config";
import Express from "express";
import neo4j from "neo4j-driver";
import router from "./routes/index.js";

const { PORT, NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE } =
    process.env;

const start = async () => {
    const app = Express();
    const n4jDriver = neo4j.driver(
        NEO4J_URI,
        neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
    );
    const n4jSession = n4jDriver.session({ database: NEO4J_DATABASE });

    app.use("/api", Express.urlencoded({ extended: true }));
    app.use("/api", Express.json());
    app.use("/api", router);

    app.listen(PORT, () => {
        console.log(`Express Server listening on port ${PORT}`);
    });
};
start();
