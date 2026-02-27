import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./pages/user/RegisterForm";
import { AuthModalProvider } from "./components/provider/AuthModalProvider";
import { LectureListPage } from "./pages/user/LectureListPage";
import LectureViewPage from "./pages/user/LectureViewPage";
import { BoardListPage } from "./pages/user/BoardListPage";
import MyPage from "./pages/user/MyPage";
import { BoardViewPage } from "./pages/user/BoardViewPage";
import UnityMetaversePage from "./pages/user/UnityMetaversePage";
import NewClassPage from "./pages/prof/NewClassPage";
import { MetaTestUpload } from "./pages/prof/MetaTestUploadPage";
import MetaTestPage from "./pages/prof/MetaTestPage";
import { BoardUploadPage } from "./pages/user/BoardUploadPage";
import AdminMainPage from "./pages/admin/AdminMainPage";
import { LectureQnaListPage } from "./pages/user/LectureQnaListPage";
import { ProfClassStudent } from "./pages/prof/profClassStudent";
import { BoardEditPage } from "./pages/user/BoardEditPage";
import { LectureQnAUploadPage } from "./pages/user/LectureQnaUploadPage";
import LecturePlayerPage from "./pages/user/LecturePlayerPage";
import LectureEditPage from "./pages/prof/LectureEditPage";
import LectureManagePage from "./pages/prof/LectureManagePage";
import AuthProvider from "./components/provider/AuthProvider";

function App() {
  return (
    <div data-theme="light">
      <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/home" element={<Home />} /> 
                {/* 
                기존 Home과 타 페이지의 Root Route가 달라서 Sidebar가 제대로 적용되지 않는 문제를 발견
                Home의 Route를 /home으로 변경하여 임시로 해결, 향후 전체적인 Route 구조 재검토 필요 (예: /user/home, /prof/home 등)
                */}
                <Route path="/my" element={<MyPage />} />
                <Route path="/class" element={<LectureListPage />} />
                <Route path="/class/:classId" element={<LectureViewPage />} />
                <Route path="/class/new" element={<NewClassPage />} />
                <Route path="/class/:classId/edit" element={<LectureEditPage />} />
                <Route path="/class/prof/:lectureId/enrollments" element={<ProfClassStudent />}/>
                <Route path="/class/qna/:lectureId" element={<LectureQnaListPage />} />
                <Route path="/class/qna/upload/:lectureId" element={<LectureQnAUploadPage />}/>
                <Route path="/class/:lectureId/player" element={<LecturePlayerPage />} />
                <Route path="/class/:classId/manage" element={<LectureManagePage />} />
                <Route path="/board" element={<BoardListPage />} />
                <Route path="/board/:postId" element={<BoardViewPage />} />
                <Route path="/board/upload" element={<BoardUploadPage />}/>
                <Route path="/board/edit/:postId" element={<BoardEditPage />}/>
                <Route path="/metaverse/upload/:id?" element={<MetaTestUpload />} />
                <Route path="/metaverse/page/:id" element={<MetaTestPage />} />
                <Route path="/admin" element={<AdminMainPage />} />
                <Route path="/unity" element={<UnityMetaversePage />} />
              </Route>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthModalProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
