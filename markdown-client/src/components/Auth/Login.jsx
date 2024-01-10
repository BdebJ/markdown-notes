import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loginUser } from '../../util/backendUtils';
import { EmailLabel, PasswordLabel, StyledButton } from '../Auth/AuthComponents';

import './AuthPages.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username_input: '', password_input: '' });

    const formDataChangeHandler = (event) => {
        const { id, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleLogin = (event) => {
        event.preventDefault();

        loginUser(formData.username_input, formData.password_input)
            .then((res) => {
                navigate('/');
            })
            .catch((rej) => {
                if (rej instanceof TypeError && rej.message === 'Failed to fetch') {
                    toast.error('Error: Unable to connect to server');
                } else {
                    toast.error(`Error: ${rej.error}`);
                }
            });
    };

    const redirectSignup = (event) => {
        event.preventDefault();
        navigate('/signup');
    };

    return (
        <>
            <ToastContainer />
            <div className="auth--container">
                <form className="auth--form" onSubmit={handleLogin}>
                    <h1 className="auth--header">Markdown Notes</h1>

                    <EmailLabel
                        email={formData.username_input}
                        formDataChangeHandler={formDataChangeHandler}
                    />

                    <PasswordLabel
                        password={formData.password_input}
                        formDataChangeHandler={formDataChangeHandler}
                    />

                    <div className="auth--btnset">
                        <StyledButton
                            text="Login"
                            style="elegant"
                            id="login--btn"
                            onClick={handleLogin}
                        />
                        <StyledButton
                            text="Sign up"
                            style="flat"
                            id="signup--btn"
                            onClick={redirectSignup}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
