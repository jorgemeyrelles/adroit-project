// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import * as yup from 'yup';

function getValidationErrors(err) {
  const validationErrors = {};
  [err].forEach((error) => {
    if (error) {
      validationErrors[Object.keys(error)[0]] = error.message;
    }
  });

  return validationErrors;
}

const createError = (response) => {
  const error = new Error(response?.error || 'It is not organic error');
  error.code = response?.code || 404;
  error.name = 'CONTROLLED ERROR';
  return error;
};

function isExpiredToken(token) {
  try {
    const decodedToken = jwt_decode(token);
    if ((decodedToken.exp) < (Math.floor(Date.now() / 1000))) {
      throw Error;
    }
    return false;
  } catch (error) {
    return true;
  }
}

const schema = yup.object().shape({
  username: yup.string().required('E-mail vazio/inválido').min(3),
  password: yup.string().required('E-mail/senha inválido(s)').min(6),
});

async function handleYupValidation(username, password) {
  try {
    await schema.validate({ username, password });

    return false;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return true;
    }
  }
  return true;
}
createError.prototype = Error.prototype;

export {
  getValidationErrors,
  isExpiredToken,
  handleYupValidation,
  createError,
};
