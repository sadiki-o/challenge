import { Dispatch, SetStateAction, createContext } from "react";

interface IContext {
  auth: {
    username: string;
    email: string;
    userId: number | undefined;
  };
  setAuth: Dispatch<
    SetStateAction<{ username: string; email: string; userId: undefined }>
  >;

  currentlyLoadedFile: any; // as json data
  setCurrentlyLoadedFile: Dispatch<SetStateAction<any>>;
  
}

export const ETLContext = createContext<IContext | null>(null);
