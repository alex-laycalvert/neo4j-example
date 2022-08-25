import neo4j from "neo4j-driver";

let driver;

export const initDriver = async (uri, username, password) => {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    return await driver.verifyConnectivity();
};

export const closeDriver = () => {
    return driver && driver.close();
};

export const getDriver = () => {
    return driver;
};
