import { AuthContextProvider } from "@/context/AuthContext";
import "../globals.css";

const SimpleLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      {props.children}
    </div>
  );
};

export default SimpleLayout;
