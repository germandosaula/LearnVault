import React from "react";
import { Carousel, Tab, Tabs, Card, Container, Row, Col } from "react-bootstrap";
import "../../styles/home.css";

export const Home = () => {
  return (
    <div className="home">
      <section className="jumbotron text-center bg-primary text-white py-5">
        <Container>
          <h1>Discover, Learn, and Collaborate with LearnVault</h1>
          <p>
            LearnVault is your collaborative hub for educational resources, offering tools to upload, search, and download materials like videos, tutorials, and books.
          </p>
        </Container>
      </section>

      <section className="features-carousel py-5">
        <Container>
          <h2 className="text-center mb-4">Features</h2>
          <Carousel>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Collaborative Resource Sharing</h3>
                <p>Share and access educational materials with a global community of learners.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Advanced Search and Filters</h3>
                <p>Easily find what you need with robust search and filtering options.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Gamified Learning</h3>
                <p>Stay motivated with achievements, badges, and progress tracking.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Community Interaction</h3>
                <p>Engage with others through discussions, reviews, and recommendations.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="feature-slide text-center">
                <h3>Personalized Experience</h3>
                <p>Enjoy tailored recommendations and planning tools for your learning goals.</p>
              </div>
            </Carousel.Item>
          </Carousel>
        </Container>
      </section>

      <section className="opinions py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">What Our Users Say</h2>
          <Tabs defaultActiveKey="user1" id="opinions-tabs" className="justify-content-center">
            <Tab eventKey="user1" title="User 1">
              <Card className="p-4 text-center">
                <blockquote>
                  "LearnVault is a game-changer! I found all the resources I needed in one place."
                </blockquote>
                <footer className="blockquote-footer mt-2">User 1</footer>
              </Card>
            </Tab>
            <Tab eventKey="user2" title="User 2">
              <Card className="p-4 text-center">
                <blockquote>
                  "The gamified learning features keep me engaged and motivated."
                </blockquote>
                <footer className="blockquote-footer mt-2">User 2</footer>
              </Card>
            </Tab>
            <Tab eventKey="user3" title="User 3">
              <Card className="p-4 text-center">
                <blockquote>
                  "The search functionality is amazing! It saves so much time."
                </blockquote>
                <footer className="blockquote-footer mt-2">User 3</footer>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </section>

      {/* Information Section */}
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
    </div>
  );
};