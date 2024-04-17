import { GitHub, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import birds from 'vanta/src/vanta.birds';
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
      <div className='bg-part mb-3' id='vanta'>
                <Row>
                  <Col lg={12}>
                      <div className='intro-text'>
                         <h1><span>I'm Jebershon vetha singh</span></h1>
                         <h4>FullStack Web Developer & Designer</h4>
                        <p>
                          <ul class="fh5co-social-icons">
                            <li className='transform'><a className='custom-cursor-link' href="https://twitter.com/jebershon"><i><Twitter/></i></a></li>
                            <li className='transform'><a className='custom-cursor-link' href="https://instagram.com/jebxson?igshid=NzZlODBkYWE4Ng=="><i><Instagram/></i></a></li>
                            <li className='transform'><a className='custom-cursor-link' href="https://www.linkedin.com/in/jebershon-vetha-singh/"><i><LinkedIn/></i></a></li>
                            <li className='transform'><a className='custom-cursor-link' href="https://github.com/Jebershon"><i><GitHub/></i></a></li>
                          </ul>
                        </p>
                      </div>
                  </Col>
                </Row>
      </div>
    </div>
  );
}
export default ParticalBg;