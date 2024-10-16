import { error, info, primary, secondary, success, warning } from './ThemeColors'

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

const fontSize = 16
const baseOptions = {
  direction: 'ltr',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: '75%',
          width: '75%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          color: 'inherit',
          boxShadow: 'none',
          padding: '0.6rem 1.5rem',
          fontSize: 14,
          fontWeight: 700,
        },
        outlinedPrimary: {
          borderColor: primary.main,
          color: primary.main,
        },
        containedPrimary: {
          color: 'white',
          '&:hover': {
            backgroundColor: primary.dark,
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
        },
        a: {
          textDecoration: 'none',
          color: 'inherit',
        },
        '#root': {
          height: '100%',
        },
        '#nprogress .bar': {
          zIndex: '9999 !important',
          backgroundColor: '#61A9FF !important',
          width: '100%',
          position: 'fixed',
        },
        'input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button':
          {
            WebkitAppearance: 'none',
            margin: 0,
          },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 28,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          // height: 42,
          boxShadow: 'none',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: '#E5EAF2',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: '16px',
        },
      },
    },
    MuiListItemButtom: {
      styleOverrides: {
        root: {
          '& .active': {
            backgroundColor: 'blue',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
          minHeight: 0,
          '&.Mui-expanded': {
            minHeight: 'auto',
          },
          '.MuiAccordionSummary-content': {
            margin: 0,
          },
          '.MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#FFD600',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: '#94A4C4',
          textTransform: 'none',
          fontSize: 14,
          fontWeight: 600,
          padding: 0,
          minWidth: 'auto',
          marginLeft: '1rem',
          marginRight: '1rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiButtonBase-root:first-of-type': {
            marginLeft: 0,
          },
          '& .MuiButtonBase-root:last-of-type': {
            marginRight: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .MuiPopover-paper': {
            boxShadow: 'none',
            borderRadius: '8px',
            border: '2px solid #E5EAF2',
          },
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', sans-serif",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input::placeholder': {
            color: secondary[400],
            opacity: 1,
          },
          '& label': {
            color: secondary[400],
            opacity: 1,
            fontWeight: 500,
          },
        },
      },
    },
  },
  typography: {
    button: {
      fontWeight: 600,
      fontSize: 16,
    },
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: '4.25rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '4rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.1rem',
      // fontSize,
    },
    overline: {
      fontWeight: 600,
    },
    body1: {
      fontSize,
    },
    body2: {
      fontSize,
    },
  },
}
const themesOptions = {
  [THEMES.LIGHT]: {
    palette: {
      primary,
      secondary,
      error,
      warning,
      success,
      info,
      divider: secondary[300],
      background: {
        default: 'rgb(242, 242, 242)',
        paper: 'rgb(242, 242, 242)',
        white: '#fff',
      },
      text: {
        primary: secondary[500],
        secondary: secondary[300],
        disabled: secondary[400],
      },
      mode: 'light',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff',
            boxShadow: 'none',
            border: 'none',
            borderRadius: 25,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlinedInfo: {
            borderColor: secondary.dark,
            color: secondary.dark,
            fontWeight: 600,
            borderWidth: 0.5,
            '&:hover': {
              borderWidth: 0.5,
            },
          },
          filledInfo: {
            borderColor: secondary.dark,
            backgroundColor: secondary.dark,
            color: secondary.light,
            fontWeight: 600,
            borderWidth: 0.5,
            '&:hover': {
              backgroundColor: secondary[500],
              borderWidth: 0.5,
            },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: '#b2b2b2',
            borderColor: '#b2b2b2',
            opacity: 1,
            borderWidth: 0.01,
          },
        },
      },
      MuiMenuList: {
        styleOverrides: {
          root: {
            backgroundColor: secondary.main,
          },
        },
      },
    },
  },
}

export const customTheme = (config: { theme: any; direction: any; responsiveFontSizes?: any }) => {
  let themeOption = themesOptions[config.theme]

  if (!themeOption) {
    console.warn(new Error(`The theme ${config.theme} is not valid`))
    themeOption = themesOptions[THEMES.LIGHT]
  } //@ts-ignore
}
