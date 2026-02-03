import { useState } from "react";
import CertificateDrawer from "../components/roboclub/CertificateDrawer";
import CommunitySection from "../components/roboclub/CommunitySection";
import DashboardLoginSection from "../components/roboclub/DashboardLoginSection";
import HeroSection from "../components/roboclub/HeroSection";
import ShopSection from "../components/roboclub/ShopSection";
import WinnersSection from "../components/roboclub/WinnersSection";
import Navbar from "../components/roboclub/Navbar";

export const StadiumHomeView = ({setPage}) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
// const  [page,setPage] = useState("home")
  return (
    <div className="animate-fadeIn">
      <Navbar onOpenCertificate={() => setIsCertificateOpen(true)} />
 
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
