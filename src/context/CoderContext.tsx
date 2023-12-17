"use client";

import { User } from "@/types/user";
import { PropsWithChildren, createContext, useContext, useState } from "react";

interface ICoderContext {
  users: User[];
  handleAddUsers: (user: User[]) => void;
  handleAddUser: (user: User) => void;
}

const initData: ICoderContext = {
  users: [],
  handleAddUsers: (users: User[]) => {},
  handleAddUser: (user: User) => {},
};

const CoderContext = createContext<ICoderContext>(initData);

export const useCoderContext = () => useContext(CoderContext);

export const CoderContextProvider = (props: PropsWithChildren<{}>) => {
  const [data, setData] = useState<User[]>([]);

  const handleAddUsers = (users: User[]) => {
    setData(users);
  };

  const handleAddUser = (user: User) => {
    setData((pre) => {
      pre.push(user);
      return pre;
    });
  };

  return (
    <CoderContext.Provider
      value={{ users: data, handleAddUsers, handleAddUser }}
    >
      {props.children}
    </CoderContext.Provider>
  );
};
