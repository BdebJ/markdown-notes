import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { EmailLabel, PasswordLabel, ConfirmPasswordLabel, StyledButton } from './AuthComponents';
import { registerUser } from '../../util/backendUtils';
import './AuthPages.css';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username_input: '',
        password_input: '',
        confirm_password_input: '',
    });

    const formDataChangeHandler = (event) => {
        const { id, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleSignup = (event) => {
        event.preventDefault();
        if (formData.username_input.length < 4) {
            toast.error('Error: Username must have atleast 4 characters.');
            return;
        }
        if (formData.password_input.length < 6) {
            toast.error('Error: Password must have atleast 6 characters.');
            return;
        }
        if (formData.password_input.length !== formData.confirm_password_input) {
            toast.error('Error: Passwords do not match');
            return;
        }
        registerUser(formData.username_input, formData.password_input)
            .then((res) => {
                toast.info(res.message, {
                    autoClose: 3000,
                    onClose: () => {
                        navigate('/login');
                    },
                });
            })
            .catch((rej) => {
                if (rej instanceof TypeError && rej.message === 'Failed to fetch') {
                    toast.error('Error: Unable to connect to server');
                } else {
                    toast.error(`Error: ${rej.error}`);
                }
            });
    };

    const redirectLogin = (event) => {
        event.preventDefault();
        navigate('/login');
    };

    return (
        <>
            <ToastContainer />
            <div className="auth--container">
                <form className="auth--form" onSubmit={handleSignup}>
                    <h1 className="auth--header">Markdown Notes</h1>

                    <EmailLabel
                        email={formData.username_input}
                        formDataChangeHandler={formDataChangeHandler}
                    />

                    <PasswordLabel
                        password={formData.password_input}
                        formDataChangeHandler={formDataChangeHandler}
                        autoComplete="new-password"
                    />

                    <ConfirmPasswordLabel
                        confirmPassword={formData.confirm_password_input}
                        formDataChangeHandler={formDataChangeHandler}
                    />
                    <h5>Password must have atleast 6 characters</h5>
                    <div className="auth--btnset">
                        <StyledButton
                            text="Sign up"
                            style="elegantflat"
                            id="signup--btn"
                            onClick={handleSignup}
                        />
                    </div>

                    <div className="auth--redirect">
                        <h4>
                            Already have an account?
                            <br />
                            Login in below
                        </h4>
                        <StyledButton
                            text="Login"
                            style="elegant"
                            id="login--btn"
                            onClick={redirectLogin}
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
