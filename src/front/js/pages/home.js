import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../../styles/home.css";
import FeaturesCarousel from "../component/featuresCarousel.jsx";
import OpinionsBoard from "../component/opinionsBoard.jsx";
import SuperposedTitle from "../component/superposedTitle.jsx";

export const Home = () => {
  const [currentBackground, setCurrentBackground] = useState("#FFD700");

  const handleBackgroundChange = (newColor) => {
    setCurrentBackground(newColor);
  };

  return (
    <div className="home">
      <section className="jumbotron text-center bg-primary text-white py-5">
        <Container>
          <h1>Discover, Learn, and Collaborate with LearnVault</h1>
          <p>
            LearnVault is your collaborative hub for educational resources,
            offering tools to upload, search, and download materials like
            videos, tutorials, and books.
          </p>
        </Container>
      </section>
      <FeaturesCarousel />
      <section className="information py-5">
        <Container>
          <h2 className="text-center mb-4">Why Choose LearnVault?</h2>
          <Row>
            <Col md={4}>
              <Card className="info-card text-center">
                <Card.Body>
                  <h5>Comprehensive Resources</h5>
                  <p>Access a wide variety of materials in one place.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="info-card text-center">
                <Card.Body>
                  <h5>Collaborative Community</h5>
                  <p>Connect with learners and educators worldwide.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="info-card text-center">
                <Card.Body>
                  <h5>Customizable Learning</h5>
                  <p>Personalize your experience to match your learning goals.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <SuperposedTitle
        text="OUR STUDENTS SHARE THEIR EXPERIENCES"
        dynamicColor={currentBackground}
      />
      <OpinionsBoard onBackgroundChange={handleBackgroundChange} />
    </div>
  );
};
