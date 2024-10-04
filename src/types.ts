import { Dispatch, SetStateAction } from "react";

type Agent = {
  uid: string;
  avatar: string | null;
  firstName: string;
  lastName: string;
  password: string;
};

type AppContextT = {
  agent: Agent | null;
  setAgent: Dispatch<SetStateAction<Agent | null>>;
};

export type { Agent, AppContextT };
