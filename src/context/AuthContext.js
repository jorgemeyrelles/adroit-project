/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { login } from '../service/api';
import { storage } from '../utils/hooks/useLocalStorage';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [err, setErr] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const { username } = loginData;

    setLoading(true);

    login(loginData)
      .then((data) => {
        setErr(false);
        storage.set('token', data);
        storage.set('user', username);
        setLoading(false);
        return navigate('/dashboard');
      })
      .catch((error) => {
        setLoading(false);
        setErr(true);
        return error;
      });
  }

  function handleSignOut() {
    localStorage.clear();
    navigate('/');
  }

  const value = {
    err,
    setErr,
    handleSubmit,
    loading,
    loginData,
    setLoginData,
    handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;
