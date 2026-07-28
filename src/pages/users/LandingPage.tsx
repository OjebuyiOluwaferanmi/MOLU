import Navbar from "../../components/users/common/Navbar";
import PageContainer from "../../components/users/common/PageContainer";
import { Promo } from "../../components/users/landingPage/promo";
import { DealOfTheDay } from "../../components/users/landingPage/DealOfTheDay";
import { RecommendedForYou } from "../../components/users/landingPage/RecommendedForYou";
import { BestSellingProducts } from "../../components/users/landingPage/BestSellingProducts";
import { RecentlyViewed } from "../../components/users/landingPage/RecentlyViewed"
import { RecommendedFeed } from "../../components/users/landingPage/RecommendedFeed";
import { Fade } from "react-awesome-reveal";

export default function LandingPage() {
  return (
    <div className="bg-[#F1F1F1] min-h-screen">
      <Navbar />
      <PageContainer>
        <Fade triggerOnce direction="up" duration={600}>
          <Promo />
        </Fade>
        <Fade triggerOnce direction="up" duration={600}>
          <DealOfTheDay />
        </Fade>
        <Fade triggerOnce direction="up" duration={600}>
          <RecommendedForYou />
        </Fade>
        <Fade triggerOnce direction="up" duration={600}>
          <BestSellingProducts />
        </Fade>
        <Fade triggerOnce direction="up" duration={600}>
          <RecentlyViewed />
        </Fade>
        <Fade triggerOnce direction="up" duration={600}>
          <RecommendedFeed />
        </Fade>
      </PageContainer>
    </div>
  );
}
