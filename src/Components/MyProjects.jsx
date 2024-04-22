import { Button, Card, Col, Container, Row } from "react-bootstrap";
import './/Mypro.css';
import Blog from './Asserts/Blog_Management.png';
import Calc from './Asserts/Calculator.png';
import Cart from './Asserts/Cartoon.png';
import Lib from './Asserts/Personal_lib.png';
import Task_Scheduler from './Asserts/Task_Scheduler.png';
import Task from './Asserts/Task_manager.png';
import Ecom from './Asserts/culinary-Delights.png';
function MyProjects(){
         return(
            <Container className="bg mt-3 mb-3">

                <center><h2 className='p-2 mt-2'>My Projects</h2></center>

                <hr/>

                <Row xs={1} md={3} className="g-4">
                <Col className="mb-2">
                    <Card className="h-100 card-bg">
                    <div className='img-hover-zoom'>
                        <Card.Img variant="top" src={Ecom} height={200} alt="Culinary Delights ref" className='ig'/>
                        </div>
                        <Card.Body>
                            <Card.Title>Culinary Delights</Card.Title>
                            <Card.Text>
                                Culinary Delights: Uniting culinary excellence with tech innovation. Explore recipes, order groceries seamlessly, and access nutritional insights.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button class="btn custom-cursor-button" href="https://culinarydelights.vercel.app/">Click me..</Button>
                        </Card.Footer>
                    </Card>
                </Col>

                <Col>
                    <Card className="h-100 card-bg">
                    <div className='img-hover-zoom'>
                        {/* <Card.Img variant="top" src={Blog} height={200} alt="Blog Management Ref" className='ig'/> */}
                        <iframe src="https://jebershon-react-blog.netlify.app/" style={{width:"100%"}} height={200} title="Blog Management"></iframe>
                        </div>
                        <Card.Body>
                            <Card.Title>Blog Management Tool</Card.Title>
                            <Card.Text>
                                Blog management tools typically offer a range of functionalities to streamline the process of creating, editing, organizing, and optimizing blog content
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button class="btn custom-cursor-button" href="https://jebershon-react-blog.netlify.app/">Click me..</Button>
                        </Card.Footer>
                    </Card>
                </Col>

                <Col>
                    <Card className="h-100 card-bg">
                    <div className='img-hover-zoom'>
                        {/* <Card.Img variant="top" src={Task_Scheduler} height={200} alt="TaskFlow Ref" className='ig'/> */}
                        <iframe src="https://jebershon.github.io/TaskFlow/" style={{width:"100%"}} height={200} title="TaskFlow"></iframe>
                        </div>
                        <Card.Body>
                            <Card.Title>TaskFlow</Card.Title>
                            <Card.Text>
                                The Simple Task Scheduler Application project aims to offer a hassle-free and efficient tool for individuals seeking a basic yet effective solution for managing their daily tasks.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button class="btn custom-cursor-button" href="https://github.com/Jebershon/TaskFlow">View webpage</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                </Row>
                <br/>

                <Row xs={1} md={3} className="g-4 justify-content-center">
                <Col>
                    <Card className="h-100 card-bg">
                    <div className='img-hover-zoom'>
                        <Card.Img variant="top" src={Lib} height={200} alt="Personal Library Ref" className='ig'/>
                        </div>
                        <Card.Body>
                            <Card.Title>Personal Library</Card.Title>
                            <Card.Text>
                                Our Personal Library Management System is designed to simplify this process, providing bibliophiles and knowledge enthusiasts with a digital platform to catalog, categorize, and explore their collection of books
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button class="btn custom-cursor-button" href="https://jebershon.github.io/Library_jebershon.github.io/">Click me..</Button>
                        </Card.Footer>
                    </Card>
                </Col>

                <Col>
                    <Card className="h-100 card-bg"> 
                    <div className='img-hover-zoom'>
                        {/* <Card.Img variant="top" src={Calc} height={200} alt="Calculator ref" className='ig'/> */}
                        <iframe src="https://jebershon.github.io/calculator_jebershon.github.io/" style={{width:"100%"}} height={200} title="Calculator"></iframe>
                        </div>
                        <Card.Body>
                            <Card.Title>Calculator</Card.Title>
                            <Card.Text>
                                The Simple Calculator Application is a versatile tool designed to provide users with a straightforward and efficient means of performing basic mathematical operations.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button class="btn custom-cursor-button" href="https://jebershon.github.io/calculator_jebershon.github.io/">Click me..</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <br/>
    </Container>
    );
}
export default MyProjects;