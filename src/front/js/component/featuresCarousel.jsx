import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "../../styles/featuresCarousel.css"

function FeaturesCarousel() {
    return (
      <section className="features-carousel py-5">
        <div className="container">
          <h2 className="text-center mb-4">Features</h2>
          <Carousel interval={3000} fade>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Collaborative Resource Sharing</h3>
                <p>
                  Share and access educational materials with a global community
                  of learners.
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Advanced Search and Filters</h3>
                <p>
                  Easily find what you need with robust search and filtering
                  options.
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Gamified Learning</h3>
                <p>
                  Stay motivated with achievements, badges, and progress tracking.
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Community Interaction</h3>
                <p>
                  Engage with others through discussions, reviews, and
                  recommendations.
                </p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Personalized Experience</h3>
                <p>
                  Enjoy tailored recommendations and planning tools for your
                  learning goals.
                </p>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </section>
    );
  }
  
  export default FeaturesCarousel;