import "./chat.css"
import Send from "../../res/icons/send.svg?react";
import Person from "../../res/icons/person.svg?react";
import Back from "../../res/icons/back.svg?react";
import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

type ChatWindowPrpos = {
    socket: Socket | null;
    back: () => void,
    uid: string,
    messages: { uid: string, message: string }[]
    setMessages: React.Dispatch<React.SetStateAction<{ uid: string, message: string }[]>>;
}
export default function ChatWindow({ back, messages, uid, setMessages, socket }: ChatWindowPrpos) {
    const messageInputRef = useRef<HTMLDivElement>(null)
    const chatBody = useRef<HTMLDivElement>(null)
    const [disabled, setDisabled] = useState<boolean>(true);
    const [canSend, setCanSend] = useState<boolean>(false);

    let shiftKey: boolean = false
    useEffect(() => {
        if (chatBody.current) {
            chatBody.current.scrollTop = chatBody.current.scrollHeight
        }
    }, [messages.length])

    const handleSendMessage = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (messageInputRef.current && socket) {
            const msg = messageInputRef.current.innerText
            if (!msg.trim()) return
            setMessages(prev => [...prev, { uid, message: msg }])
            console.log('msg', msg)
            socket.emit("message", msg)
            messageInputRef.current.innerText = ""
            setDisabled(true)
            setCanSend(false)
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.shiftKey && !shiftKey) {
            shiftKey = !shiftKey
        }
        if (messageInputRef.current && socket && e.key === "Enter" && !shiftKey) {
            e.preventDefault()
            const msg = messageInputRef.current.innerText
            if (!msg.trim()) return
            setMessages(prev => [...prev, { uid, message: msg }])
            console.log('msg', msg)
            socket.emit("message", msg)
            messageInputRef.current.innerText = ""
            setCanSend(false)
        }
        shiftKey = false
    }

    const handleOnHover = () => {
        if (messageInputRef.current?.innerText.trim() !== "") {
            setDisabled(false)
        }
    }

    return <div className="chat">
        <div className="header">
            {/* header */}
            <div onClick={back} style={{ cursor: "pointer" }}>
                <Back fill="white" width={30} height={30} />
            </div>
            <h2 style={{ flex: 1, textAlign: 'center', color: 'white' }}>Message</h2>
        </div>
        <div className="chat-body-wrapper" ref={chatBody}>
            {/* body */}
            {messages.map((msg, idx) => uid === msg.uid ?
                <div key={idx} className={`chat-bubble ${uid === msg.uid ? 'chat-bubble-me' : 'chat-bubble-other'}`} >
                    <p>{msg.message}</p>
                </div> : <div key={idx} className="visitor-chat-message-row">
                    <div className="visitor-avatar">
                        <Person />
                    </div>
                    <div className={`chat-bubble ${uid === msg.uid ? 'chat-bubble-me' : 'chat-bubble-other'}`} >
                        <p>{msg.message}</p>
                    </div>
                </div>)}
        </div>
        <div className="footer">
            {/* footer */}
            {/* <input style={{ fontSize: 16 }} ref={messageInputRef} onKeyDown={handleOnEnter} type="text" placeholder="Type your message..." /> */}
            <div className="inputBox">
                <div className="input-wrapper">
                    <div onKeyDown={handleKeyDown} onKeyUp={() => setCanSend(messageInputRef.current?.innerText.trim() !== "")} style={{ outline: 'none', wordBreak: 'break-word', minHeight: '1.25rem' }} ref={messageInputRef} contentEditable="plaintext-only" role="textbox" aria-label="History is on" data-ph="Type your message" aria-multiline="true" spellCheck="true">
                    </div>
                </div>
            </div>
            <div onClick={handleSendMessage} className="send-button-wrapper" onMouseOver={handleOnHover} onMouseLeave={() => setDisabled(true)} style={{ backgroundColor: disabled ? "transparent" : "#f1f1f1", cursor: !disabled ? "pointer" : "default" }}>
                <Send fill={`${canSend ? "#218aff" : "#bdc1c6"}`} style={{ marginLeft: 5, transition: "all 200ms ease-in-out" }} width={30} height={30} />
            </div>
        </div>
    </div>
}