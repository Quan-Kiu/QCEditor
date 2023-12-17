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
        <UserAvatar src={user?.avatar}></UserAvatar>
      </div>
      <div className="user-card__name truncate text-center font-semibold cursor-pointer text-xs hover:underline mt-2">
        {user.name}
      </div>
    </div>
  );
};

export default UserCard;
