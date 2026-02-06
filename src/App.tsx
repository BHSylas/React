import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import { AuthProvider } from "./components/provider/AuthProvider";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./pages/user/RegisterForm";
import { AuthModalProvider } from "./components/provider/AuthModalProvider";
import { ClassListPage } from "./pages/user/ClassListPage";
import ClassViewPage from "./pages/user/ClassViewPage";
import { BoardListPage } from "./pages/user/BoardListPage";
import MyPage from "./pages/user/MyPage";
import { BoardViewPage } from "./pages/user/BoardViewPage";
import UnityTestPage from "./pages/user/UnityTestPage";
import NewClassPage from "./pages/prof/NewClassPage";
import { MetaTestUpload } from "./pages/prof/MetaTestUploadPage";
import MetaTestPage from "./pages/prof/MetaTestPage";

function App() {
  return (
    <div data-theme="light">
      <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              </Route>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/my" element={<MyPage />} />
                <Route path="/class" element={<ClassListPage />} />
                <Route path="/class/:classId" element={<ClassViewPage />} />
                <Route path="/class/new" element={<NewClassPage />} />
                <Route path="/board" element={<BoardListPage />} />
                <Route path="/board/:postId" element={<BoardViewPage />} />
                <Route path="/unity-test" element={<UnityTestPage />} />
                <Route path="/metaverse/upload/:id?" element={<MetaTestUpload />} />
                <Route path="/metaverse/page/:id" element={<MetaTestPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthModalProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
