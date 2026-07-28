import Navbar from "../../components/common/Navbar";
import PageContainer from "../../components/common/PageContainer";
import { Promo } from "../../components/landingPage/promo";
import { DealOfTheDay } from "../../components/landingPage/DealOfTheDay";
import { RecommendedForYou } from "../../components/landingPage/RecommendedForYou";
import { BestSellingProducts } from "../../components/landingPage/BestSellingProducts";
import { RecentlyViewed } from "../../components/landingPage/RecentlyViewed"
import { RecommendedFeed } from "../../components/landingPage/RecommendedFeed";
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
