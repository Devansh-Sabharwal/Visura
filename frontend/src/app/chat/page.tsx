'use client'

import { useRouter, useParams } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const initialChatId = params?.chatId as string | undefined
  const [chatId, setChatId] = useState(initialChatId)
  type Message = { role: 'user' | 'assistant'; content: string }
  const [messages, setMessages] = useState<Message[]>([])
  const { data: session } = useSession();

  const handleSend = async (prompt: string) => {
    let cid = chatId

    if (!cid) {
      cid = uuidv4()
      setChatId(cid)
      router.replace(`/chat/${cid}`)
    }

    const res = await fetch('/api/chat/prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.fastApiToken}`,
      },
      body: JSON.stringify({
        chatId: cid,
        id:session?.userId,
        prompt,
      }),
    })

    const data = await res.json()
    setMessages(prev => [...prev, { role: 'user', content: prompt }, { role: 'assistant', content: data.reply }])
  }

  return (
    <>
      {/* Message List and Input UI */}
    </>
  )
}
