import { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';


const ChatList = () => {
  const [chats, setChats] = useState([]);     
  const navigate = useNavigate();


  useEffect(() => {
    const fetchChatRoomList = async () => {
      try {
        const chatRoomResponse = await api.get(`/api/chatroom`);
        console.log("챗룸 : ", chatRoomResponse.data);
        setChats(chatRoomResponse.data);
      } catch (err) {
        // setError(err.message);
        console.error("채팅방 목록 불러오기 오류 :", err);
      }
    };

    fetchChatRoomList();
  }, []);


  const joinChatRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
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
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md bg-base-100 rounded-lg shadow-lg">
        <div className="p-4 bg-base-200">
          <h2 className="text-xl font-bold">채팅</h2>
        </div>

        <div className="overflow-y-auto h-96">
          {chats.map((chat) => (
            <div
              onClick={()=> joinChatRoom(chat.chatRoomId)}
              key={chat.chatRoomId}
              className={`flex items-center p-4 border-b border-base-200 hover:bg-base-200 cursor-pointer `}
              // ${chat.active ? 'bg-base-200' : '' }`// 접속 여부 나중에 추가
            >
              {/* 아바타 */}
              <div className="relative">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      alt="Profile"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
                {/* 온라인 상태 표시 */}
                {/* {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )} */}
              </div>

              {/* 채팅 정보 */}
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  {/* 안읽은 메시지 표시 나중에 추가 */}
                  <h3 className={`font-semibold ${chat.unread > 0 ? 'text-base-content' : 'text-base-content/70'}`} > 
                    {chat.sender}
                  </h3>
                  <span className="text-sm text-base-content/50">{formatTime(chat.timestamp)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <p className={`text-sm ${chat.unread > 0 ? 'font-medium' : 'text-base-content/70'}`}>
                    {chat.content}
                  </p>
                  {/* 안 읽은 메시지 표시 */}
                  {/* {chat.unread > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {chat.unread}
                    </span>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;