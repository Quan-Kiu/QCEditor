"use client";

import { socketUtil } from "@/components/Editor/EditorPage";
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
import { SOCKET_ACTION } from "../../socketAction";

interface IAuthContext {
  data: {
    isLoggedIn: boolean;
    user?: User;
  };
  handleLogin: (data: Partial<User>) => void;
  handleLogout: () => void;
}

const initData: IAuthContext = {
  data: {
    isLoggedIn: false,
  },
  handleLogin: (data: Partial<User>) => {},
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

  const handleLogin = (data: Partial<User>) => {
    const user: User = {
      id:
        new Date().getMilliseconds() +
        Math.floor(Math.random() * (99999999 - 1000000) + 1000000),
      name: data.name as string,
      avatar: data.avatar || "",
    };
    cookies.set("user", JSON.stringify(user));
    setData({
      isLoggedIn: true,
      user,
    });
    router.push("/");
  };

  const handleLogout = () => {
    cookies.remove("user");
    setData({
      isLoggedIn: false,
      user: undefined,
    });
    socketUtil.socket.disconnect();
    router.refresh();
  };
  return (
    <AuthContext.Provider value={{ data, handleLogin, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
