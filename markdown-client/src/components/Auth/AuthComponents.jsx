import './AuthComponents.css';

const EmailLabel = ({ email, formDataChangeHandler }) => (
    <>
        <label className="input--label">Email</label>
        <input
            className="auth--input"
            type="email"
            placeholder="Email"
            value={email}
            id="username_input"
            autoComplete="username"
            onChange={formDataChangeHandler}
        />
    </>
);

const PasswordLabel = ({ password, formDataChangeHandler, autoComplete = 'current-password' }) => (
    <>
        <label className="input--label">Password</label>
        <input
            className="auth--input"
            type="password"
            placeholder="Password"
            value={password}
            id="password_input"
            autoComplete={autoComplete}
            onChange={formDataChangeHandler}
        />
    </>
);

const ConfirmPasswordLabel = ({ confirmPassword, formDataChangeHandler }) => (
    <>
        <label className="input--label">Confirm Password</label>
        <input
            className="auth--input"
            type="password"
            placeholder="Password"
            value={confirmPassword}
            id="confirm_password_input"
            autoComplete="new-password"
            onChange={formDataChangeHandler}
        />
    </>
);

const StyledButton = ({ text, style = 'flat', id, onClick }) => (
    <button type="button" className={`auth--btn ${style}--btn`} id={id} onClick={onClick}>
        {text}
    </button>
);

export { EmailLabel, PasswordLabel, ConfirmPasswordLabel, StyledButton };
