import { useAuth } from "../../hooks/useAuth";
import { AdminNavbar } from "./Admin/AdminNavbar";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { NavPlace } from "./NavbarPlaceholder";

export default function Layout() {
  const {username} = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      {username === "admin" ? <AdminNavbar /> : <Navbar />} {/* Temporary admin check, should be removed later */}
      <NavPlace />
      <div className="flex flex-1 px-4 lg:px-8 gap-6 pt-4">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <div className="h-auto bg-transparent fixed bottom-0 right-0 flex justify-end">
        <div className="flex flex-col m-4 space-y-2">
          <a href="#top" className="btn ml-2 bg-blue-800">▲</a>
        </div>
      </div>
    </div>
  );
}
