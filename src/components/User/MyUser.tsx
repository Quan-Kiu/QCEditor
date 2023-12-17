import { useAuthContext } from "@/context/AuthContext";
import UserAvatar from "./UserAvatar";
import Image from "next/image";

type Props = {};

const MyUser = (props: Props) => {
  const { data, handleLogout } = useAuthContext();
  return (
    <>
      <div className="my-user p-4 flex justify-between items-center h-navbar-height gap-2">
        <div className="flex items-center gap-2">
          <UserAvatar
            className="w-[20px] h-[20px]"
            src={data.user?.avatar}
            width={20}
            height={20}
          ></UserAvatar>
          <div className="name truncate w-[100px] text-xs font-semibold uppercase">
            {data.user?.name}
          </div>
        </div>
        <Image
          className="cursor-pointer"
          width={15}
          height={15}
          alt=""
          onClick={handleLogout}
          src={"/logout.png"}
        ></Image>
      </div>
      <div className="h-[0.1px] bg-slate-800"></div>
    </>
  );
};

export default MyUser;
