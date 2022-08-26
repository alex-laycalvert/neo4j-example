import { v4 as uuid } from "uuid";
import { getDriver } from "../utils/neo4j.js";

export const getUserById = async (id) => {
    try {
        const driver = getDriver();
        const session = driver.session({
            database: "neo4j",
        });
        const query = `
            MATCH (u:USER {
                id: '${id}'
            })
            RETURN u
        `;
        const result = await session.readTransaction((tx) => tx.run(query));
        const user = result.records?.[0] ? result.records[0].get("u") : null;
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getUser = async (firstName, lastName) => {
    try {
        const driver = getDriver();
        const session = driver.session({
            database: "neo4j",
        });
        const query = `
            MATCH (u:USER {
                firstName: '${firstName}',
                lastName: '${lastName}'
            })
            RETURN u
        `;
        const result = await session.readTransaction((tx) => tx.run(query));
        const user = result.records?.[0] ? result.records[0].get("u") : null;
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getAllUsers = async () => {
    try {
        const driver = getDriver();
        const session = driver.session({
            database: "neo4j",
        });
        const query = `
            MATCH (u:USER)
            RETURN u
        `;
        const result = await session.readTransaction((tx) => tx.run(query));
        const users = result.records
            ? result.records.map((record) => record.get("u"))
            : [];
        return users;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const createUser = async (newUser) => {
    try {
        const driver = getDriver();
        const session = driver.session({
            database: "neo4j",
        });
        const userExists = await getUser(newUser.firstName, newUser.lastName);
        if (userExists) return userExists;
        const query = `
            MERGE (u:USER {
                id: '${uuid()}',
                firstName: '${newUser.firstName}',
                lastName: '${newUser.lastName}',
                job: '${newUser.job}'
            })
            RETURN u
        `;
        const result = await session.writeTransaction((tx) => tx.run(query));
        const user = result.records?.[0] ? result.records[0].get("u") : null;
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateUser = async (update) => {
    try {
        const driver = getDriver();
        const session = driver.session({
            database: "neo4j",
        });
        let query = `
            MATCH (u:USER{
                id: '${update.id}'
            })
        `;
        switch (update.type) {
            case "PROPERTY":
                query += `SET u.${update.key} = '${update.value}'`;
                break;
            case "RELATIONSHIP":
                query += `
                    MATCH (r:USER {
                        id: '${update.relatedId}'
                    })
                    MERGE (u)-[:${update.relationship}]->(r)
                `;
                break;
            default:
                break;
        }
        query += `RETURN u`;
        const result = await session.writeTransaction((tx) => tx.run(query));
        const user = result.records?.[0] ? result.records[0].get("u") : null;
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteUser = async (req, res) => {};
