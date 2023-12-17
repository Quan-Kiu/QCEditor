"use client";

import { User } from "@/types/user";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IAuthContext {
  data: {
    isLoggedIn: boolean;
    user?: User;
  };
  handleLogin: (name: string) => void;
  handleLogout: () => void;
}

const initData: IAuthContext = {
  data: {
    isLoggedIn: false,
  },
  handleLogin: (name: string) => {},
  handleLogout: () => {},
};

const AuthContext = createContext<IAuthContext>(initData);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = (props: PropsWithChildren<{}>) => {
  const cookies = useCookies();
  const user = cookies.get("user");
  const userParsed = JSON.parse(user || "0");
  const userData: User = userParsed ? userParsed : undefined;

  const [data, setData] = useState<{ user?: User; isLoggedIn: boolean }>({
    user: userData,
    isLoggedIn: !!userData,
  });
  const router = useRouter();

  const handleLogin = (name: string) => {
    const user: User = {
      name,
      avatar: "",
      id:
        new Date().getMilliseconds() +
        Math.floor(Math.random() * (99999999 - 1000000) + 1000000),
    };
    cookies.set("user", JSON.stringify(user));
    router.push("/");
  };

  const handleLogout = () => {
    cookies.remove("user");
    router.push("/");
  };
  return (
    <AuthContext.Provider value={{ data, handleLogin, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
