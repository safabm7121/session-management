import bcrypt from "bcrypt";
import { Store } from "../storage/store.js";

const list = (req, res) => {
  res.json(
    Store.allUsers().map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      roles: u.roles,
      isActive: u.isActive,
    }))
  );
};

const get = (req, res) => {
  const u = Store.findUserById(Number(req.params.id));
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json({
    id: u.id,
    email: u.email,
    name: u.name,
    roles: u.roles,
    isActive: u.isActive,
  });
};

const create = async (req, res) => {
  const { email, password, name, roles } = req.body;
  if (Store.findUserByEmail(email))
    return res.status(409).json({ error: "Email exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const u = Store.createUser({
    email,
    passwordHash,
    name,
    roles: roles || ["user"],
  });
  res
    .status(201)
    .json({ id: u.id, email: u.email, name: u.name, roles: u.roles });
};

const update = (req, res) => {
  const u = Store.updateUser(Number(req.params.id), req.body);
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json({
    id: u.id,
    email: u.email,
    name: u.name,
    roles: u.roles,
    isActive: u.isActive,
  });
};

const changePassword = async (req, res) => {
  const id = Number(req.params.id);
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Missing password" });
  const passwordHash = await bcrypt.hash(password, 10);
  const u = Store.updateUser(id, { passwordHash });
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
};

const remove = (req, res) => {
  const ok = Store.deleteUser(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.json({ success: true });
};

export { list, get, create, update, changePassword, remove };
