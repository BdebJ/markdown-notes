import { useState } from 'react';

export default function Login() {
    const [loginState, setLoginState] = useState('Login'); // States are 'Login' & 'Signup'
    const [formData, setFormData] = useState({ username_input: '', password_input: '', confirm_password_input: '' });

    const formDataChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const handleLogin = (event) => {
        event.preventDefault();
        if (loginState !== 'Login') {
            setLoginState('Login');
            setFormData({ username_input: '', password_input: '', confirm_password_input: '' });
        } else {
            //Handle login
        }
    };

    const handleSignup = (event) => {
        event.preventDefault();
        if (loginState !== 'Signup') {
            setLoginState('Signup');
            setFormData({ username_input: '', password_input: '', confirm_password_input: '' });
        } else {
            //Handle signup
        }
    };

    const LoginButton = () => (
        <button type="button" className={loginState === 'Login' ? 'active--btn' : 'inactive--btn'} id="login--btn" onClick={handleLogin}>
            Login
        </button>
    );

    const SignupButton = () => (
        <button type="button" className={loginState === 'Signup' ? 'active--btn' : 'inactive--btn'} id="signup--btn" onClick={handleSignup}>
            Sign up
        </button>
    );

    return (
        <>
            <div className="login--container">
                <form className="login--form" onSubmit={loginState === 'Login' ? handleLogin : handleSignup}>
                    <h1 className="login--header">Markdown Notes</h1>

                    <label className="input--label">Email</label>
                    <input
                        className="login--input"
                        type="email"
                        placeholder="Email"
                        value={formData.username_input}
                        id="username_input"
                        onChange={formDataChange}
                    />

                    <label className="input--label">Password</label>
                    <input
                        className="login--input"
                        type="password"
                        placeholder="Password"
                        value={formData.password_input}
                        id="password_input"
                        onChange={formDataChange}
                    />

                    {loginState === 'Signup' && (
                        <>
                            <label className="input--label">Confirm Password</label>
                            <input
                                className="login--input"
                                type="password"
                                placeholder="Password"
                                value={formData.confirm_password_input}
                                id="confirm_password_input"
                                onChange={formDataChange}
                            />
                        </>
                    )}

                    <div className="auth--btnset">
                        <LoginButton />
                        <SignupButton />
                    </div>
                </form>
            </div>
        </>
    );
}
