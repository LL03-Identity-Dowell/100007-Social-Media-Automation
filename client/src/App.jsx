import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/homepage/Home";
import Layout from "./Layout";
import Topic from "./pages/Topic/Topic";
import Article from "./pages/Article/Article";
import PostList from "./pages/Post/PostList/PostList";
import ScheduleSection from "./pages/Schedule/Schedule";
import Comment from "./pages/Comment/Comment";
import ViewComments from "./pages/Comment/ViewComments";
import NotFound from "./pages/NotFound/NotFound";
import MyPlan from "./pages/Statistics/MyPlan";
import MyTeam from "./pages/Statistics/MyTeam";
import MyUsage from "./pages/Statistics/MyUsage";
import Hashtags from "./pages/SettingsPages/Hashtags";
import CategoriesTopic from "./pages/SettingsPages/CategoriesTopic";
import Address from "./pages/Address/Address";
import UserProfile from "./pages/UserProfile/UserProfile";
import SocialMediaChannels from "./pages/UserProfile/SocialMediaChannels";
import ApprovalByClient from "./pages/UserProfile/ApprovalByClient";
import SpecificArticle from "./pages/Article/SpecificArticle";
// import SpecificPost from "./pages/Post/PostList/SpecificPost";
import PostDetail from "./pages/Post/PostDetail/PostDetail";
import ClientProfile from "./pages/UserProfile/ClientProfile";
import TargetCities from "./pages/UserProfile/TargetCities";
import Fackbook from "./pages/UserProfile/_components/facebook";
import Instagram from "./pages/UserProfile/_components/instagram";
import Twitter from "./pages/UserProfile/_components/twitter";
import Youtube from "./pages/UserProfile/_components/youtube";
import Pinterest from "./pages/UserProfile/_components/pinterest";
import Linkedin from "./pages/UserProfile/_components/linkedin";
import CreateArticle from "./pages/Article/CreateArticle";
import Rank from "./pages/RankPage/Rank";
import PortfolioError from "./pages/NotFound/PortfolioError";
import Wikipidia from "./pages/Article/Wikipidia";
import WriteYourSelf from "./pages/Article/WriteYourSelf";
import PostDetailDropdown from "./pages/UserProfile/PostDetailDropdown";
import Mention from "./pages/SettingsPages/Mention";
import BaseHashMention from "./pages/SettingsPages/BaseHashMention";
import AdminApproval from "./pages/UserProfile/AdminApproval";


function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBottombar, setShowBottombar] = useState(false);

  const handleOpenSideBar = () => {
    setShowSidebar(true);
    setShowBottombar(true);
  };
  const handleCloseSideBar = () => {
    setShowSidebar(false);
    setShowBottombar(false);
  };

  


  return (
    <>
      <Layout side={showSidebar} show={handleOpenSideBar}>
        <Routes>
          <Route index element={<Home close={handleCloseSideBar} />} />
          <Route path='/topic' element={<Topic show={handleOpenSideBar} />} />
          <Route path='/rank' element={<Rank show={handleCloseSideBar} />} />
          <Route
            path='/article'
            element={<Article show={handleOpenSideBar} />}
          />
          <Route
            path='/createArticle'
            element={<CreateArticle show={handleOpenSideBar} />}
          />
          <Route
            path='/post-list'
            element={<PostList show={handleOpenSideBar} />}
          />
          <Route
            path='/article-detail'
            element={<SpecificArticle show={handleOpenSideBar} />}
          />
          {/* <Route
            path='/SpecificPost'
            element={<SpecificPost show={handleOpenSideBar} />}
          /> */}
          <Route path='/portfolio' element={<Portfolio />} />

          <Route
            path='/post-detail'
            element={<PostDetail show={handleOpenSideBar} />}
          />
          <Route
            path='/scheduled'
            element={<ScheduleSection show={handleOpenSideBar} />}
          />
          <Route
            path='/unscheduled'
            element={<ScheduleSection show={handleOpenSideBar} />}
          />
          <Route
            path='/recent'
            element={<ScheduleSection show={handleOpenSideBar} />}
          />
          <Route
            path='/comment'
            element={<Comment show={handleOpenSideBar} />}
          />
          <Route
            path='/comment/:id'
            element={<ViewComments show={handleOpenSideBar} />}
          />
          <Route
            path='/address'
            element={<Address close={handleCloseSideBar} />}
          />
          <Route
            path='/user-profile'
            element={<UserProfile close={handleCloseSideBar} />}
          />
          <Route
            path='/client-profile'
            element={<ClientProfile close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels'
            element={<SocialMediaChannels close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels/facebook'
            element={<Fackbook close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels/instagram'
            element={<Instagram close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels/twitter'
            element={<Twitter close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels/linkedin'
            element={<Linkedin close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels/youtube'
            element={<Youtube close={handleCloseSideBar} />}
          />
          <Route
            path='/social-media-channels/pinterest'
            element={<Pinterest close={handleCloseSideBar} />}
          />

          <Route
            path='/user-approval'
            element={<ApprovalByClient close={handleCloseSideBar} />}
          />
          <Route path='*' element={<NotFound close={handleCloseSideBar} />} />
          <Route
            path='/statistics/my-plan'
            element={<MyPlan close={handleCloseSideBar} />}
          />
          <Route
            path='/statistics/my-team'
            element={<MyTeam close={handleCloseSideBar} />}
          />
          <Route
            path='/statistics/my-usage'
            element={<MyUsage close={handleCloseSideBar} />}
          />

          <Route
            path='/settings/categoriesandtopic'
            element={<CategoriesTopic close={handleCloseSideBar} />}
          />
          <Route
            path='/settings/postdetaildropdowns'
            element={<PostDetailDropdown close={handleCloseSideBar} />}
          />
          <Route
            path='/target-cities'
            element={<TargetCities close={handleCloseSideBar} />}
          />
          <Route
            path='/admin-approval'
            element={<AdminApproval close={handleCloseSideBar} />}
          />
          <Route
            path='/createarticle'
            element={<CreateArticle show={handleOpenSideBar} />}
          />
          <Route
            path='/article/Wikipidia/'
            element={<Wikipidia close={handleCloseSideBar} />}
          />
          <Route
            path='/article/write_yourself/'
            element={<WriteYourSelf close={handleCloseSideBar} />}
          />
          <Route
            path='/portfolio_check'
            element={<PortfolioError close={handleCloseSideBar} />}
          />
          <Route element={<BaseHashMention />}>
            <Route
              path='/settings/hastags'
              element={<Hashtags close={handleCloseSideBar} />}
            />
            <Route
              path='/settings/mentions'
              element={<Mention close={handleCloseSideBar} />}
            />
          </Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
