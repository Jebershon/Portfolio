import { Button, Card, Col, Container, Row } from "react-bootstrap";
import './Mypro.css';
import Blog from './Asserts/Blog_Management.png';
import Calc from './Asserts/Calculator.png';
import Task_Scheduler from './Asserts/Task_Scheduler.png';
import Ecom from './Asserts/culinary-Delights.png';
import { GitHub, Link } from "@mui/icons-material";

function MyProjects() {
  return (
    <section className="projects-section">
      <Container className="bg mt-3 mb-3 projects-container">
        <header className="projects-header">
          <h2 className="projects-title">My Projects</h2>
          <div className="projects-title-underline" />
        </header>

        <Row xs={1} md={2} lg={3} className="g-4 projects-row">
          <Col lg={6} className="p-3">
            <Card className="h-100 card-bg project-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="0">
              <div className="project-card-image img-hover-zoom">
                <Card.Img variant="top" src={Ecom} height={200} alt="Culinary Delights" className="ig" />
              </div>
              <Card.Body>
                <Card.Title>Culinary Delights</Card.Title>
                <Card.Text>
                  Culinary Delights: Uniting culinary excellence with tech innovation. Explore recipes, order groceries seamlessly, and access nutritional insights.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="footer">
                  <Button className="btn custom-cursor-button" href="https://culinarydelights.vercel.app/" target="_blank" rel="noopener noreferrer">
                    <Link fontSize="small" /> Preview
                  </Button>
                  <Button className="btn custom-cursor-button" href="https://github.com/Jebershon/Culinary-Delights" target="_blank" rel="noopener noreferrer">
                    <GitHub fontSize="small" /> Code
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={6} className="p-3">
            <Card className="h-100 card-bg project-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100">
              <div className="project-card-image img-hover-zoom">
                <Card.Img variant="top" src={Blog} height={200} alt="Blog Management" className="ig" />
              </div>
              <Card.Body>
                <Card.Title>Blog Management Tool</Card.Title>
                <Card.Text>
                  Blog management tools typically offer a range of functionalities to streamline the process of creating, editing, organizing, and optimizing blog content.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="footer">
                  <Button className="btn custom-cursor-button" href="https://jebershon-react-blog.netlify.app/" target="_blank" rel="noopener noreferrer">
                    <Link fontSize="small" /> Preview
                  </Button>
                  <Button className="btn custom-cursor-button" href="https://github.com/Jebershon/Blog_Jebershon.github.io" target="_blank" rel="noopener noreferrer">
                    <GitHub fontSize="small" /> Code
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={6} className="p-3">
            <Card className="h-100 card-bg project-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="200">
              <div className="project-card-image img-hover-zoom">
                <Card.Img variant="top" src={Task_Scheduler} height={200} alt="TaskFlow" className="ig" />
              </div>
              <Card.Body>
                <Card.Title>TaskFlow</Card.Title>
                <Card.Text>
                  The Simple Task Scheduler Application project aims to offer a hassle-free and efficient tool for individuals seeking a basic yet effective solution for managing their daily tasks.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="footer">
                  <Button className="btn custom-cursor-button" href="https://jebershon.github.io/TaskFlow/" target="_blank" rel="noopener noreferrer">
                    <Link fontSize="small" /> Preview
                  </Button>
                  <Button className="btn custom-cursor-button" href="https://github.com/Jebershon/TaskFlow" target="_blank" rel="noopener noreferrer">
                    <GitHub fontSize="small" /> Code
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={6} className="p-3">
            <Card className="h-100 card-bg project-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
              <div className="project-card-image img-hover-zoom">
                <Card.Img variant="top" src={Calc} height={200} alt="Calculator" className="ig" />
              </div>
              <Card.Body>
                <Card.Title>Calculator</Card.Title>
                <Card.Text>
                  The Simple Calculator Application is a versatile tool designed to provide users with a straightforward and efficient means of performing basic mathematical operations.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <div className="footer">
                  <Button className="btn custom-cursor-button" href="https://jebershon.github.io/calculator_jebershon.github.io/" target="_blank" rel="noopener noreferrer">
                    <Link fontSize="small" /> Preview
                  </Button>
                  <Button className="btn custom-cursor-button" href="https://github.com/Jebershon/calculator_jebershon.github.io" target="_blank" rel="noopener noreferrer">
                    <GitHub fontSize="small" /> Code
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default MyProjects;
