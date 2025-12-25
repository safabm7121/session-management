import fs from "fs";
import path from "path";

const file = path.resolve("./db.json");

const load = () => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ users: [], nextId: 1 }, null, 2));
  }
  return JSON.parse(fs.readFileSync(file, "utf-8"));
};

const save = (data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

export const Store = {
  allUsers() {
    return load().users;
  },
  findUserByEmail(email) {
    return load().users.find((u) => u.email === email);
  },
  findUserById(id) {
    return load().users.find((u) => u.id === id);
  },
  createUser(user) {
    const db = load();
    const record = {
      ...user,
      id: db.nextId++,
      refreshTokens: [],
      isActive: true,
    };
    db.users.push(record);
    save(db);
    return record;
  },
  updateUser(id, patch) {
    const db = load();
    const u = db.users.find((u) => u.id === id);
    if (!u) return null;
    Object.assign(u, patch);
    save(db);
    return u;
  },
  deleteUser(id) {
    const db = load();
    const i = db.users.findIndex((u) => u.id === id);
    if (i === -1) return false;
    db.users.splice(i, 1);
    save(db);
    return true;
  },
  addRefreshToken(id, token) {
    const db = load();
    const u = db.users.find((u) => u.id === id);
    if (!u) return false;
    u.refreshTokens.push(token);
    save(db);
    return true;
  },
  revokeRefreshToken(id, token) {
    const db = load();
    const u = db.users.find((u) => u.id === id);
    if (!u) return false;
    u.refreshTokens = u.refreshTokens.filter((t) => t !== token);
    save(db);
    return true;
  },
  revokeAll(id) {
    const db = load();
    const u = db.users.find((u) => u.id === id);
    if (!u) return false;
    u.refreshTokens = [];
    save(db);
    return true;
  },
};
