import { useEffect, useState } from "react"
import "./conversations.css"
import { io, Socket } from "socket.io-client"
import { useDelayUnmount } from "../../utils"
import ChatWindow from "../chat/chatWindow"

export default function Conversations() {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connectedClients, setConnectedClients] = useState<string[]>([])
    const [room, setRoom] = useState<string | null>(null)
    const [messages, setMessages] = useState<{ uid: string, message: string }[]>([])
    const showDiv = useDelayUnmount((room !== null && room !== ""), 350);
    useEffect(() => {
        if (socket) return
        let ws: Socket
        try {
            ws = io("ws://localhost:6001?company=zeejaydev&agent=true");
            setSocket(ws)
        } catch (error) {
            console.log(error)
        }

        return () => {
            console.log('clean up')
            if (ws) {
                ws.on("connect", () => {
                    console.log('connected', ws.id)
                    // setWsConnecting(false)
                })
                ws.on("disconnect", () => {
                    console.log("disconnected");
                });
                ws.on("connect_error", (e) => {
                    console.log('connect error', e.message)
                })
                ws.on("connectedClients", (data: { socketIds: string[] }) => {
                    setConnectedClients(prev => [...prev, ...data.socketIds])
                })
                ws.on("newClientConnected", (data: { socketId: string }) => {
                    console.log(data)
                    setConnectedClients(prev => [...prev, data.socketId])
                })
                ws.on("clientDisconnected", (data: { socketId: string }) => {
                    setConnectedClients(prev => prev.filter(c => c !== data.socketId))
                })
                ws.on("receive-message", (msg: { uid: string, message: string }) => {
                    setMessages(prev => [...prev, msg])
                })
            }
        }
    }, [socket])

    return <>
        {showDiv && <div className={`slide ${room !== null && room !== "" ? 'entering' : 'exiting'}`}>
            <ChatWindow back={() => setRoom(null)} messages={messages} socket={socket} setMessages={setMessages} uid={socket?.id ?? ""} />
        </div>}
        <div className="conversations">
            <div className="conversations-header">
                {/* header */}
                <h2>Connected Clients</h2>
            </div>
            <div className="conversations-list">
                {/* available rooms list view */}
                {connectedClients.map(roomId => <div onClick={() => setRoom(roomId)} key={roomId} className="conversation">
                    <div style={{ display: "flex", gap: 4, alignItems: 'center' }}>
                        <span className="connected"></span>
                        <h3>New Lead</h3>
                    </div>
                    <div className="tag">Start Chatting</div>
                </div>)}
            </div>
        </div>
    </>
}