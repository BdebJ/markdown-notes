import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EmailLabel, PasswordLabel, LoginButton, SignupButton } from './AuthComponents';

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
        //Handle Login
    };

    const handleSignup = (event) => {
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
                        <LoginButton handleLogin={handleLogin} />
                        <SignupButton handleSignup={handleSignup} />
                    </div>
                </form>
            </div>
        </>
    );
}
