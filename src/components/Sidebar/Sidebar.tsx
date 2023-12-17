"use client";

import React from "react";

import UserCard from "../User/UserCard";
import MyUser from "../User/MyUser";
import { useCoderContext } from "@/context/CoderContext";

type Props = {};

const Sidebar = (props: Props) => {
  const { users } = useCoderContext();
  return (
    <div className="sidebar flex flex-col w-0 md:w-sidebar-width bg-slate-950">
      <MyUser></MyUser>
      <div className="grid my-4 gap-4 overflow-y-auto grid-cols-2">
        {users?.map((user) => (
          <UserCard key={user.id} user={user}></UserCard>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
