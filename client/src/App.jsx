import { useState } from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/homepage/Home"
import Layout from "./Layout"
import Topic from "./pages/Topic/Topic"
import Article from "./pages/Article/Article"
import PostList from "./pages/Post/PostList/PostList"
import Schedule from "./pages/Schedule/Schedule"
import Comment from "./pages/Comment/Comment"
import NotFound from "./pages/NotFound/NotFound"
import MyPlan from "./pages/Statistics/MyPlan"
import MyTeam from "./pages/Statistics/MyTeam"
import MyUsage from "./pages/Statistics/MyUsage"
import CreateArticle from "./pages/Article/CreateAtricle"

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleOpenSideBar = () => {
    setShowSidebar(true)
  }
  const handleCloseSideBar = () => {
    setShowSidebar(false)
  }
  return (
    <>
      <Layout side={showSidebar} show={handleOpenSideBar}>
        <Routes>
          <Route path="/" element={<Home close={handleCloseSideBar} />} />
          <Route path="/topic" element={<Topic show={handleOpenSideBar} />} />
          <Route
            path="/article"
            element={<Article show={handleOpenSideBar} />}
          />
          <Route
            path="/createarticle"
            element={<CreateArticle show={handleOpenSideBar} />}
          />
          <Route
            path="/post/post-list"
            element={<PostList show={handleOpenSideBar} />}
          />
          <Route
            path="/schedule"
            element={<Schedule show={handleOpenSideBar} />}
          />
          <Route
            path="/comment"
            element={<Comment show={handleOpenSideBar} />}
          />
          <Route path="*" element={<NotFound show={handleOpenSideBar} />} />
          <Route
            path="/statistics/my-plan"
            element={<MyPlan show={handleOpenSideBar} />}
          />
          <Route
            path="/statistics/my-team"
            element={<MyTeam show={handleOpenSideBar} />}
          />
          <Route
            path="/statistics/my-usage"
            element={<MyUsage show={handleOpenSideBar} />}
          />
        </Routes>
      </Layout>
    </>
  );
}

export default App

