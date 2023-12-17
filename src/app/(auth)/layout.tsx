import { AuthContextProvider } from "@/context/AuthContext";
import "../globals.css";

const SimpleLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen bg-slate-950 h-screen justify-center items-center">
      {props.children}
    </div>
  );
};

export default SimpleLayout;
