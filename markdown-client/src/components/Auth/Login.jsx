import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            .catch((err) => {
                console.error('Failed login. Error:', err);
            });
    };

    const redirectSignup = (event) => {
        event.preventDefault();
        navigate('/signup');
    };

    return (
        <>
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
