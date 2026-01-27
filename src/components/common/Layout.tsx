import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { NavPlace } from "./NavbarPlaceholder";
import AuthModal from "../Auth/AuthModal";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Temporary admin check, should be removed later */}
      <NavPlace />
      <div className="flex flex-1 px-4 lg:px-8 gap-6 pt-4 shadow">
        <AuthModal />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto space-y-4">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="h-auto bg-transparent fixed bottom-0 right-0 flex justify-end">
        <div className="flex flex-col m-4 space-y-2">
          <a href="#top" className="btn ml-2 border border-gray-300">▲</a>
        </div>
      </div>
    </div>
  );
}
