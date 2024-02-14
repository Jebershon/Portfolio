import { Card, Container } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './/Myskill.css';
function Myskills(){
    return(
        <Container className="bg mt-3 mb-3">
        <Row>
          <Col lg={12}>
          <center><h2>MY Skills</h2></center>
          <hr/>
          <Container className="mt-5 mb-5">
          <Row xs={1} md={2} className="g-4">
              <Col data-aos="zoom-in">
              <Card className="con">
                    <h3 style={{color:"aqua"}}>MY CODING SKILLS</h3>
                    <div class="skills">
                        <div class="details">
                            <span>HTML</span>
                            <span className="num">90%</span>
                        </div>
                        <div class="bar">
                            <div id="html-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>CSS</span>
                            <span className="num">75%</span>
                        </div>
                        <div class="bar">
                            <div id="css-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Javascript</span>
                            <span className="num">82%</span>
                        </div>
                        <div class="bar">
                            <div id="js-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Java</span>
                            <span className="num">88%</span>
                        </div>
                        <div class="bar">
                            <div id="java-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>C</span>
                            <span className="num">78%</span>
                        </div>
                        <div class="bar">
                            <div id="c-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>python</span>
                            <span className="num">68%</span>
                        </div>
                        <div class="bar">
                            <div id="python-bar"></div>
                        </div>
                    </div>
                </Card>
              </Col>
              <Col data-aos="zoom-in">
              <Card className="con">
                    <h3 style={{color:"aqua"}}>MY SOFTSKILLS</h3>
                    <div class="skills">
                        <div class="details">
                            <span>Adaptation to Technology</span>
                            <span className="num">90%</span>
                        </div>
                        <div class="bar">
                            <div id="html-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Creativity and Innovation</span>
                            <span className="num">82%</span>
                        </div>
                        <div class="bar">
                            <div id="js-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Effective Communication</span>
                            <span className="num">88%</span>
                        </div>
                        <div class="bar">
                            <div id="java-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Time Management</span>
                            <span className="num">78%</span>
                        </div>
                        <div class="bar">
                            <div id="c-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Collaboration and Teamwork</span>
                            <span className="num">82%</span>
                        </div>
                        <div class="bar">
                            <div id="js-bar"></div>
                        </div>
                    </div>
                    <div class="skills">
                        <div class="details">
                            <span>Adaptability and Flexibility</span>
                            <span className="num">88%</span>
                        </div>
                        <div class="bar">
                            <div id="java-bar"></div>
                        </div>
                    </div>
                </Card>
              </Col>
          </Row>
          </Container>
          </Col>
        </Row>
    </Container>
    );
}
export default Myskills;