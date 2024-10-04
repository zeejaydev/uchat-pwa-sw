import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Agent, AppContextT } from "../types";

const Context = createContext<AppContextT>({
    agent: null,
    setAgent: () => { }
})

export default function AppContext({ children }: Readonly<{
    children: ReactNode;
}>) {
    const [agent, setAgent] = useState<Agent | null>(null)
    useEffect(() => {
        const savedAgent = localStorage.getItem('uchat-agent')
        if (savedAgent) {
            const parsedAgent = JSON.parse(savedAgent)
            setAgent(parsedAgent)
        }
    }, [])


    return <Context.Provider value={{ agent, setAgent }}>
        {children}
    </Context.Provider>
}

export function useAppContext() {
    return useContext(Context)
}