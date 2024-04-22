import emailjs from '@emailjs/browser';
import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Recived from './Asserts/Developer discussing different options.gif';
import './HireMe.css';

function Loader(){
    return(
        <>
       <div class="loader">
        <div></div>
        <div></div>
       </div>
        </>
    );
}
function HireMe(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [showDiv, setShowDiv] = useState(true);
    const [load,setLoad] = useState(false);

    const handleSuccess = () => {
        toast.success('Email sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
        setShowDiv(false);
    }
    function isValidEmail(em) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log(emailRegex.test(em));
        return emailRegex.test(em);
    }
    const handleValidation = () => {
        if (name.trim() === '' || email.trim() === '' || message.trim() === '' || isValidEmail(email) != true) {
            toast.error("Fill All the fields properly");
            return false; // Exit early if any field is empty
        }
        else{
            return true;
        }
    }

    const handleSubmit = () => {
        setLoad(true);
        if (!handleValidation()) {
            setLoad(false);
            return;
        }
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
                handleSuccess();
                setLoad(false);
            })
            .catch((error) => {
                setLoad(false);
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
            <ToastContainer position="bottom-center" />
            {showDiv ? (
                <div>
                    <h6 className="text-uppercase fw-bold m-3">Hire me.</h6>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">UserName</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter UserName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Message</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Enter Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div>
                            {load ? <center><Loader/></center> : <Button type='button' onClick={handleSubmit} variant='outline-warning' className='custom-cursor-button res'>Send Mail</Button>}
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <img src={Recived} alt="Recieved Successfully" width={300} height={300}></img>
                    <Button onClick={() => setShowDiv(true)} variant='outline-warning' className='custom-cursor-button'>Send Again</Button>
                </div>
            )}
        </div>
    );
}

export default HireMe;
