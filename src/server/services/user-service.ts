import { findAllUsers } from "../repositories/user-repository";

export async function getAllUsers() {
  return findAllUsers();
}
