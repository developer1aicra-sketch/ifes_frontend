import { useState } from "react";
import CertificateDrawer from "../components/roboclub/CertificateDrawer";
import CommunitySection from "../components/roboclub/CommunitySection";
import DashboardLoginSection from "../components/roboclub/DashboardLoginSection";
import HeroSection from "../components/roboclub/HeroSection";
import ShopSection from "../components/roboclub/ShopSection";
import WinnersSection from "../components/roboclub/WinnersSection";
import Navbar from "../components/roboclub/Navbar";
import AboutRoboClubSection from "../components/roboclub/AboutRoboClubSection";
import LearningTracksSection from "../components/roboclub/LearningTracksSection";
import RoboClubEventsSection from "../components/roboclub/RoboClubEventsSection";
import ProjectShowcaseSection from "../components/roboclub/ProjectShowcaseSection";
import TestimonialsCarousel from "../components/roboclub/TestimonialsCarousel";

export const StadiumHomeView = ({ setPage }) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
// const  [page,setPage] = useState("home")
  return (
    <div className="animate-fadeIn">
      <Navbar
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
 
      <HeroSection  setPage={setPage} />
      <AboutRoboClubSection />
      <LearningTracksSection />
      <RoboClubEventsSection />
      {/* <ProjectShowcaseSection /> */}
      {/* <TestimonialsCarousel /> */}
      <DashboardLoginSection />
      <CommunitySection />
      <WinnersSection />
      <ShopSection />
      <CertificateDrawer 
        isOpen={isCertificateOpen} 
        onClose={() => setIsCertificateOpen(false)} 
      />
    </div>
  );
};
