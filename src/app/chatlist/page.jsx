// "use client";
// import { useState, useEffect } from 'react';
// // import api from '../../utils/axiosConfig';
// import { useRouter } from 'next/navigation';


// const ChatList = () => {
//   const [chats, setChats] = useState([]);     
//   const navigate = useRouter(); 


//   useEffect(() => {
//     const fetchChatRoomList = async () => {
//       try {
//         const chatRoomResponse = await api.get(`/api/chatroom`);
//         console.log("챗룸 : ", chatRoomResponse.data);
//         setChats(chatRoomResponse.data);
//       } catch (err) {
//         // setError(err.message);
//         console.error("채팅방 목록 불러오기 오류 :", err);
//       }
//     };

//     fetchChatRoomList();
//   }, []);


//   const joinChatRoom = (roomId) => {
//     navigate.push(`/chat/${roomId}`);
//   };

//   const formatTime = (isoString) => {
//     const date = new Date(isoString);
//     return date.toLocaleString('ko-KR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false
//     }).replace(/\./g, '-').replace(' ', '');
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
//       <div className="w-full max-w-md bg-base-100 rounded-lg shadow-lg">
//         <div className="p-4 bg-base-200">
//           <h2 className="text-xl font-bold">채팅</h2>
//         </div>

//         <div className="overflow-y-auto h-96">
//           {chats.map((chat) => (
//             <div
//               onClick={()=> joinChatRoom(chat.chatRoomId)}
//               key={chat.chatRoomId}
//               className={`flex items-center p-4 border-b border-base-200 hover:bg-base-200 cursor-pointer `}
//               // ${chat.active ? 'bg-base-200' : '' }`// 접속 여부 나중에 추가
//             >
//               {/* 아바타 */}
//               <div className="relative">
//                 <div className="avatar">
//                   <div className="w-12 rounded-full">
//                     <img
//                       alt="Profile"
//                       src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
//                   </div>
//                 </div>
//                 {/* 온라인 상태 표시 */}
//                 {/* {chat.online && (
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 )} */}
//               </div>

//               {/* 채팅 정보 */}
//               <div className="ml-4 flex-1">
//                 <div className="flex justify-between items-center">
//                   {/* 안읽은 메시지 표시 나중에 추가 */}
//                   <h3 className={`font-semibold ${chat.unread > 0 ? 'text-base-content' : 'text-base-content/70'}`} > 
//                     {chat.sender}
//                   </h3>
//                   <span className="text-sm text-base-content/50">{formatTime(chat.timestamp)}</span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <p className={`text-sm ${chat.unread > 0 ? 'font-medium' : 'text-base-content/70'}`}>
//                     {chat.content}
//                   </p>
//                   {/* 안 읽은 메시지 표시 */}
//                   {/* {chat.unread > 0 && (
//                     <span className="badge badge-primary badge-sm">
//                       {chat.unread}
//                     </span>
//                   )} */}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatList;


"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import api from '../../utils/axiosConfig';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const navigate = useRouter();

  useEffect(() => {
    const fetchChatRoomList = async () => {
      try {
        const chatRoomResponse = await api.get(`/api/chatroom`);
        console.log("챗룸 : ", chatRoomResponse.data);
        setChats(chatRoomResponse.data);
      } catch (err) {
        console.error("채팅방 목록 불러오기 오류 :", err);
      }
    };

    fetchChatRoomList();
  }, []);

  const joinChatRoom = (roomId) => {
    navigate.push(`/chat/${roomId}`);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\./g, '-').replace(' ', '');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-200">
          <h2 className="text-xl font-bold text-gray-900">채팅</h2>
        </div>

        <div className="overflow-y-auto h-96">
          {chats.map((chat) => (
            <button
              key={chat.chatRoomId}
              onClick={() => joinChatRoom(chat.chatRoomId)}
              className="w-full text-left flex items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-200 transition"
            >
              {/* 아바타 */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                  <img
                    alt="Profile"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 온라인 상태 표시 */}
                {/* {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )} */}
              </div>

              {/* 채팅 정보 */}
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className={`font-semibold ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-600'}`}> 
                    {chat.sender}
                  </h3>
                  <span className="text-sm text-gray-400">{formatTime(chat.timestamp)}</span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <p className={`text-sm ${chat.unread > 0 ? 'font-medium text-gray-800' : 'text-gray-500'}`}> 
                    {chat.content}
                  </p>
                  {/* 안 읽은 메시지 표시 */}
                  {/* {chat.unread > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full">
                      {chat.unread}
                    </span>
                  )} */}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
