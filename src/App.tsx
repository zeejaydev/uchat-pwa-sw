import { useEffect, useState } from 'react'
import PWABadge from './PWABadge.tsx'
import { useAppContext } from './stores/appContext.tsx'
import Loading from "./res/icons/loading.svg?react"
import LoginScreen from './screens/login/loginScreen.tsx'
import Conversations from './screens/conversations/conversationList.tsx'
function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const { agent } = useAppContext()

  useEffect(() => {
    setLoading(false)
  }, [agent])

  return loading
    ? <Loading stroke="black" />
    : !agent
      ? <LoginScreen />
      : <>
        <Conversations />
        <PWABadge />
      </>
}

export default App
