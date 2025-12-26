import fs from "fs";
import path from "path";

const pathDb = path.join(process.cwd(), "db.json");

function ensure() {
  if (!fs.existsSync(pathDb)) {
    const init = {
      realms: [{ id: 1, name: "default", nextUserId: 1, users: [] }],
      nextRealmId: 2,
    };
    fs.writeFileSync(pathDb, JSON.stringify(init, null, 2));
  }
}

export const Store = {
  load() {
    ensure();
    return JSON.parse(fs.readFileSync(pathDb, "utf-8"));
  },
  save(db) {
    fs.writeFileSync(pathDb, JSON.stringify(db, null, 2));
  },
  getRealm(db, name) {
    return db.realms.find((r) => r.name === name);
  },
  createRealm(db, name) {
    const exists = db.realms.find((r) => r.name === name);
    if (exists) return exists;
    const realm = { id: db.nextRealmId++, name, nextUserId: 1, users: [] };
    db.realms.push(realm);
    return realm;
  },
};
