import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Col, Container, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { Instagram } from 'react-bootstrap-icons';
import './/Home.css';
import HireMe from './HireMe';
import { useState } from 'react';
function Footer(){
    return(
        <div>
            <footer class="text-center bg" style={{color:"aqua"}}>
                <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                    <div class="me-5 d-none d-lg-block">
                    <span>Get connected with me on social networks:</span>
                    </div>                <div>
                    <a href="https://maps.app.goo.gl/3XZXAsz2SnyprNLs6" class="me-4 text-reset">
                    <Icon.GeoAltFill/>
                    </a>
                    <a href="https://instagram.com/jebxson?igshid=NzZlODBkYWE4Ng==" class="me-4 text-reset">
                    <Instagram/>
                    </a>
                    <a class="me-4 text-reset">
                    <Icon.Whatsapp/>
                    </a>
                    <a href="https://www.linkedin.com/in/jebershon-vetha-singh/" class="me-4 text-reset">
                    <LinkedInIcon/>
                    </a>
                    <a href="https://github.com/Jebershon" class="me-4 text-reset">
                    <GitHubIcon/>
                    </a>
                    </div>
                    </section>
                    <Container>
                    <Row>
                    <Col lg={3}>
                        <br/>
                            <h6 class="text-uppercase fw-bold">Personal Portfolio</h6>
                            <p>
                            Welcome to our website, where every visitor is valued and appreciated.I leverage ChatGPT wisely to enhance organizational efficiency, fostering innovative solutions and streamlined workflows.
                            </p>
                    </Col>
                    <Col>
                    <br/>
                        <div>
                        <h6 class="text-uppercase fw-bold">Skills</h6>
                            <p>JavaScript</p>
                            <p>React</p>
                            <p>Node.js</p>
                            <p>Express</p>
                            <p>MongoDB</p>
                            <p>Git</p>
                            <p>Agile</p>
                        </div>
                    </Col>
                    <Col>
                        <br/>
                            <div>
                            <h6 class="text-uppercase fw-bold">Tools</h6>
                            <p>
                                <a href="https://code.visualstudio.com/" class="text-reset">VSCode</a>
                            </p>
                            <p>
                                <a href="https://azure.microsoft.com/en-in" class="text-reset">Azure</a>
                            </p>
                            <p>
                                <a href="https://www.eclipse.org/downloads/" class="text-reset">Eclipse</a>
                            </p>
                            <p>
                                <a href="https://www.bloodshed.net/" class="text-reset">Dev C++</a>
                            </p>
                            </div>
                    </Col>
                    <Col lg={3}>
                        <br/>
                            <div>
                            <HireMe/>
                            </div>
                    </Col>
                </Row>
                </Container>
                <br/>
                <div class="text-center" style={{backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                    © 2021 Copyright: &nbsp;
                <a class="text-reset fw-bold" href="https://github.com/Jebershon/jebershon.github.io">J Jebershon vetha singh</a>
                </div>
            </footer>
        </div>
    );
}
export default Footer;