import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import ".//Home.css";
import Aboutme from './Aboutme';
import Contact from './Contact.jsx';
import Footer from './Footer.jsx';
import MyProjects from './MyProjects';
import Myskills from './Myskills';
import ParticalBg from './ParticalBg.jsx';
function Home(){
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time of 5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

  window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll',window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
  }, false);
    return(
        <div>
          {isLoading ? (
            <center>
            <div className="spinner-box">
              <div className="configure-border-1">
                <div className="configure-core"></div>
              </div>
              <div className="configure-border-2">
                <div className="configure-core"></div>
              </div>
            </div>
            </center>
          ) : (
            <>
            <Navbar  collapseOnSelect expand="lg" className='nav-bg' fixed='top' data-bs-theme="dark">
            <div class="progrss"></div>
                <Navbar.Brand href="#Home" className='brnd custom-cursor-link'>Portfolio</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto nav-underline">
                    <center><Nav.Link className = "custom-cursor-link" href="#Home">Home</Nav.Link></center>
                    <center><Nav.Link className = "custom-cursor-link" href="#Aboutme">Aboutme</Nav.Link></center>
                    <center><Nav.Link className = "custom-cursor-link" href="#skills">My Skills</Nav.Link></center>
                    <center><Nav.Link className = "custom-cursor-link" href="#projects">My Projects</Nav.Link></center>
                  </Nav>
                  <Nav>
                    <br/>
                    <center><Nav.Link className = "custom-cursor-link" href="#Contactus">Contact us</Nav.Link></center>
                  </Nav>
                </Navbar.Collapse>
            </Navbar>
            
            <br id="Home" />

            <ParticalBg/>

            <IconButton
            id="back"
            className={isVisible ? 'show custom-cursor-link' : ''}
            onClick={scrollToTop}
            style={{ display: isVisible ? 'block' : 'none' }}
            ><KeyboardArrowUpIcon /></IconButton>

            <div className='margin-aboutme' id='Aboutme'>
            <Aboutme/>
            </div>

            <div id="skills">
            <Myskills/>
            </div>

            <div  id="projects">
            <MyProjects/>
            </div>

            <div id='Contactus'>
            <Contact/>
            <br/>
            <Footer/>
            </div>
            </>
             )}
            </div>
        );
}
export default Home;