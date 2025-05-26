import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ChatPage.module.css';
import { FaUserCircle, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { api } from '../services/api';

const ChatPage = () => {
    const { bookingId: initialBookingId } = useParams();
    const navigate = useNavigate();

    const [chatSessions, setChatSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [sessionsError, setSessionsError] = useState(null);

    const [activeBookingId, setActiveBookingId] = useState(initialBookingId);
    const [chatLog, setChatLog] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentMessage, setCurrentMessage] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChatSessions = async () => {
            try {
                setSessionsLoading(true);
                setSessionsError(null);

                let user = currentUser;
                if (!user) {
                    const userProfile = await api.getUserProfile();
                    setCurrentUser(userProfile);
                    user = userProfile;
                }

                if (!user || !user.id) {
                    setSessionsError("Could not identify current user to fetch chats.");
                    setSessionsLoading(false);
                    return;
                }

                const bookings = await api.getUserBookings();
                const relevantBookings = bookings.filter(booking => 
                    booking.homeOwner?.id === user.id || booking.serviceProvider?.id === user.id
                );

                console.log(relevantBookings);

                
                const sessions = relevantBookings.map(booking => {
                    let partnerName = "Unknown Partner";
                    let partnerUserType = "";
                    if (user.id === booking.homeOwner?.id) {
                        partnerName = booking.serviceProvider?.businessName || booking.serviceProvider?.email || "Service Provider";
                        partnerUserType = booking.serviceProvider?.userType;
                    } else if (user.id === booking.serviceProvider?.id) {
                        const hoName = `${booking.homeOwner?.firstName || ''} ${booking.homeOwner?.lastName || ''}`.trim();
                        partnerName = hoName || booking.homeOwner?.email || "Home Owner";
                        partnerUserType = booking.homeOwner?.userType;
                    }

                    return {
                        bookingId: booking.id,
                        partnerName: partnerName,
                        lastMessageSnippet: booking.lastMessageSnippet || "No messages yet...",
                        unreadCount: 0,
                        partnerUserType: partnerUserType,
                        bookingStatus: booking.status
                    };
                });
                
                setChatSessions(sessions);
                
                if (!initialBookingId && sessions.length > 0 && !activeBookingId) {
                }

            } catch (err) {
                console.error("Error fetching chat sessions:", err);
                setSessionsError(err.response?.data?.message || err.message || 'Failed to load chat sessions.');
            } finally {
                setSessionsLoading(false);
            }
        };

        fetchChatSessions();
    }, [initialBookingId, navigate, currentUser, activeBookingId]);

    useEffect(() => {
        const fetchChatData = async () => {
            if (!activeBookingId) {
                setChatLog(null);
                return;
            }
            try {
                setChatLoading(true);
                setChatError(null);
                const logData = await api.getChatForBooking(activeBookingId);
                setChatLog(logData);
                
                if (!currentUser) {
                    const userProfile = await api.getUserProfile(); 
                    setCurrentUser(userProfile);
                }

            } catch (err) {
                console.error("Error fetching chat data for booking:", activeBookingId, err);
                setChatError(err.response?.data?.message || err.message || 'Failed to load chat.');
                setChatLog(null);
            } finally {
                setChatLoading(false);
            }
        };

        fetchChatData();
    }, [activeBookingId, currentUser]);

    useEffect(() => {
        scrollToBottom();
    }, [chatLog?.messages]);

    const handleSelectChat = (bookingId) => {
        setActiveBookingId(bookingId);
        navigate(`/chat/booking/${bookingId}`, { replace: true });
    };

    const handleSendMessage = async () => {
        if (!currentMessage.trim() || !chatLog || !currentUser || !activeBookingId) return;

        const tempMessageId = Date.now();
        const messageToSend = {
            id: tempMessageId,
            messageText: currentMessage,
            sender: {
                id: currentUser.id,
                email: currentUser.email,
                userType: currentUser.userType,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                businessName: currentUser.businessName
            },
            sentAt: new Date().toISOString(),
            chatLog: { id: chatLog.id }
        };

        const originalMessages = chatLog.messages ? [...chatLog.messages] : [];
        setChatLog(prevChatLog => ({
            ...prevChatLog,
            messages: [...(prevChatLog?.messages || []), messageToSend]
        }));
        const messageToSubmit = currentMessage;
        setCurrentMessage('');

        try {
            const savedMessage = await api.postMessageToChatLog(chatLog.id, messageToSubmit);
            setChatLog(prevChatLog => ({
                ...prevChatLog,
                messages: prevChatLog.messages.map(msg => 
                    msg.id === tempMessageId ? savedMessage : msg
                )
            }));
        } catch (err) {
            console.error("Error sending message:", err);
            setChatError(err.response?.data?.message || err.message || 'Failed to send message.');
            setChatLog(prevChatLog => ({
                ...prevChatLog,
                messages: originalMessages
            }));
        }
    };
    
    let chatPartnerName = "Chat Partner";
    if (chatLog && currentUser) {
        const otherParticipant = currentUser.id === chatLog.homeOwner?.id 
            ? chatLog.serviceProvider
            : chatLog.homeOwner;
        
        if (otherParticipant) {
            if (otherParticipant.userType === 'HOMEOWNER') {
                const hoName = `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim();
                chatPartnerName = hoName || otherParticipant.email || "HomeOwner";
            } else if (otherParticipant.userType === 'PROVIDER') {
                chatPartnerName = otherParticipant.businessName || otherParticipant.email || "Service Provider";
            } else {
                 chatPartnerName = otherParticipant.email || "Chat Partner";
            }
        }
    }

  return (
        <div className={styles.chatLayout}>
      <aside className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Chats</h2>
                {sessionsLoading && <div className={styles.sidebarLoading}>Loading chats...</div>}
                {sessionsError && <div className={styles.sidebarError}>{sessionsError}</div>}
                {!sessionsLoading && !sessionsError && (
                    <ul className={styles.chatSessionList}>
                        {chatSessions.length > 0 ? chatSessions.map(session => (
                            <li 
                                key={session.bookingId} 
                                className={`${styles.chatSessionItem} ${session.bookingId === activeBookingId ? styles.activeSession : ''}`}
                                onClick={() => handleSelectChat(session.bookingId)}
                            >
                                <FaUserCircle size={32} className={styles.sessionAvatar} />
                                <div className={styles.sessionInfo}>
                                    <div className={styles.sessionPartnerName}>{session.partnerName}</div>
                                    <div className={styles.sessionLastMessage}>
                                        {session.lastMessageSnippet || "No messages yet..."} 
                                        {session.bookingStatus === 'COMPLETED' && (
                                            <span className={styles.completedStatus}><FaCheckCircle /> Completed</span>
                                        )}
                                    </div>
              </div>
                                {session.unreadCount > 0 && <span className={styles.unreadBadge}>{session.unreadCount}</span>}
            </li>
                        )) : <div className={styles.noSessions}>No active chats.</div>}
        </ul>
                )}
      </aside>

            <main className={styles.chatPage}>
                {!activeBookingId && (
                     <div className={styles.noChatSelected}>Please select a chat from the list.</div>
                )}
                {activeBookingId && chatLoading && (
                    <div className={styles.loadingPage}>Loading chat...</div>
                )}
                {activeBookingId && chatError && (
                    <div className={styles.errorPage}>{chatError}</div>
                )}
                {activeBookingId && !chatLoading && !chatError && !chatLog && (
                     <div className={styles.loadingPage}>Initializing chat...</div>
                )}

                {activeBookingId && !chatLoading && !chatError && chatLog && currentUser && (
                    <>
        <header className={styles.chatHeader}>
          <FaUserCircle size={36} className={styles.avatar} />
                            <span className={styles.chatName}>{chatPartnerName}</span>
        </header>
                        <div className={styles.messagesContainer}>
                            {(chatLog.messages && chatLog.messages.length > 0) ? (
                                chatLog.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.messageItem} ${msg.sender?.id === currentUser.id ? styles.messageSelf : styles.messageOther}`}
                                    >
                                        <div className={styles.messageSender}> 
                                            {msg.sender?.id !== currentUser.id && (
                                                (msg.sender?.userType === 'HOMEOWNER' && `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim()) || 
                                                (msg.sender?.userType === 'PROVIDER' && msg.sender.businessName) ||
                                                msg.sender?.email ||
                                                'User'
                                            )}
                                        </div>
                                        <div className={styles.messageBubble}>
                                            <div className={styles.messageText}>{msg.messageText}</div>
                                            <div className={styles.messageTime}>{
                                                msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'
                                            }</div>
                                        </div>
            </div>
                                ))
                            ) : (
                                <div className={styles.noMessages}>No messages yet. Start the conversation!</div>
                            )}
                            <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputBar}>
          <input
            type="text"
            placeholder="Type your message..."
                                value={currentMessage}
                                onChange={e => setCurrentMessage(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                                disabled={!chatLog}
                            />
                            <button onClick={handleSendMessage} disabled={!chatLog || !currentMessage.trim()}>
                                <FaPaperPlane />
                            </button>
        </div>
                    </>
                )}
      </main>
    </div>
  );
};

export default ChatPage; 