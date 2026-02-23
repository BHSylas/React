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
import MetaList from "./pages/prof/MetaList";
import { BoardUploadPage } from "./pages/user/BoardUploadPage";
import AdminMainPage from "./pages/admin/AdminMainPage";
import AdminLecturePage from "./pages/admin/AdminLecturePage";
import { LectureQnaListPage } from "./pages/user/LectureQnaListPage";
import { ProfClassStudent } from "./pages/prof/profClassStudent";
import { BoardEditPage } from "./pages/user/BoardEditPage";
import { LectureQnAUploadPage } from "./pages/user/LectureQnaUploadPage";

function App() {
  return (
    <div data-theme="light">
      <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/my" element={<MyPage />} />
                <Route path="/class" element={<ClassListPage />} />
                <Route path="/class/:classId" element={<ClassViewPage />} />
                <Route path="/class/new" element={<NewClassPage />} />
                <Route path="/class/prof/:lectureId/enrollments" element={<ProfClassStudent />}/>
                <Route path="/class/qna/:lectureId" element={<LectureQnaListPage />} />
                <Route path="/class/qna/upload/:lectureId" element={<LectureQnAUploadPage />}/>
                <Route path="/board" element={<BoardListPage />} />
                <Route path="/board/:postId" element={<BoardViewPage />} />
                <Route path="/board/upload" element={<BoardUploadPage />}/>
                <Route path="/board/edit/:postId" element={<BoardEditPage />}/>
                <Route path="/unity-test" element={<UnityTestPage />} />
                <Route path="/metaverse/upload/:id?" element={<MetaTestUpload />} />
                <Route path="/metaverse/page/:id" element={<MetaTestPage />} />
                <Route path="/metaverse" element={<MetaList />}/>
                <Route path="/admin" element={<AdminMainPage />} />
                <Route path="/admin/lectures" element={<AdminLecturePage />} />
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
