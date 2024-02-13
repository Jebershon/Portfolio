import { GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import birds from 'vanta/src/vanta.birds';
import './/Aboutme.css';
import file from "./Asserts/J Jebershon vetha singh-717821f219.pdf";
import './ParticalBg.css';
function ParticalBg() {
  useEffect(()=>{
    birds({
      el:'#vanta',
      speed:'50'
    })
  },[]);
  return (
    <div>
      <div className='bg-part' id='vanta'>
                <Row>
                  <Col className="text-center" lg={12}>
                      <div>
                        <h1><span className='intro-text'>J Jebershon vetha singh</span></h1>
                        <h4><span className='intro-text'>Web Developer / FullStack Developer</span></h4>
                        <p>
                          <ul class="fh5co-social-icons">
                            <li><a href="https://twitter.com/jebershon"><i><Twitter/></i></a></li>
                            <li><a href="https://instagram.com/jebxson?igshid=NzZlODBkYWE4Ng=="><i><Instagram/></i></a></li>
                            <li><a href="https://www.linkedin.com/in/jebershon-vetha-singh/"><i><LinkedIn/></i></a></li>
                            <li><a href="https://github.com/Jebershon"><i><GitHub/></i></a></li>
                          </ul>
                        </p>
                          <Row>
                              <Col lg={12}>
                              <a
                              href={file}
                              download="J Jebershon vetha singh"
                              target="_blank"
                              rel="noreferrer"
                              >
                              <button className='game-btn'>
                                  ꒯ꄲꅐꋊ꒒ꄲꋬ꒯ ꉔ꒦
                                  <div id="clip">
                                      <div id="leftTop" class="corner"></div>
                                      <div id="rightBottom" class="corner"></div>
                                      <div id="rightTop" class="corner"></div>
                                      <div id="leftBottom" class="corner"></div>
                                  </div>
                                  <span id="rightArrow" class="arrow"></span>
                                  <span id="leftArrow" class="arrow"></span>
                              </button>
                              </a>
                              </Col>
                          </Row>
                      </div>
                  </Col>
                </Row>
      </div>
    </div>
  );
}
export default ParticalBg;