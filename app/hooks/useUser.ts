import { useContext } from "react";
import { UserContext } from "../firebase/firebaseContext";

export function useUser() {
  const { user } = useContext(UserContext);
  return user;
}
