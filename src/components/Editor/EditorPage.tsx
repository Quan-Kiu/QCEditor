"use client";

import { useCallback, useEffect } from "react";
import EditorTabs from "./EditorTabs";

import { useAuthContext } from "@/context/AuthContext";
import { User } from "@/types/user";
import { io, Socket } from "socket.io-client";
import { SOCKET_ACTION } from "../../../socketAction";
import "./editor.scss";
import { useCoderContext } from "@/context/CoderContext";
import { FileData, LanguageEditor } from "@/hooks/useFIleCode";
import { cloneDeep } from "lodash";

export const defaultFiles = [
  {
    lang: LanguageEditor.HTML,
    label: LanguageEditor.HTML,
    isMain: true,
    content: `
<main class="page">
   <div>
       Chào mừng đến với
       <strong>
         QCEditor
       </strong>
       <div>
        🌟🌟🌟🌟🌟🌟
       </div>
   </div>
 </main>`,
  },
  {
    lang: LanguageEditor.SASS,
    label: LanguageEditor.SASS,

    isMain: true,
    content: `
*{
  padding: 0;
  margin: 0;
  box-sizing:border-box;
}

.page{
  background:#020617;
  color: white;
  display:flex;
  justify-content:center;
  align-items:center;
  width: 100vw;
  height: 100vh;
  & > div{
    font-size: 32px;
    font-weight: 500;
    text-align: center;
    strong{
      display: block;
      margin-block: 8px;
      font-size: 38px
    }
  }

}
    `,
  },
  {
    lang: LanguageEditor.JS,
    label: LanguageEditor.JS,

    isMain: true,
    content: "",
  },
];

export interface SOCKET_JOIN_DATA {
  roomId: string;
  user: User;
}

type Props = {};

const DEFAULT_ROOM = "quankiu";

class SocketUtil {
  socket!: Socket;
  constructor() {}

  init() {
    const socket = io("https://qceditor.onrender.com", {
      transports: ["websocket"],
      path: "/socket",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    this.socket = socket;
  }
}

export const socketUtil = new SocketUtil();

class InitFiles {
  files: FileData[] = [];
  constructor() {
    this.files = [];
  }

  setFiles(files: FileData[]) {
    this.files = files || cloneDeep(defaultFiles);
  }
}

export const initFiles = new InitFiles();

const EditorPage = (props: Props) => {
  const { data } = useAuthContext();
  const { handleAddUsers } = useCoderContext();

  const socketInitializer = useCallback(async () => {
    socketUtil.init();
    socketUtil.socket.on("connect", () => {
      const joinData: SOCKET_JOIN_DATA = {
        roomId: DEFAULT_ROOM,
        user: data.user as User,
      };
      socketUtil.socket.emit(SOCKET_ACTION.JOIN, joinData);
    });
    socketUtil.socket.on(SOCKET_ACTION.JOIN_SUCCESS, (users: User[]) => {
      handleAddUsers(users);
    });
    socketUtil.socket.on(SOCKET_ACTION.LEAVE, (users: User[]) => {
      handleAddUsers(users);
    });
    socketUtil.socket.on(SOCKET_ACTION.NEW_USERS, (users: User[]) => {
      handleAddUsers(users);
    });
    socketUtil.socket.on(SOCKET_ACTION.INIT_FILES, (files: FileData[]) => {
      initFiles.setFiles(files);
    });
  }, [data, handleAddUsers]);

  useEffect(() => {
    if (!!data.user) {
      socketInitializer();
    }

    return () => {
      socketUtil.socket.off("connect");
      socketUtil.socket.off(SOCKET_ACTION.JOIN_SUCCESS);
      socketUtil.socket.off(SOCKET_ACTION.LEAVE);
      socketUtil.socket.off(SOCKET_ACTION.NEW_USERS);
      socketUtil.socket.off(SOCKET_ACTION.INIT_FILES);
    };
  }, [data.user]);

  return (
    <div className="app-editor h-full bg-slate-800">
      <EditorTabs></EditorTabs>
    </div>
  );
};

export default EditorPage;
