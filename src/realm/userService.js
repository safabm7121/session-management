import bcrypt from "bcrypt";
import { Store } from "../storage/store.js";
import { Errors } from "../core/errors.js";
import { RealmService } from "./realmService.js";

export const UserService = {
  getAll(realmName = "default") {
    const { realm } = RealmService.getRealmOrThrow(realmName);
    return realm.users.map(({ passwordHash, refreshTokens, ...safe }) => safe);
  },

  getById(realmName, id) {
    const { realm } = RealmService.getRealmOrThrow(realmName);
    return realm.users.find((u) => u.id === id) || null;
  },

  create(realmName, { email, password, name, roles = ["user"] }) {
    const { db, realm } = RealmService.getRealmOrThrow(realmName);
    if (realm.users.find((u) => u.email === email))
      throw Errors.Conflict("Email exists");
    const user = {
      id: realm.nextUserId++,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      name,
      roles,
      refreshTokens: [],
      isActive: true,
    };
    realm.users.push(user);
    Store.save(db);
    const { passwordHash, refreshTokens, ...safe } = user;
    return safe;
  },

  validate(realmName, email, password) {
    const { realm } = RealmService.getRealmOrThrow(realmName);
    const user = realm.users.find((u) => u.email === email);
    if (!user) return null;
    const ok = bcrypt.compareSync(password, user.passwordHash);
    return ok ? user : null;
  },

  addRefreshToken(realmName, userId, token) {
    const { db, realm } = RealmService.getRealmOrThrow(realmName);
    const user = realm.users.find((u) => u.id === userId);
    if (!user) throw Errors.NotFound("User not found");
    user.refreshTokens.push(token);
    Store.save(db);
    return true;
  },

  revokeRefreshToken(realmName, userId, token) {
    const { db, realm } = RealmService.getRealmOrThrow(realmName);
    const user = realm.users.find((u) => u.id === userId);
    if (!user) throw Errors.NotFound("User not found");
    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    Store.save(db);
    return true;
  },

  delete(realmName, id) {
    const { db, realm } = RealmService.getRealmOrThrow(realmName);
    const i = realm.users.findIndex((u) => u.id === id);
    if (i === -1) return false;
    realm.users.splice(i, 1);
    Store.save(db);
    return true;
  },
};
