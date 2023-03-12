import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useNavigate } from 'react-router';

import {
  Alert, InputAdornment, Slide, Snackbar,
} from '@mui/material';
import { AlternateEmailOutlined, LockOutlined } from '@mui/icons-material';

import useMediaQuery from '@mui/material/useMediaQuery';
import { HelmetHead } from '../../components/HelmetHead';
import {
  LoginContainer, LoginInput, SubmitButton, Wrapper,
} from './styles';

import { AuthContext } from '../../context/AuthContext';
import { handleYupValidation, isExpiredToken } from '../../utils/getValidationErrors';

export function Login() {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);

  const {
    err, setErr, handleSubmit, loading, loginData, setLoginData,
  } = useContext(AuthContext);

  const handleChange = ({ target: { value, name } }) => {
    // modifica status do error
    setErr(false);
    // coleta valores do input
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const local = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    // autoredirect to dashboard if token is still valid
    if (!isExpiredToken(local)) {
      return navigate('/dashboard');
    }
    return false;
  }, []);

  useEffect(() => {
    const { username, password } = loginData;
    // validação com yup
    handleYupValidation(username, password)
      .then((response) => setDisabled(response))
      .catch(() => setErr(true));
  }, [loginData]);

  const handleClose = (event, reason) => {
    setErr(false);
    if (reason === 'clickaway') {
      return false;
    }
    return true;
  };

  const matches = useMediaQuery('(min-width:390px)' && '(max-width:440px)');

  return (
    <>
      <HelmetHead title="Login | Leafsense" />
      <Wrapper maxWidth="xs">
        <img src="/assets/leafsense.png" alt="logo" />

        <LoginContainer
          maxWidth="xs"
          style={{
            bgcolor: matches && 'background.paper',
            width: matches && 380,
          }}
        >
          <div>
            <h1>Bem vindo(a)</h1>
            <p>Insira as credenciais para continuar</p>
            <form ref={formRef} onSubmit={handleSubmit}>
              <LoginInput
                name="username"
                fullWidth
                color="primary"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <LoginInput
                type="password"
                name="password"
                fullWidth
                color="primary"
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <SubmitButton
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                loading={loading}
                disabled={disabled}
              >
                <span>Entrar</span>
              </SubmitButton>
              <Snackbar
                open={err}
                autoHideDuration={4000}
                onClose={() => handleClose()}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={(props) => <Slide {...props} direction="left" />}
              >
                <Alert
                  variant="filled"
                  onClose={() => handleClose()}
                  severity="error"
                >
                  <span> E-mail ou senha inválido(s)</span>
                </Alert>
              </Snackbar>
            </form>
          </div>
        </LoginContainer>
      </Wrapper>
    </>
  );
}
