import { Outlet } from "react-router";
import Navbar from "../common/Navbar";
import {Footer} from "../common/Footer";
import PageContainer from "../common/PageContainer";
import { AccountSidebar, MobileAccountMenu } from "../common/AccountSidebar";

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <Navbar />

      {/* Full-bleed on its own — deliberately OUTSIDE PageContainer below,
          see the comment on MobileAccountMenu for why. */}
      <MobileAccountMenu />

      <PageContainer className="flex flex-col gap-6 py-6 lg:flex-row lg:items-start">
        <AccountSidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </PageContainer>

      <Footer />
    </div>
  );
}