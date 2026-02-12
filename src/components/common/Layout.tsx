import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
import { NavPlace } from "./NavbarPlaceholder";
import AuthModal from "../Auth/AuthModal";
import { scrollPage } from "../../utils/scrollPage";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [sideOpen, setSideOpen] = useState(false);
  //const toggleSide = () => { setSideOpen(!sideOpen); }
  const openSide = () => { setSideOpen(true); }
  const closeSide = () => { setSideOpen(false);}
  //used to prevent body scroll when sidebar is open
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (sideOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.removeProperty("--scrollbar-width");
    };
  }, [sideOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuClick={openSide}/>
      <NavPlace />
      <Sidebar isOpen={sideOpen} onClose={closeSide}/>
      <div className="flex flex-1 px-4 lg:px-8 gap-6 pt-4">
        <AuthModal />
        <div className="flex-1">
          <div className="max-w-7xl mx-auto space-y-4">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="
      h-auto 
      bg-transparent 
      fixed fixed-padding-adjust
      bottom-0 right-0 
      flex justify-end">
        <div className="flex flex-col m-4 space-y-2">
          <div className="btn ml-2 border border-gray-300" onClick={() => {scrollPage("top");}}>▲</div>
          <div className="btn ml-2 border border-gray-300" onClick={() => {scrollPage("bottom");}}>▼</div>
        </div>
      </div>
    </div>
  );
}
