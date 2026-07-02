import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Center from "../components/center";
import TrustSafety from "../components/testmonal";
import Footer from "../components/footer";
import RideBooking from "../components/appdownload";
import HeroQuickRides from "../components/heroquick";

export default function Home() {
  return (
       <>
       <Navbar/>
       <Hero/>
       <Center/>
       <HeroQuickRides/>
       <RideBooking/>
       <TrustSafety/>
       <Footer/>
       </>
  );
}
