import { Download, GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import birds from 'vanta/src/vanta.birds';
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
                         <h1><span className='intro-text'>I'm Jebershon vetha singh</span></h1>
                         <h4 class="intro-text">FullStack Web Developer & Designer</h4>
                        <p>
                          <ul class="fh5co-social-icons">
                            <li className='transform'><a className='custom-cursor-link' href="https://twitter.com/jebershon"><i><Twitter/></i></a></li>
                            <li className='transform'><a className='custom-cursor-link' href="https://instagram.com/jebxson?igshid=NzZlODBkYWE4Ng=="><i><Instagram/></i></a></li>
                            <li className='transform'><a className='custom-cursor-link' href="https://www.linkedin.com/in/jebershon-vetha-singh/"><i><LinkedIn/></i></a></li>
                            <li className='transform'><a className='custom-cursor-link' href="https://github.com/Jebershon"><i><GitHub/></i></a></li>
                          </ul>
                        </p>
                        <br/>
                              <a
                              href={file}
                              download="J Jebershon vetha singh"
                              target="_blank"
                              rel="noreferrer"
                              className='custom-cursor-link'
                              >
                              <button className='bton custom-cursor-button' >
                                <p><Download/>Resume</p>
                              </button>
                              </a>

                      </div>
                  </Col>
                </Row>
      </div>
    </div>
  );
}
export default ParticalBg;