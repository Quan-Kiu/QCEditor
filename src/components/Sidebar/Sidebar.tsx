"use client";

import React, { useState } from "react";

import UserCard from "../User/UserCard";
import MyUser from "../User/MyUser";
import { useCoderContext } from "@/context/CoderContext";
import { FloatButton } from "antd";
import Image from "next/image";

type Props = {};

const Sidebar = (props: Props) => {
  const { users } = useCoderContext();
  const [open, setOpen] = useState(false);

  const openClassName = open
    ? `fixed z-10 !w-[200px] left-0 top-0 bottom-0 `
    : "";
  return (
    <>
      <div
        className={
          "sidebar flex flex-col w-0 md:w-sidebar-width bg-slate-950 " +
          openClassName
        }
      >
        <MyUser></MyUser>
        <div className="grid my-4 gap-4 overflow-y-auto grid-cols-2">
          {users?.map((user) => (
            <UserCard key={user.id} user={user}></UserCard>
          ))}
        </div>
      </div>
      <div className="block md:hidden">
        <FloatButton
          type="primary"
          onClick={() => setOpen(!open)}
          icon={
            <Image
              src={open ? "/un-view.png" : "/view.png"}
              width={25}
              height={25}
              alt=""
            ></Image>
          }
        ></FloatButton>
      </div>
    </>
  );
};

export default Sidebar;
