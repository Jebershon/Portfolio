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
    }, 1);

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
                <Navbar.Brand href="#Home" className='brnd'>Portfolio</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto nav-underline">
                    <Nav.Link href="#Home">Home</Nav.Link>
                    <Nav.Link href="#Aboutme">Aboutme</Nav.Link>
                    <Nav.Link href="#skills">My Skills</Nav.Link>
                    <Nav.Link href="#projects">My Projects</Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link href="#Contactus" className='mt-3'>Contact us</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
            </Navbar>
            
            <br id="Home" />

            <ParticalBg/>

            <IconButton
            id="back"
            className={isVisible ? 'show' : ''}
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