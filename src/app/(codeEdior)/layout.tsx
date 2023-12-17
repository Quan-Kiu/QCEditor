import Sidebar from "@/components/Sidebar/Sidebar";
import { PropsWithChildren } from "react";

const CodeEditorLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative flex flex-row w-screen h-screen">
      <Sidebar></Sidebar>
      <div className="page flex-1 flex-shrink-0">{children}</div>
    </main>
  );
};

export default CodeEditorLayout;
