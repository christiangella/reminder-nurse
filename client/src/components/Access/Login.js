import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../../utils/auth';
import { LOGIN_USER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

const LoginForm = ({ setLoggedIn, switchForm }) => {
  // set initial form state
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
  });

  const [login, { loading }] = useMutation(LOGIN_USER);

  // set state for form validation
  const [validated] = useState(false);
  // se state for alert
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // checking if form has everything
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({ variables: { ...userFormData } });
      Auth.login(data.login.token);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      password: '',
    });
  };
  return (
    <article className="userForm">
      <Form
        className="form-container-login shadow"
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
      >
        <Alert
          className="alert"
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Incorrect username/password!
        </Alert>
        <Form.Group className="form-title">
          <h4 className="title-signup">Login</h4>
          <Form.Label className="label-usrName" htmlFor="username">
            Username
          </Form.Label>
          <Form.Control
            className="form-input"
            type="text"
            placeholder="👤 Type your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="form-title">
          <Form.Label className="label-usrName" htmlFor="password">
            Password
          </Form.Label>
          <Form.Control
            className="form-input"
            disabled={loading}
            type="password"
            placeholder="🔒 Type your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          className="form-submit-btn"
          disabled={
            !(userFormData.username && userFormData.password) || loading
          }
          type="submit"
          variant="success"
        >
          Submit
        </Button>
        <Button className="switchClick" onClick={switchForm}>
          Don't have an account? Sign up!
        </Button>
      </Form>
    </article>
  );
};

export default LoginForm;
