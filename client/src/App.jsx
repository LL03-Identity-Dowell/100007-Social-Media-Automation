import { BrowserRouter, Route, Routes } from "react-router-dom"

import Navbar from "./components/navbar/Navbar"
import Sidebar from "./components/Sidebar/Sidebar"
import Topic from "./pages/Topic/Topic"
import Article from "./pages/Article/Article"
import Post from "./pages/Post/Post"
import Schedule from "./pages/Schedule/Schedule"
import Comment from "./pages/Comment/Comment"


function App() {

  return (
    <>
      <Navbar />
      <div className="grid">
        <div className="grid grid-cols-6">
          <div className="col-span-1">

            <Sidebar />
          </div>

          <Routes>
            <Route path='/' element={<Topic />} />
            <Route path='/article' element={<Article />} />
            <Route path='/post' element={<Post />} />
            <Route path='/schedule' element={<Schedule />} />
            <Route path='/comment' element={<Comment />} />
          </Routes>
        </div>

      </div>
    </>
  )
}

export default App

