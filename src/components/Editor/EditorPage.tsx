"use client";

import { useCallback, useEffect } from "react";
import EditorTabs, { defaultFiles, initFiles } from "./EditorTabs";

import { useAuthContext } from "@/context/AuthContext";
import { User } from "@/types/user";
import { io, Socket } from "socket.io-client";
import { SOCKET_ACTION } from "../../../socketAction";
import "./editor.scss";
import { useCoderContext } from "@/context/CoderContext";
import { FileData } from "@/hooks/useFIleCode";

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
    if (!this.socket) {
      const socket = io("http://localhost:5000", {
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
}

export const socketUtil = new SocketUtil();

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
      initFiles.files = files || defaultFiles;
    });
  }, [data, handleAddUsers]);

  useEffect(() => {
    if (data.isLoggedIn) {
      socketInitializer();
    }
  }, [data.isLoggedIn]);

  return (
    <div className="app-editor h-full bg-slate-800">
      <EditorTabs></EditorTabs>
    </div>
  );
};

export default EditorPage;
