import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { Close } from '@mui/icons-material';

import { useLocation } from 'react-router';
import {
  CloseButton, DecisionArea, Modal, TextArea,
} from './styles';

import {
  generateCustomUrl,
  // addFieldViewCredentialsToLeaf,
  // leafUserAuthentication,
  // getUserToken,
  // getAllFields,
  // getAllOperationsFiles,
} from '../../service/apiLeaf';

export function FieldViewModal({ onClose, isOpen }) {
  const location = useLocation();
  const [customURL, setCustomURL] = useState('');

  useEffect(async () => {
    if (isOpen) {
      const customClimateUrl = await generateCustomUrl();
      setCustomURL(customClimateUrl);
    }
  }, [isOpen]);

  const redirectFieldViewAuthorizationPage = async () => {
    window.open(customURL, '_self');
  };

  // const encodeClientId = () => {
  //   const clientId = process.env.REACT_APP_CLIMATE_FIELDVIEW_CLIENT_ID;
  //   const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

  //   const encodedString = window.btoa(`${clientId}:${clientSecret}`);
  //   return encodedString;
  // };

  useEffect(async () => {
    const params = new URLSearchParams(location.search);
    const parsedParams = params.get('code');

    // const encoded = encodeClientId();
    if (parsedParams) {
      // const username = process.env.REACT_APP_LEAF_USER_EMAIL;
      // const password = process.env.REACT_APP_LEAF_USER_PASSWORD;

      // const { data: { id_token } } = await leafUserAuthentication(username, password);
      // const { data: { refresh_token } } = await getUserToken(parsedParams, encoded);
      // const fieldViewCredentials = await addFieldViewCredentialsToLeaf(id_token, refresh_token);
      // console.log({ fieldViewCredentials });
      // console.log({ id_token });
      // const allFields = await getAllFields(id_token);
      // const allOperationsFiles = await getAllOperationsFiles(id_token);
      // console.log({ allFields });
      // console.log({ allOperationsFiles });
    }
  }, []);

  return (
    <Modal
      fullWidth
      maxWidth="lg"
      open={isOpen}
      onClose={onClose}
    >
      <CloseButton>
        <Close />
      </CloseButton>

      <DialogTitle>
        Integração com Climate FieldView
      </DialogTitle>

      <TextArea>
        <DialogContentText>
          Você será redirecionado para a página de login do Climate FieldView
          para que concorde com os termos de compartilhamento de informações entre a Adroit Robotics
          e o Climate FieldView.
        </DialogContentText>
      </TextArea>

      <DecisionArea>
        <Button color="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          color="secondary"
          disabled={customURL === ''}
          onClick={redirectFieldViewAuthorizationPage}
        >
          Confirmar
        </Button>
      </DecisionArea>

    </Modal>
  );
}

FieldViewModal.propTypes = {
  props: PropTypes.node,
}.isRequired;
