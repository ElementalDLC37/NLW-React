import { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { api } from '../../services/api'

import styles from './styles.module.scss'
import logoImg from '../../assets/logo.svg'

type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
}

const messageQueue: Message[]= []

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
    messageQueue.push(newMessage);
});

export function MessageList() {
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            if (messageQueue.length > 0) {
                setMessages(prevState => [
                    messageQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean))

                messageQueue.shift()
            }
        }, 3000)
    }, [])

    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data);
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                {messages.map((message, key) => {
                    return (
                        <li key={key} className={styles.message}>
                            <p>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}