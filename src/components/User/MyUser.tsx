import { useAuthContext } from "@/context/AuthContext";
import UserAvatar from "./UserAvatar";

type Props = {};

const MyUser = (props: Props) => {
  const { data } = useAuthContext();
  return (
    <>
      <div className="my-user p-4 flex items-center h-navbar-height  gap-2">
        <UserAvatar src={data.user?.avatar} width={20} height={20}></UserAvatar>
        <div className="name text-xs font-semibold uppercase">
          {data.user?.name}
        </div>
      </div>
      <div className="h-[0.1px] bg-slate-800"></div>
    </>
  );
};

export default MyUser;
