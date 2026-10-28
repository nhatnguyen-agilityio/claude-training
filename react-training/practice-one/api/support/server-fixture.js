// Shared setup for the API tests (kept out of test/ because `node --test` runs
// every file in a test directory). It runs server.js on a temporary copy of
// db.json, so the real seed data is never touched.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SERVER_PATH = path.join(__dirname, "..", "server.js");
const SEED_DB = path.join(__dirname, "..", "db.json");

// Copies db.json to a temp dir, lets `changeDb(db)` edit the copy, starts a
// fresh server on a free port and returns its URL plus a function to stop it.
const startTestServer = async (changeDb = () => {}) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "api-test-"));
    const dbFile = path.join(tmpDir, "db.json");

    const db = JSON.parse(fs.readFileSync(SEED_DB, "utf8"));
    changeDb(db);
    fs.writeFileSync(dbFile, JSON.stringify(db));

    // Load a fresh server so its router reads this test's copy
    process.env.DB_FILE = dbFile;
    delete require.cache[require.resolve(SERVER_PATH)];
    const { server } = require(SERVER_PATH);

    const httpServer = await new Promise((resolve) => {
        const listening = server.listen(0, () => resolve(listening));
    });

    const close = async () => {
        await new Promise((resolve) => httpServer.close(resolve));
        delete process.env.DB_FILE;
        fs.rmSync(tmpDir, { recursive: true, force: true });
    };

    return { baseUrl: `http://localhost:${httpServer.address().port}`, close };
};

module.exports = { startTestServer };
