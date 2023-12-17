"use client";

import Sidebar from "@/components/Sidebar/Sidebar";
import { useAppContext } from "@/context/AppContext";
import { Spin } from "antd";
import { PropsWithChildren } from "react";

const CodeEditorLayout = ({ children }: PropsWithChildren) => {
  const { loading } = useAppContext();
  return (
    <Spin size="large" spinning={loading}>
      <main className="relative flex flex-row w-screen h-screen">
        <Sidebar></Sidebar>
        <div className="page flex-1 flex-shrink-0">{children}</div>
      </main>
    </Spin>
  );
};

export default CodeEditorLayout;
