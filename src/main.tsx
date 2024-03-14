import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './context/AuthContext.tsx'
import axios from 'axios'
import PostContextProvider from './context/PostContext.tsx'
import { IToken } from './types/http.types.ts'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CommentContextProvider from './context/CommentContext.tsx'
import { UserContextProvider } from './context/UserContext.tsx'

axios.defaults.baseURL = 'http://localhost:5000'

axios.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("token") || "null") as IToken | null
  if (token) {
    config.headers['Authorization'] = `Bearer ${token.accessToken}`
  }
  return config
})
// call refresh token api when response status is 401
/*axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        alert("Refreshing token becuaase of request to path: " + error.config.url)
        const token = JSON.parse(localStorage.getItem("token") || "null") as IToken | null
        if(token) {
          localStorage.removeItem("token")
          const response = await axios.get('/auth/refresh', {
            headers: {
              'Authorization': 'Bearer ' + token.refreshToken,
            }
          })
          if (response.data.accessToken) {
            localStorage.setItem("token", JSON.stringify(response.data))
            alert('Your session has expired. Refreshing token...')
            window.location.reload()
            return axios.request(error.config)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    return Promise.reject(error)
  }
)
*/
ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <PostContextProvider>
      <CommentContextProvider>
        <UserContextProvider>
      <BrowserRouter>
        <App />
        <ToastContainer/>
      </BrowserRouter>
      </UserContextProvider>
      </CommentContextProvider>
    </PostContextProvider>
  </AuthContextProvider>
)
