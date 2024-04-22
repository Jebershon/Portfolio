import { Card, Container , Carousel} from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import './/Myskill.css';
import  html from './Asserts/icons8-html-logo-96.png';
import css from './Asserts/icons8-css3-96.png';
import js from './Asserts/icons8-javascript-96.png';
import react from './Asserts/icons8-react-100.png';
import  java from './Asserts/icons8-java-logo-96.png';
import python from './Asserts/icons8-python-96.png';
import boot from './Asserts/icons8-bootstrap-logo-96.png';
import solidity from './Asserts/icons8-solidity-96.png';
import sql from './Asserts/icons8-sql-96.png';
import mongodb from './Asserts/mongoDB.png';
import github from './Asserts/icons8-github-96.png';
import postman from './Asserts/postman.png';
import figma from './Asserts/icons8-figma-96.png';
import azure from './Asserts/icons8-azure-96.png';
import next from './Asserts/icons8-nextjs-96.png';
import typescript from './Asserts/icons8-typescript-96.png';

import { CodeOutlined, DeveloperModeOutlined, Diversity2Outlined } from "@mui/icons-material";
function Myskills(){
    return(
        <Container className="bg mt-3 mb-3">
        <Row>
          <Col lg={12}>
          <center><h2 className='p-2 mt-2'>Skills</h2></center>
          <hr/>
          <Container className="mt-5 mb-5">
          <Row className="mb-2">
          <Card className="con" data-aos="zoom-in">
          <h3 style={{color:"aqua",fontVariant:"all-small-caps"}}><DeveloperModeOutlined/> Technical</h3>
          <Carousel interval={2000}>
            <Carousel.Item>
            <div className="flex" style={{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#ff6d00"}}>HTML</span>
                    <img src={html} alt="HTML" width={96} height={96} className="m-5"></img>
                    </div>
    
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#039be5"}}>CSS</span>
                    <img src={css} alt="CSS" width={96} height={96} className="m-5"></img>
                    </div>
             
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#f7df1e"}}>JavaScript</span>
                    <img src={js} alt="Javascript" width={96} height={96} className="m-5"></img>
                    </div>
             
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#a64aff"}}>Solidity</span>
                    <img src={solidity} alt="Solidity" width={96} height={96} className="m-5"></img>
                    </div>
   
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#5663af"}}>SQL</span>
                    <img src={sql} alt="SQL" width={96} height={96} className="m-5"></img>
                    </div>
            </div>
            </Carousel.Item>
            <Carousel.Item>
            <div className="flex" style={{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#38bcd1"}}>React</span>
                    <img src={react} alt="react" width={96} height={96} className="m-5"></img>
                    </div>

                    <div className="tool">
                    <span class="tooltiptext" style={{color:"white"}}>NextJs</span>
                    <img src={next} alt="NextJs" width={96} height={96} className="m-5"></img>
                    </div>
                   
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"gray"}}>Typescript</span>
                    <img src={typescript} alt="Typescript" width={96} height={96} className="m-5"></img>
                    </div>
                    
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#1565c0"}} >Java</span>
                    <img src={java} alt="Java" width={96} height={96} className="m-5"></img>
                    </div>
                    
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#ffce14"}}>Python</span>
                    <img src={python} alt="Python" width={96} height={96} className="m-5"></img>
                    </div>
                   
                    
            </div>       
            </Carousel.Item>
            <Carousel.Item>
            <center>
           <div className="flex" style={{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center"}}>
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"white"}}>Github</span>
                    <img src={github} alt="Github" className="m-5"></img>
                    </div>
                   
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"cyan"}}>Figma</span>
                    <img src={figma} alt="Figma" width={96} height={96} className="m-5"></img>
                    </div>

                    <div className="tool">
                    <span class="tooltiptext" style={{color:"orange"}}>Postman</span>
                    <img src={postman} alt="Postman" className="m-5" width={96} height={96}></img>
                    </div>
                   
                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#039be5"}}>Azure</span>
                    <img src={azure} alt="Azure" width={96} height={96} className="m-5"></img>
                    </div>

                    <div className="tool">
                    <span class="tooltiptext" style={{color:"#57ac46"}}>MongoDB</span>
                    <img src={mongodb} alt="MongoDB" width={96} height={96} className="m-5"></img>
                    </div>
           </div>
            </center>
            </Carousel.Item>
            </Carousel>
                </Card>
            </Row>
            <Row>
              <Card className="con" data-aos="zoom-in">
                    <h3 style={{color:"aqua",fontVariant:"all-small-caps"}}><Diversity2Outlined/> interpersonal skills</h3>
                    <center>
                    <Row lg={4} className="m-3 justify-content-center">
                    <Card className="m-3 bg" data-aos="flip-left" data-aos-duration="2000">
                        <div class="details">
                            <center><img src="https://img.icons8.com/?size=160&id=0dbdoPcVxc3N&format=png" alt="image ref" width={100} height={100}></img></center>
                            <h6 style={{color:"orange"}}>Adaptation to Technology</h6>
                            <p>Staying up-to-date with the latest technologies and advancements in your field ensures that you can quickly adapt to new tools and systems as they emerge.</p>
                        </div>
                    </Card>
                    <Card className="m-3 bg" data-aos="flip-left" data-aos-duration="2000">
                        <div class="details">
                        <center><img src="https://img.icons8.com/?size=160&id=65174&format=png" alt="image ref" width={100} height={100}></img></center>
                            <h6 style={{color:"orange"}}>Creativity and Innovation</h6>
                            <p>Approaching challenges with an open mind and looking for unconventional solutions can lead to innovative ideas that can set you apart.</p>
                        </div>
                    </Card>
                    <Card className="m-3 bg" data-aos="flip-left" data-aos-duration="2000">
                        <div class="details">
                        <center><img src="https://img.icons8.com/?size=160&id=64478&format=png" alt="image ref" width={100} height={100}></img></center>
                            <h6 style={{color:"orange"}}>Effective Communication</h6>
                            <p>Listening carefully to others' perspectives helps you understand their needs and tailor your communication accordingly.</p>
                        </div>
                    </Card>
                    <Card className="m-3 bg" data-aos="flip-left" data-aos-duration="2000">
                        <div class="details">
                        <center><img src="https://img.icons8.com/?size=160&id=113644&format=png" alt="image ref" width={100} height={100}></img></center>   
                            <h6 style={{color:"orange"}}>Time Management</h6>
                            <p>Knowing how to prioritize tasks based on importance and urgency helps you manage your time more effectively and meet deadlines.</p>
                        </div>
                    </Card>
                    <Card className="m-3 bg" data-aos="flip-left" data-aos-duration="2000">
                        <div class="details">
                           <center><img src="https://img.icons8.com/?size=128&id=fvm3GrKsY12i&format=png" alt="image ref" width={100} height={100}></img></center>
                            <h6 style={{color:"orange"}}>Collaboration and Teamwork</h6>
                            <p>Being open to different perspectives and ideas from team members can lead to more creative and effective solutions.</p>
                        </div>
                    </Card>
                    </Row>
                    </center>
                </Card>
          </Row>
          </Container>
          </Col>
        </Row>
    </Container>
    );
}
export default Myskills;