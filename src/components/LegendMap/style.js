import { styled, Typography, Box } from '@mui/material';
import { gradientsColors } from '../../utils/colors';

export const TextLeg = styled(Typography)`
  color: white;
  font-size: smaller;
  font-style: italic;
  font-weight: bold;
  margin: -4px;
  position: relative;
  top: 5px; 
`;

export const Scale = styled(Box)`
  color: white;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-left: 10px;
  margin-top: -5px;
  width: 90%;
  & p {
    font-size: small;
  }
`;

export const ScaleCyan = styled(Box)`
  color: white;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: -5px;
  width: 90%;
  & p {
    font-size: small;
  };
`;

export const GradientDiv = styled(Box)`
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 30px;
  border-radius: 10px;
  position: absolute;
  max-height: 5em;
  right: 20px;
  text-align: -webkit-center;
  width: 40%; /* box retangular */
`;

export const GradientDefault = styled(Box)`
  position: relative;
  margin: 7px 0 0 0;
  width: 90%; /* box retangular */
  height: 0.5rem; /* box retangular */
  background-image: linear-gradient(to right, ${gradientsColors.default.join()});
`;

export const GradientViridisLighter = styled(Box)`
  position: relative;
  margin: 7px 0 0 0;
  width: 90%; /* box retangular */
  height: 0.5rem; /* box retangular */
  background-image: linear-gradient(to right, ${gradientsColors.viridisLighter.join()});
`;

export const GradientCyanYellow = styled(Box)`
  position: relative;
  margin: 7px 0 0 0;
  width: 90%; /* box retangular */
  height: 0.5rem; /* box retangular */
  background-image: linear-gradient(to right, ${gradientsColors.cyanYellow.join()});
`;

export const GradientBlueRed = styled(Box)`
  position: relative;
  margin: 7px 0 0 0;
  width: 90%; /* box retangular */
  height: 0.5rem; /* box retangular */
  background-image: linear-gradient(to right, ${gradientsColors.blueRed.join()});
`;

export const GradientPlasma = styled(Box)`
  position: relative;
  margin: 7px 0 0 0;
  width: 90%; /* box retangular */
  height: 0.5rem; /* box retangular */
  background-image: linear-gradient(to right, ${gradientsColors.plasma.join()});
`;

export const GradientCividis = styled(Box)`
  position: relative;
  margin: 7px 0 0 0;
  width: 90%; /* box retangular */
  height: 0.5rem; /* box retangular */
  background-image: linear-gradient(to right, ${gradientsColors.cividis.join()});
`;
