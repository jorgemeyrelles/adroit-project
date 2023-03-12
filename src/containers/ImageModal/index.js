import React from 'react';
import PropTypes from 'prop-types';

import { TransformWrapper, TransformComponent } from '@kokarn/react-zoom-pan-pinch';
import {
  Backdrop, Box, CircularProgress, Fade, FormControl, FormControlLabel, FormLabel, Typography,
} from '@mui/material';
import {
  KeyboardArrowLeft, KeyboardArrowRight,
  Close, GetApp, Photo, Place,
} from '@mui/icons-material';
import {
  ClaheSwitch,
  CloseButton, ModalContainer, DownloadButton,
  ImageArea, ImageContainer, ImageControls,
  InfoContent, LoadingContent, PaperFade, NavigatePhotoButton,
} from './styles';

export function ImageModal(props) {
  const {
    open,
    onClose,
    data,
    imageHD,
    handleGetPreviousHDImage,
    handleGetNextHDImage,
    loading,
    handleImageDownload,
    handleChangeClahe,
    checked,
  } = props;

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
    >
      <Fade in={open}>
        <PaperFade>
          <CloseButton
            color="primary"
            type="button"
            onClick={onClose}
          >
            <Close color="primary" />
          </CloseButton>

          <ImageContainer>
            <NavigatePhotoButton
              color="primary"
              type="button"
              onClick={handleGetPreviousHDImage}
              sx={{ left: 0 }}
            >
              <KeyboardArrowLeft />
            </NavigatePhotoButton>

            <TransformWrapper>
              <ImageArea>
                <TransformComponent
                  wrapperStyle={{
                    display: 'flex',
                    height: '100%',
                    alignItems: 'center',
                  }}
                >
                  {loading
                    ? (
                      <LoadingContent>
                        <CircularProgress style={{ position: 'absolute' }} />
                      </LoadingContent>
                    )
                    : <img src={imageHD} alt="" />}
                </TransformComponent>

                <ImageControls>
                  <div>
                    <FormControl component="fieldset">
                      <FormControlLabel
                        control={(
                          <ClaheSwitch
                            color="primary"
                            checked={checked}
                            onChange={handleChangeClahe}
                            name="clahe"
                          />
                        )}
                      />
                    </FormControl>
                    <FormLabel component="legend">auto-brilho</FormLabel>
                  </div>
                  <DownloadButton
                    type="button"
                    title="Download"
                    onClick={() => handleImageDownload()}
                  >
                    <GetApp />
                  </DownloadButton>
                </ImageControls>

              </ImageArea>
            </TransformWrapper>

            <NavigatePhotoButton
              color="primary"
              type="button"
              onClick={handleGetNextHDImage}
              sx={{ right: 0 }}
            >
              <KeyboardArrowRight />
            </NavigatePhotoButton>
          </ImageContainer>

          <InfoContent>
            <Box>
              <p>Quadra</p>
              <p>{data.block_name}</p>
            </Box>
            <Box>
              <Typography color="primary">
                <Place />
                {`${data.lat}, ${data.lng}`}
              </Typography>
              <Typography color="primary">
                <Photo />
                {data.image_id}
              </Typography>
            </Box>
          </InfoContent>
        </PaperFade>
      </Fade>
    </ModalContainer>
  );
}

ImageModal.propTypes = {
  props: PropTypes.node,
}.isRequired;
