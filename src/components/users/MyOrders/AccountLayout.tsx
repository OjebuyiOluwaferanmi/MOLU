import { Outlet } from "react-router";
import Navbar from "../common/Navbar";
import {Footer} from "../common/Footer";
import PageContainer from "../common/PageContainer";
import { AccountSidebar } from "../common/AccountSidebar";

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Navbar />
      <PageContainer className="flex flex-col items-start gap-4 py-6 sm:gap-6 lg:flex-row">
        <AccountSidebar />
        <div className="min-w-0 w-full flex-1">
          <Outlet />
        </div>
      </PageContainer>
      <Footer />
    </div>
  );
}