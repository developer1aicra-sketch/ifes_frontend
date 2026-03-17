import { useState } from "react";
import CertificateDrawer from "./roboclub/CertificateDrawer";
import CommunitySection from "./roboclub/CommunitySection";
import DashboardLoginSection from "./roboclub/DashboardLoginSection";
import HeroSection from "./roboclub/HeroSection";
import ShopSection from "./roboclub/ShopSection";
import WinnersSection from "./roboclub/WinnersSection";
import Navbar from "./roboclub/Navbar";

export const StadiumHome = ({ setPage, isAuthenticated }) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
// const  [page,setPage] = useState("home")
  return (
    <div className="animate-fadeIn">
      <Navbar
        onOpenCertificate={() => setIsCertificateOpen(true)}
        isAuthenticated={isAuthenticated}
      />
 
      <HeroSection  setPage={setPage} />
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
