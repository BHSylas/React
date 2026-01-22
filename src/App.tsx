import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { Navbar } from "./components/common/Navbar";
import Home from "./pages/user/Home";
import ProfilePage from "./pages/user/ProfilePage";
import RegisterForm from "./pages/unauthenticated/RegisterForm";
import LoginForm from "./pages/unauthenticated/LoginForm";
import { AuthProvider } from "./components/Auth/AuthProvider";
import Layout from "./components/common/Layout";
import PlayerListPage from "./pages/user/PlayerListPage";
import PredictionPage from "./pages/user/PredictionPage";
import ErrorPage from "./pages/ErrorPage";
import NewsListPage from "./pages/user/NewsListPage";
import LoginLayout from "./components/common/LoginLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SocialLoginPage from "./pages/unauthenticated/SocialLoginPage";
import UnprotectingRoute from "./components/Auth/UnprotectingRoute";
import LiveListPage from "./pages/user/LiveListPage";
import NewPlayerPage from "./pages/admin/NewPlayerPage";
import MyPage from "./pages/user/MyPage";
import AdminRoute from "./components/Auth/AdminRoute";
import AdminLayout from "./components/common/Admin/AdminLayout";
import AdminPlayerList from "./pages/admin/AdminPlayerList";
import AdminPrediction from "./pages/admin/AdminPrediction";
import NewMatchPage from "./pages/admin/NewMatchPage";
import PlayerEditPage from "./pages/admin/PlayerEditPage";
import VideoList from "./pages/user/VideoList"
import AdminVideo from "./pages/admin/AdminVideo"
import CreatePostPage from "./pages/user/CreatePostPage";
import PostViewPage from "./pages/user/PostViewPage";
import PostListPage from "./pages/user/PostListPage";
import PostEditPage from "./pages/user/PostEditPage";
import AdminPostList from "./pages/admin/AdminPostList";
import AdminPostView from "./pages/admin/AdminPostView";
import UnauthHome from "./pages/unauthenticated/UnauthHome";

function App() {
  return (
    <div data-theme="dark">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin" element={<Home />} />
              <Route path="/admin/players" element={<AdminPlayerList />} />
              <Route path="/admin/players/new" element={<NewPlayerPage />} />
              <Route path="/admin/players/edit/:id" element={<PlayerEditPage />} />
              <Route path="/admin/predictions" element={<AdminPrediction />} />
              <Route path="/admin/predictions/new" element={< NewMatchPage />} />
              <Route path="/admin/posts" element={<AdminPostList />} />
              <Route path="/admin/posts/:id" element={<AdminPostView />} />
              <Route path="/admin/videos" element={<AdminVideo />} />
            </Route>
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/" element={<Home />} />
              <Route path="/players" element={<PlayerListPage />} />
              <Route path="/players/:id" element={<ProfilePage />} />
              <Route path="/predictions" element={<PredictionPage />} />
              <Route path="/posts" element={<PostListPage />} />
              <Route path="/posts/new" element={<CreatePostPage />} />
              <Route path="/posts/:id" element={<PostViewPage />} />
              <Route path="/posts/:id/edit" element={<PostEditPage />} />
              <Route path="/error/:status" element={<ErrorPage />} />
              <Route path="/news" element={<NewsListPage />} />
              <Route path="/live" element={<LiveListPage />} />
              <Route path="/videos" element={<VideoList />} />
              <Route path="/my" element={<MyPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>
            <Route element={<LoginLayout />}>
              <Route path="/feed" element={<UnauthHome />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<UnprotectingRoute><LoginForm /></UnprotectingRoute>} />
              <Route path="/social" element={<SocialLoginPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
