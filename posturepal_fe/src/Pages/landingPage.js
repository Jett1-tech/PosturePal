import React, { useEffect } from "react";
import Header from "../Components/Header/header";
import VideoSection from "../Components/VideoSection/videoSection";
import HeroSections from "../Components/HeroSections/heroSection";
import PromoteSection from "../Components/PromoteSections/promoteSection";
import Product from "../Components/Products//product";
import FeatureSection from "../Components/FeatureSection/featureSection";
import FeatureSection1 from "../Components/FeatureSection/featureSection1";
import FeatureSection2 from "../Components/FeatureSection/featureSection2";
import Blog from "../Components/Blog/blog";
import AboutUs from "../Components/AboutUs/aboutUs";
import Footer from "../Components/Footer/footer";
import AOS from "aos";
import "aos/dist/aos.css";
const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <VideoSection />
      </div>
      <div className="pt-10" data-aos="flip-up">
        <HeroSections />
      </div>
      <div
        id="collection-section"
        className="pt-10"
        data-aos="fade-up"
        data-aos-anchor-placement="center-bottom"
      >
        <PromoteSection />
      </div>
      <div id="product-section" data-aos="flip-up">
        <Product />
      </div>
      <div id="features-section" className="-mb-20" data-aos="fade-up">
        <FeatureSection1 />
      </div>
      <div className="-mb-20" data-aos="fade-up">
        <FeatureSection2 />
      </div>
      <div className="-mb-20" data-aos="fade-up">
        <FeatureSection />
      </div>
      <div data-aos="fade-up">
        <Blog />
      </div>
      <div id="company-section" data-aos="fade-up">
        <AboutUs />
      </div>
      <div className="-py-20">
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
