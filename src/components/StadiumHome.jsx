import { useState } from "react";
import CertificateDrawer from "./roboclub/CertificateDrawer";
import CommunitySection from "./roboclub/CommunitySection";
import DashboardLoginSection from "./roboclub/DashboardLoginSection";
import HeroSection from "./roboclub/HeroSection";
import { MakersSocialProofSection } from "./roboclub/MakersSocialProof";
import ShopSection from "./roboclub/ShopSection";
import WinnersSection from "./roboclub/WinnersSection";
import Navbar from "./roboclub/Navbar";
import AboutRoboClubSection from "./roboclub/AboutRoboClubSection";
import LearningTracksSection from "./roboclub/LearningTracksSection";
import RoboClubEventsSection from "./roboclub/RoboClubEventsSection";
import ProjectShowcaseSection from "./roboclub/ProjectShowcaseSection";
import TestimonialsCarousel from "./roboclub/TestimonialsCarousel";


export const StadiumHome = ({ setPage, isAuthenticated }) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
// const  [page,setPage] = useState("home")
  return (
    <div className="animate-fadeIn">
      <Navbar
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        isAuthenticated={isAuthenticated}
      />
 
      <HeroSection setPage={setPage} />
      <MakersSocialProofSection />
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
