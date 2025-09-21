import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
  const { logout } = useAuthStore();
  return (
    <div className='z-10'>
      
        ChatPage
        <button className='auth-btn' onClick={logout}>
          logout
        </button>
    </div>
  )
}

export default ChatPage
