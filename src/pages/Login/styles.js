import { Container, styled } from '@mui/material';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Touchables/Button';

export const Wrapper = styled('main')`
  height: 100vh;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
     display: flex;
     align-items: center;
     width: 100%;
     max-width: 250px;
     margin: 0 auto;
     padding: 20px 0;
  }
`;

export const LoginContainer = styled(Container)`
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0px 0px 4.5px rgb(187 193 227 / 60%);
  border-radius: 20px;

  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  h1 {
    text-transform: uppercase;
  }
  
  p {
    font-size: 1.15rem;
    margin-bottom: 2rem;
  }

  form {
    width: 100%;
    margin-top: .5rem;

    .MuiFormControlLabel-root {
      width: 100%;
    }
  }
`;

export const LoginInput = styled(Input)`
  margin-bottom: 1rem;
  border-radius: 10px;
  background-color: #fefefe;
  
  & input {
    height: 40px;
    padding: 0 .8rem;
  }

  svg {
    width: 1rem;
    color: #2B4976; 
  }  
`;

export const SubmitButton = styled(Button)`
  height: 40px;
  margin: 0;
  text-transform: uppercase;

  .MuiCircularProgress-svg {
    color: #ffffff;
  }
`;
