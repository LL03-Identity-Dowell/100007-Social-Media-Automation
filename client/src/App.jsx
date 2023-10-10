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
import HashtagsMentions from "./pages/SettingsPages/HashtagsMentions"
import CategoriesTopic from "./pages/SettingsPages/CategoriesTopic"
import Address from "./pages/Address/Address"
import UserProfile from "./pages/UserProfile/UserProfile"
import SocialMediaChannels from "./pages/UserProfile/SocialMediaChannels"
import ApprovalByClient from "./pages/UserProfile/ApprovalByClient"
import ClientProfile from "./pages/UserProfile/ClientProfile"

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleOpenSideBar = () => {
    setShowSidebar(true);
  };
  const handleCloseSideBar = () => {
    setShowSidebar(false);
  };
  return (
    <>
     <Layout side={showSidebar} show={handleOpenSideBar}>
        <Routes>
          <Route path='/' element={<Home close={handleCloseSideBar} />} />
          <Route path='/topic' element={<Topic show={handleOpenSideBar} />} />
          <Route path='/article' element={<Article show={handleOpenSideBar} />} />
          <Route path='/post-list' element={<PostList show={handleOpenSideBar} />} />
          <Route path='/schedule' element={<Schedule show={handleOpenSideBar} />} />
          <Route path='/comment' element={<Comment show={handleOpenSideBar} />} />
          <Route path='/address' element={<Address close={handleCloseSideBar} />} />
          <Route path='/user-profile' element={<UserProfile close={handleCloseSideBar} />} />
          <Route path='/social-media-channels' element={<SocialMediaChannels close={handleCloseSideBar} />} />
          <Route path='/user-approval' element={<ApprovalByClient close={handleCloseSideBar} />} />
          <Route path='/client-profile' element={<ClientProfile close={handleCloseSideBar} />} />
          <Route path="*" element={<NotFound close={handleCloseSideBar} />} />
          <Route path="/statistics/my-plan" element={<MyPlan close={handleCloseSideBar} />} />
          <Route path="/statistics/my-team" element={<MyTeam close={handleCloseSideBar} />} />
          <Route path="/statistics/my-usage" element={<MyUsage close={handleCloseSideBar} />} />
          <Route path="/settings/hastagsandmentions" element={<HashtagsMentions close={handleCloseSideBar} />} />
          <Route path="/settings/categoriesandtopic" element={<CategoriesTopic close={handleCloseSideBar} />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
