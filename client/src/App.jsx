import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/homepage/Home";
import Layout from "./Layout";
import Topic from "./pages/Topic/Topic";
import Article from "./pages/Article/Article";
import PostList from "./pages/Post/PostList/PostList";
import ScheduleSection from "./pages/Schedule/Schedule";
import Comment from "./pages/Comment/Comment";
import NotFound from "./pages/NotFound/NotFound";
import MyPlan from "./pages/Statistics/MyPlan";
import MyTeam from "./pages/Statistics/MyTeam";
import MyUsage from "./pages/Statistics/MyUsage";
import HashtagsMentions from "./pages/SettingsPages/HashtagsMentions";
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
import axios from "axios";
import Loading from "./components/Loading";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenSideBar = () => {
    setShowSidebar(true);
  };
  const handleCloseSideBar = () => {
    setShowSidebar(false);
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchAndRemoveSessionId = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const session_id = urlParams.get("session_id");

      if (session_id) {
        // Store the session_id in both local storage and session storage
        localStorage.setItem("session_id", session_id);
        sessionStorage.setItem("session_id", session_id);

        // Remove the session_id from the URL without causing a page reload
        const newUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, newUrl);

        // Proceed to fetch data or handle authenticated user logic
        setLoading(true);
        fetchData();
      } else {
        // If no session_id, redirect to the login page with session_id as a query parameter
        window.location.href = `https://100014.pythonanywhere.com/?redirect_url=http://localhost:5173/`;
      }
    };

    // Check if session_id has already been processed to avoid continuous reload
    if (!localStorage.getItem("session_id") && !sessionStorage.getItem("session_id")) {
      fetchAndRemoveSessionId();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/v1/main/')
    .then(res=>{
      const data = res.data;
      const saveUserInfo = JSON.stringify(data);
      localStorage.setItem("userInfo", saveUserInfo);
      setLoading(false);
    }).catch(err=>{
      setLoading(false);
      console.error("Error fetching data:", err);
    })
  }
  

  return (
    <>
    {loading && <Loading />}
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
            path='/settings/hastagsandmentions'
            element={<HashtagsMentions close={handleCloseSideBar} />}
          />
          <Route
            path='/settings/categoriesandtopic'
            element={<CategoriesTopic close={handleCloseSideBar} />}
          />
          <Route
            path='/target-cities'
            element={<TargetCities close={handleCloseSideBar} />}
          />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
