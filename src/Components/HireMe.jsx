import emailjs from '@emailjs/browser';
import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import Recived from './Asserts/Developer discussing different options.gif';
import './HireMe.css';
function HireMe(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showDiv, setShowDiv] = useState(true);
      const handleSubmit = () => {
        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
          alert("Fill All the fields");
          return; // Exit early if any field is empty
        }
        setShowDiv(false);
        // Your EmailJS service ID, template ID, and Public Key
        const serviceId = 'service_doz5mob';
        const templateId = 'template_ps60qzk';
        const publicKey = 'fLhUn6vHPw4-r_ZvX';
    
        // Create a new object that contains dynamic template params
        const templateParams = {
          from_name: name,
          from_email: email,
          to_name: 'J Jebershon vetha singh',
          message: message,
        };
        // Send the email using EmailJS
        emailjs.send(serviceId, templateId, templateParams, publicKey)
          .then((response) => {
            alert('Email sent successfully!', response);
            setName('');
            setEmail('');
            setMessage('');
            setShowDiv(false);
          })
          .catch((error) => {
            console.error('Error sending email:', error);
          });
        }
        useEffect(() => {
          if (!showDiv) {
              // Perform any cleanup or additional actions when showDiv changes to false
          }
      }, [showDiv]);
    return (
        <div>
          {showDiv ? ( 
            <div>
            <h6 class="text-uppercase fw-bold">Contact me.</h6>
            <form>
            <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">UserName</label>
            <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Enter UserName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
            </div>
            <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Email address</label>
            <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="Enter Email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             />
            </div>
            <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Message</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
            </div>
            <Button type='button' onClick={(e)=>{handleSubmit()}} variant='outline-warning'>Send Mail</Button>
            </form>
            </div>)
            :(
              <div>
                <img src={Recived} alt="Recieved Successfully" width={300} height={300}></img>
                <Button onClick={()=>setShowDiv(true)} variant='outline-warning'>Send Again</Button>
              </div>
            )}
        </div>
    );
}
export default HireMe;