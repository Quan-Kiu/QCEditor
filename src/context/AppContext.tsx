"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";

interface IAppContext {
  loading: boolean;
  setLoading: (ld: boolean) => void;
}

const initData: IAppContext = {
  loading: true,
  setLoading: () => {},
};

const AppContext = createContext<IAppContext>(initData);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props: PropsWithChildren<{}>) => {
  const [loading, setLoading] = useState<boolean>(initData.loading);

  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      {props.children}
    </AppContext.Provider>
  );
};
