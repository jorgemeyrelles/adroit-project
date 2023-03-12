import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2B4976',
    },
    secondary: {
      main: '#A5C9EA',
    },
    background: {
      default: '#FEFEFE',
    },
    text: {
      main: '#4A4A4A',
      medium: '#7F7F7F',
      light: '#cccccc',
    },
    warning: {
      main: '#FA3737',
    },
  },
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    htmlFontSize: 16,
    fontFamily: ['Mukta', 'sans-serif'].join(','),
    fontSize: 16,
    h1: {
      fontFamily: 'Mukta',
      fontWeight: 400,
    },
    h2: {
      fontFamily: 'Mukta',
      fontWeight: 400,
    },
    h3: {
      fontFamily: 'Mukta',
      fontWeight: 400,
    },
    h4: {
      fontFamily: 'Mukta',
      fontWeight: 400,
    },
    h5: {
      fontFamily: 'Mukta',
      fontWeight: 400,
    },
    h6: {
      fontFamily: 'Mukta',
      fontWeight: 400,
    },
    body1: {
      fontFamily: 'Mukta',
      fontWeight: 400,
      fontSize: '1rem',
      color: '#4A4A4A',
    },
    body2: {
      fontFamily: 'Mukta',
      fontWeight: 600,
      color: '#4A4A4A',
    },
  },
  background: {
    default: '#ffffff',
  },
  overrides: {
    MuiMenu: {
      paper: {
        boxShadow: '0px 0px 4.5px rgba(187, 193, 227, 0.57)',
      },
    },
    PrivateTabIndicator: {
      colorSecondary: {
        backgroundColor: 'transparent',
      },
    },
    MuiBottomNavigationAction: {
      root: {
        minWidth: '64px',
      },
    },
    MuiFormControl: {
      root: {
        width: '100% !important',
      },
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(14px, 14px) scale(1)',
        zIndex: 1,
      },
    },
    MuiInputBase: {
      root: {
        width: '100% !important',
        backgroundColor: '#fff',
      },
      input: {
        padding: 0,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '6px',
      },
      notchedOutline: {
        border: '1px solid rgba(25, 25, 25, 0.32)',
      },
      input: {
        padding: '18px 16px',
      },
    },
    MuiDialogActions: {
      root: {
        padding: '8px 0px !important',
      },
    },
    MuiFormGroup: {
      root: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
    },
    MuiCard: {
      root: {
        display: 'flex !important',
        flexDirection: 'column !important',
        justifyContent: 'space-between !important',
      },
    },

  },
});
