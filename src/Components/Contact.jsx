import 'bootstrap/dist/css/bootstrap.css';
import React from "react";
import { Card, Container } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ".//Contact.css";

import MarkersMap from './Map/Marker';

function Contact(){
    return(
        <div>
            <Container className='bg'>
            <Row>
                <Col sm={12}>
                <div>
                    <Card className='Map bg' style={{marginTop:"12px",marginBottom:"12px",marginLeft:"12px",marginRight:"12px"}}>
                        <h2>Address Map</h2>
                        <hr/>
                    <MarkersMap/>
                    </Card>
                </div>
                </Col>
            </Row>
            </Container>
        </div>
    );
}
export default Contact;