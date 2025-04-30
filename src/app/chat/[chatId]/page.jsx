"use client";

import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useParams } from 'next/navigation';

const Chat = () => {
  const BaseUrl = "/ws";
  const [messages, setMessages] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.name;
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const { chatRoomId } = useParams();

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const chatContainerRef = useRef(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0 && !initialLoadDone) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setInitialLoadDone(true);
    }
  }, [messages, initialLoadDone]);

  useEffect(() => {
    const socket = new SockJS(BaseUrl);
    const stomp = new Client({
      webSocketFactory: () => socket,
      debug: str => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stomp.onConnect = () => {
      stomp.subscribe(`/topic/${chatRoomId}`, message => {
        const newMessage = JSON.parse(message.body);
        setMessages(prev => {
          const updated = [...prev, newMessage];
          const container = chatContainerRef.current;
          if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - (scrollTop + clientHeight) < 100) {
              setTimeout(() => {
                container.scrollTop = container.scrollHeight;
              }, 50);
            }
          }
          return updated;
        });
      });
    };

    stomp.activate();
    setClient(stomp);
    return () => stomp.deactivate();
  }, [chatRoomId]);

  useEffect(() => {
    setMessages([]);
    setPage(0);
    setHasMore(true);
    fetchChatHistory(0);
  }, [chatRoomId]);

  const fetchChatHistory = async pageToFetch => {
    try {
      const response = await axios.get(`/api/chatmessage/${chatRoomId}`, {
        params: { page: pageToFetch, size: 20 }
      });
      const newMessages = response.data.content;
      if (newMessages.length === 0) {
        setHasMore(false);
        return;
      }
      newMessages.reverse();
      setMessages(prev => [...newMessages, ...prev]);
      setPage(prev => prev + 1);
      setHasMore(!response.data.last);
    } catch (error) {
      console.error('채팅 기록 조회 실패:', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (container.scrollTop === 0 && hasMore) {
        const prevHeight = container.scrollHeight;
        await fetchChatHistory(page);
        const newHeight = container.scrollHeight;
        container.scrollTop = newHeight - prevHeight;
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [page, hasMore]);

  const sendMessage = e => {
    e.preventDefault();
    if (input.trim() && client) {
      const now = new Date();
      const kstOffset = 9 * 60;
      const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
      const isoKst = kstDate.toISOString().slice(0, 19);

      const message = { sender: userName, content: input, timestamp: isoKst, messageType: "CHAT" };
      client.publish({ destination: `/pub/${chatRoomId}`, body: JSON.stringify(message) });
      setInput('');

      setTimeout(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }, 100);
    }
  };

  const formatTime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12:false })
      .replace(/\./g,'-').replace(' ', '');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-lg flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isMe = msg.sender === userName;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>  
                <div className="flex items-end">
                  {!isMe && (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`max-w-[60%] p-3 ${isMe ? 'bg-blue-500 text-white rounded-tl-xl rounded-bl-xl rounded-tr-xl ml-2' : 'bg-gray-200 text-gray-900 rounded-tr-xl rounded-tl-xl rounded-br-xl mr-2'}`}> 
                    <div className="text-xs font-medium mb-1">
                      {msg.sender} <time className="opacity-50 ml-1 text-[10px]">{formatTime(msg.timestamp)}</time>
                    </div>
                    <div className="text-sm">{msg.content}</div>
                  </div>
                  {isMe && (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                      <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={sendMessage} className="flex gap-3 p-4 border-t border-gray-300">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(e)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600">
            전송
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;


// "use client";


// import React, { useEffect, useState, useRef } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { useParams } from 'react-router-dom';


// const Chat = () => {
//     const BaseUrl = "/ws";
//     const [messages, setMessages] = useState([]);
//     const { user } = localStorage.getItem("user");
//     const [input, setInput] = useState('');
//     const [client, setClient] = useState(null);
//     const { chatRoomId } = useParams();


//     const [page, setPage] = useState(0);
//     const [hasMore, setHasMore] = useState(true);
//     const chatContainerRef = useRef(null);
//     const [initialLoadDone, setInitialLoadDone] = useState(false);

//     useEffect(() => {
//         // 메시지가 로드된 후 초기 스크롤을 하단으로 이동
//         if (chatContainerRef.current && messages.length > 0 && !initialLoadDone) {
//             chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//             setInitialLoadDone(true);
//         }
//     }, [messages, initialLoadDone]);

//     // WebSocket 연결 부분
//     useEffect(() => {
//         const socket = new SockJS(BaseUrl);
//         const stomp = new Client({
//             webSocketFactory: () => socket,
//             debug: (str) => console.log(str),
//             reconnectDelay: 5000,
//             heartbeatIncoming: 4000,
//             heartbeatOutgoing: 4000,
//         });

//         stomp.onConnect = (frame) => {
//             stomp.subscribe(`/topic/${chatRoomId}`, (message) => {
//                 const newMessage = JSON.parse(message.body);
//                 setMessages(prev => {
//                     const updated = [...prev, newMessage];
//                     // 사용자가 이미 하단에 있으면 자동 스크롤
//                     if (chatContainerRef.current) {
//                         const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
//                         if (scrollHeight - (scrollTop + clientHeight) < 100) {
//                             setTimeout(() => {
//                                 chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//                             }, 50);
//                         }
//                     }
//                     return updated;
//                 });
//             });
//         };
//         stomp.activate();
//         setClient(stomp);
//         return () => stomp.deactivate();
//     }, [chatRoomId]);

//     // 채팅방 변경 시 상태 초기화
//     useEffect(() => {
//         setMessages([]);
//         setPage(0);
//         setHasMore(true);
//         fetchChatHistory(0); // 초기 페이지 0 호출
//     }, [chatRoomId]);

//     // 채팅 기록 페이징 처리 
//     const fetchChatHistory = async (pageToFetch) => {
//         try {
//             const response = await axios.get(`/api/chatmessage/${chatRoomId}`, {
//                 params: { page: pageToFetch, size: 20 }
//             });

//             const newMessages = response.data.content;
//             if (newMessages.length === 0) {
//                 setHasMore(false);
//                 return;
//             }
//             newMessages.reverse();
//             // 새로 로드된 메시지를 기존 메시지 앞에 추가
//             setMessages(prev => [...newMessages, ...prev]);
//             setPage(prev => prev + 1);
//             // 마지막 페이지 여부로 판단 (!last이면 다음 페이지가 있다는 의미)
//             setHasMore(!response.data.last);
//         } catch (error) {
//             console.error('채팅 기록 조회 실패:', error);
//             setHasMore(false);
//         }
//     };

//     useEffect(() => {
//         const container = chatContainerRef.current;
//         if (!container) return;

//         const handleScroll = async () => {
//             if (container.scrollTop === 0 && hasMore) {
//                 console.log("최상단 로그실행");
//                 const prevScrollHeight = container.scrollHeight;
//                 await fetchChatHistory(page);
//                 const newScrollHeight = container.scrollHeight;
//                 container.scrollTop = newScrollHeight - prevScrollHeight;
//             }
//         };

//         container.addEventListener('scroll', handleScroll);
//         return () => container.removeEventListener('scroll', handleScroll);
//     }, [page, hasMore]);

//     useEffect(() => {
//         console.log("메시지 내역 : ", messages);
//     }, [messages]);

//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (input.trim() && client) {
//             const now = new Date();
//             const kstOffset = 9 * 60;
//             const kstDate = new Date(now.getTime() + kstOffset * 60 * 1000);
//             const isoKst = kstDate.toISOString().slice(0, 19);

//             const message = {
//                 sender: user.name,
//                 content: input,
//                 timestamp: isoKst,
//                 messageType: "CHAT"
//             };
//             client.publish({
//                 destination: `/pub/${chatRoomId}`,
//                 body: JSON.stringify(message)
//             });
//             setInput('');

//             // 메시지 전송 후 스크롤을 하단으로 고정
//             setTimeout(() => {
//                 if (chatContainerRef.current) {
//                     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//                 }
//             }, 100);
//         }
//     };

//     const formatTime = (isoString) => {
//         const date = new Date(isoString);
//         return date.toLocaleString('ko-KR', {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false
//         }).replace(/\./g, '-').replace(' ', '');
//     };


// return (
//     <div className='min-h-screen bg-base-200 p-4 flex items-center justify-center'>
//         <div className="w-full max-w-2xl h-[calc(100vh-8rem)] bg-base-100 rounded-box shadow-lg flex flex-col">
//             <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
//                 {messages.map((message, index) => {
//                     const isCurrentUser = message.sender === user.name;
//                     return (
//                         <div key={index} className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'}`}>
//                             <div className="chat-image avatar">
//                                 <div className="w-10 rounded-full">
//                                     <img
//                                         alt="Profile"
//                                         src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//                                 </div>
//                             </div>
//                             <div className="chat-header">
//                                 {message.sender}
//                                 <time className="text-xs opacity-50 ml-1">{formatTime(message.timestamp)}</time>
//                             </div>
//                             <div className="chat-bubble">{message.content}</div>
//                         </div>
//                     );
//                 })}
//             </div>
//             <div className="flex gap-3 p-4 border-t border-base-300">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={(e) => { if (e.key === "Enter") sendMessage(e); }}
//                     placeholder="메시지를 입력하세요..."
//                     className="input input-bordered flex-1 input-sm"
//                 />
//                 <button type="submit" className="btn btn-primary btn-sm" onClick={sendMessage}>
//                     send
//                 </button>
//             </div>
//         </div>
//     </div>
// );
// };

// export default Chat;