import { FormEvent, useRef, useState } from "react"
import "./login.css"
import { useAppContext } from "../../stores/appContext"
import { Agent } from "../../types"

export default function LoginScreen() {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const { setAgent } = useAppContext()
    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!usernameRef.current || !passwordRef.current) {
            alert("Unable to detect input elements")
        }
        else if (!usernameRef.current?.value.trim() || !passwordRef.current?.value.trim()) {
            alert("Username or password is empty")
        }
        else if (usernameRef.current && passwordRef.current) {
            // const username = usernameRef.current.value
            const password = passwordRef.current.value
            setLoading(prev => !prev)
            const data = await fetch(`https://zeejaydevbackend.com/api/uchat/login`)
            const resp = await data.json()
            if (resp.success) {
                const agent: Agent = { avatar: "", firstName: "test", lastName: "test", password, uid: "" }
                setAgent(agent)
                localStorage.setItem("uchat-agent", JSON.stringify(agent))
            } else {
                alert('login failed')
            }
            setLoading(prev => !prev)
            console.log('ss', resp)
        }
    }

    return <div className="login">
        <form onSubmit={submitForm}>
            <h1 style={{ textAlign: 'center' }}>Login</h1>
            <div className="inputs-wrapper">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="username">Username</label>
                    <input ref={usernameRef} required id="username" type="text" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="password">Password</label>
                    <input ref={passwordRef} required id="password" type="password" />
                </div>

            </div>
            <button type="submit">{loading ? 'Loading...' : 'Login'}</button>
        </form>
    </div>
}