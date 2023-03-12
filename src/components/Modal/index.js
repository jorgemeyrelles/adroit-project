import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ArrowBack, Close } from '@mui/icons-material';
import {
  Box,
  Button, CircularProgress,
} from '@mui/material';
import { StateGlobal } from '../../context/StateGlobal';
import {
  CloseButton,
  Container, Footer, Header, InputContainer, SubmitButton,
} from './styles';
import { theme } from '../../pages/themes/default';

export function Modal(props) {
  const {
    children,
    visible,
    onClose,
    onSubmit,
    disabled,
    loading,
  } = props;

  const { update } = useContext(StateGlobal);

  const status = update.loading ? 'ATUALIZAR' : 'SALVAR';
  const modalTitle = update.loading ? 'Editar relatório' : 'Novo relatório';

  return (
    <Container
      fullWidth
      maxWidth="lg"
      open={visible}
      onClose={onClose}
    >
      <Header>
        <CloseButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            [theme.breakpoints.down('md')]: {
              position: 'unset',
            },
          }}
        >
          <Close sx={{
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              display: 'none',
            },
          }}
          />
          <Box>
            <ArrowBack fontSize="small" sx={{ mr: 1 }} />
            <span>Voltar</span>
          </Box>
        </CloseButton>
        <h2>{modalTitle}</h2>
      </Header>

      <InputContainer>
        {children}
      </InputContainer>

      <Footer>
        {!loading && (
          <Button
            variant="text"
            color="warning"
            disableRipple
            disableTouchRipple
            onClick={onClose}
          >
            CANCELAR
          </Button>
        )}
        <SubmitButton
          onClick={onSubmit}
          disabled={disabled}
          color="primary"
          variant="contained"
          disableElevation
        >
          {loading ? (
            <CircularProgress
              style={{ color: '#fff' }}
              size={20}
            />
          ) : (
            status
          )}
        </SubmitButton>
      </Footer>
    </Container>
  );
}

Modal.propTypes = {
  props: PropTypes.node,
}.isRequired;
