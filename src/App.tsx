import { Route, Routes } from "react-router"

import AuthLayout from "./pages/auth/Layout"
import Login from './pages/auth/Login'
import Register from './pages/auth/Userbody'

import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import PostBody from "./pages/postbody/Postbody"
import Logout from "./pages/auth/Logout"
import CommentDialog from "./components/CommentDialog"
import Profile from "./pages/profile/Profile"
import ProfileOther from "./pages/profile/ProfileOther"
import ExploreUsers from "./pages/exploreusers/ExploreUsers"
import Userbody from "./pages/auth/Userbody"

function App() {


  return (
    <div className="h-full flex flex-col">
      <Navbar/>
      <CommentDialog/>
      <div className="p-2 h-[100vh] grid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post-body" element={<PostBody />} /> 
          <Route path="/post-edit/:id" element={<PostBody />} /> 
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login/>} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/profile" element={<Profile/>} />
          <Route path="/user/edit" element={<Userbody/>} />
          <Route path="/profile-other/:id" element={<ProfileOther/>} />
          <Route path="/explore-users" element={<ExploreUsers/>} />
          <Route path="/logout" element={<Logout/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
