import { Store } from "../storage/store.js";
import { Errors } from "../core/errors.js";

export const RealmService = {
  ensureRealm(name = "default") {
    const db = Store.load();
    let realm = Store.getRealm(db, name);
    if (!realm) {
      realm = Store.createRealm(db, name);
      Store.save(db);
    }
    return { db, realm };
  },
  getRealmOrThrow(name = "default") {
    const db = Store.load();
    const realm = Store.getRealm(db, name);
    if (!realm) throw Errors.NotFound("Realm not found");
    return { db, realm };
  },
};
