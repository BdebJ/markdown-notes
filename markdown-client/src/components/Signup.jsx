import { useState } from 'react';
import { EmailLabel, PasswordLabel, ConfirmPasswordLabel, SignupButton } from './AuthComponents';

export default function Signup() {
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
        //Handle signup
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
                    />

                    <ConfirmPasswordLabel
                        confirmPassword={formData.confirm_password_input}
                        formDataChangeHandler={formDataChangeHandler}
                    />

                    <div className="auth--btnset">
                        <SignupButton style='elegantflat' handleSignup={handleSignup} />
                    </div>
                </form>
            </div>
        </>
    );
}
