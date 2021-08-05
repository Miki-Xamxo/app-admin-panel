import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({

  palette: {
    primary: {
      main: 'rgb(29, 161, 242)',
      contrastText: '#fff',
    },

    secondary: {
      main: 'rgb(26, 145, 218)',
    },

    // secondary: {
    //   main: red.A700,
    //   contrastText: '#fff'
    // },
  },

  overrides: {

    MuiButton: {
      root: {
        borderRadius: 10,
        textTransform: 'none',
        fontSize: 16,
        height: 40,
        fontWeight: 700,
      },
      textPrimary: {
        paddingLeft: 20,
        paddingRight: 20,
      },
      outlinedPrimary: {
        borderColor: 'rgb(29, 161, 243)',
      },
    },


    MuiDialogActions: {
      root: {
        marginBottom: 8,
      },
    },

    MuiDialog: {
      paper: {
        borderRadius: 15,
        width: 450
      },
    },

    MuiDialogTitle: {
      root: {
        borderBottom: '1px solid rgb(204, 214, 221)',
        marginBottom: 10,
        padding: '10px 15px',
        '& h2': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 800,
        },
        '& button': {
          padding: 8,
        },
      },
    },
  }
});

export default theme;
