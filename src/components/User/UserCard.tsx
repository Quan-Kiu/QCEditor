import { settings } from "@/settings";
import Image from "next/image";
import React from "react";
import UserAvatar from "./UserAvatar";
import { User } from "@/types/user";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="user-card flex flex-col items-center">
      <div className="user-card_avatar">
        <UserAvatar
          className="w-[65px] h-[65px]"
          src={user?.avatar}
        ></UserAvatar>
      </div>
      <div
        title={user.name}
        className="user-card__name truncate w-[80px] text-center font-semibold cursor-pointer text-xs hover:underline mt-3"
      >
        {user.name}
      </div>
    </div>
  );
};

export default UserCard;
