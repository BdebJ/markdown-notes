import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

        registerUser(formData.username_input, formData.password_input)
            .then((res) => {
                navigate('/login');
            })
            .catch((err) => {
                console.error('Failed registration. Error:', err);
            });
    };

    const redirectLogin = (event) => {
        event.preventDefault();
        navigate('/login');
    };

    return (
        <>
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

                    <div className="auth--btnset">
                        <StyledButton
                            text="Sign up"
                            style="elegantflat"
                            id="signup--btn"
                            onClick={handleSignup}
                        />
                    </div>

                    <div style={{ textAlign: 'center', margin: '50px 0' }}>
                        <h4 style={{ margin: '0' }}>
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
