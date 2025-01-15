import React, { useState } from "react";
import "../../styles/home.css";
import FeaturesCarousel from "../component/featuresCarousel.jsx";
import OpinionsBoard from "../component/opinionsBoard.jsx";
import SuperposedTitle from "../component/superposedTitle.jsx";
import Jumbotron from "../component/jumbotron.jsx";
import SuperposedJumbo from "../component/superposedJumbo.jsx";
import WhyChooseLearnVault from "../component/WhyChooseLearnVault.jsx";

export const Home = () => {
  const [currentBackground, setCurrentBackground] = useState("#FFD700");

  const handleBackgroundChange = (newColor) => {
    setCurrentBackground(newColor);
  };

  return (
    <div className="home">
      <Jumbotron />
      <SuperposedJumbo />
      <FeaturesCarousel />
      <WhyChooseLearnVault />
      <SuperposedTitle text="OUR STUDENTS SHARE THEIR EXPERIENCES" dynamicColor={currentBackground}/>
      <OpinionsBoard onBackgroundChange={handleBackgroundChange} />
    </div>
  );
};
