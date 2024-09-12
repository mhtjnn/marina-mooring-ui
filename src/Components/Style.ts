import { primary, secondary } from '../Theme/ThemeColors'

export const fieldStyle = {
  '& .MuiInputBase-root': {
    borderRadius: '24px',
    fontSize: '0.8rem',
  },
}

export const pricefieldStyle = {
  '& .MuiInputBase-root': {
    borderRadius: '24px',
    fontSize: '0.8rem',
    minWidth: '128px',
  },
}

export const featurefieldStyle = {
  '& .MuiInputBase-root': {
    borderRadius: '24px',
    fontSize: '0.6rem',
    padding: '0px',
    margin: '0px',
  },
}

export const labelStyle = {
  fontWeight: 600,
  display: 'block',
  mb: 1,
  fontSize: '0.85rem',
}
export const featureslabelStyle = {
  fontWeight: 600,
  display: 'block',
  mb: 0.8,
  fontSize: '0.75rem',
}

export const twinFieldStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 2,
}

export const threefieldStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1,
}

export const filterFooterWrapperStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  gap: { xs: '0.5rem', sm: '2rem', md: '5rem' },
  // width: "100%",
  display: 'flex',
  marginTop: '0.2rem',
  flexDirection: { xs: 'column', sm: 'row' },
}

export const btnOutlinedBlkStyle = {
  borderRadius: '25px',
  borderColor: '#000',
  color: '#000',
  padding: '0.1rem 1.7rem',

  '&:hover': {
    backgroundColor: '#000',
    borderColor: '#000',
    color: secondary.main,
  },
}

export const btnContainedBlkStyle = {
  borderRadius: '25px',
  backgroundColor: '#111 !important',
  border: '1px solid black',
  color: `#fff`,
  padding: '0.2rem 1.3rem',

  '&:hover': {
    borderColor: '#000',
    color: '#111',
    backgroundColor: `#fff !important`,
  },
}

export const tabListStyle = {
  backgroundColor: secondary.main,
  borderRadius: '30px',
  justifyContent: 'space-between',
  padding: '0.8rem 0.7rem 0.8rem 0.7rem',
  marginBottom: 1,
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2rem',
  },

  '& .MuiTabs-indicator': {
    display: 'none',
  },

  '& .MuiTab-root.Mui-selected': {
    color: primary.alt,
    textDecoration: 'underline',
  },
}

export const filterModalStyle = {
  position: 'absolute' as 'absolute',
  // top: "40%",
  top: 105,
  left: "''",
  // transform: "translate(-80%)",
  width: { xs: '100%', sm: '70%', md: '36%' },
  overflowX: 'auto',
  // bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  p: { xs: 2, md: 4 },
}

export const ChipWrapperStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1,
}

export const filterTitleStyle = {
  fontSize: 16,
  // marginBottom: 2,
  textAlign: 'center',
  fontWeight: 600,
}

export const propertyModalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '90%' },
  bgcolor: 'background.paper',
  height: '90vh',
  borderRadius: '25px',

  '& .MuiGrid-root': {
    height: '100%',
    overflowY: 'auto',
  },
  // border: "2px solid #000",
  // boxShadow: 24,
  // p: 4,
}

export const propertyModalHeaderStyle = {
  position: 'sticky',
  p: 2,
  display: 'flex',
  gap: 2,
  top: '0',
  bgcolor: 'background.paper',
  borderTopLeftRadius: '25px',
  borderTopRightRadius: '25px',
  zIndex: 2,
}

export const propetySubTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: 600,
  marginBottom: 0.5,
}

export const propetyTextStyle = {
  fontSize: '0.85rem',
  fontWeight: 300,
  letterSpacing: '0.5px',
  // marginBotton: 4,
}

export const propertyDetailWrapperStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.25,
  marginBottom: 0.25,

  '& p': {
    fontWeight: 600,
    fontSize: '0.85rem',
  },

  '& span': {
    fontWeight: 300,
    fontSize: '0.85rem',
  },
}

export const swipeIconWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  border: '0.5px solid #ccc',
  padding: '0.25em',
}

export const swipeIconStyle = {
  width: '20px',
  height: '20px',
  display: 'flex',
  cursor: 'pointer',
}

export const categoryWrapperStyle = {
  width: '80vw',
  // width: "100%",
  overflowX: 'scroll',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1.25rem',
  transition: 'transform 0.1s ease',
  scrollbarWidth: 'none',
}

export const categoryStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  columnGap: '1rem',
  cursor: 'pointer',
}

export const categoryIconStyle = {
  display: 'flex',
  width: '18px',
  height: '24px',
  filter: 'saturate(0)',
}

export const sliderStyle = {
  color: '#000',
  height: 6,
  '& .MuiSlider-rail': {
    opacity: 0,
  },
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  // "& .MuiSlider-valueLabel": {
  //   lineHeight: 1.2,
  //   fontSize: 12,
  //   background: "unset",
  //   padding: 0,
  //   width: 32,
  //   height: 32,
  //   borderRadius: "50% 50% 50% 0",
  //   backgroundColor: "#52af77",
  //   transformOrigin: "bottom left",
  //   transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
  //   "&::before": { display: "none" },
  //   "&.MuiSlider-valueLabelOpen": {
  //     transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
  //   },
  //   "& > *": {
  //     transform: "rotate(45deg)",
  //   },
  // },
}

export const checkIconStyle = {
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: '#f5f8fa',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(206,217,224,.5)',
  },
}

export const textFieldLabelStyle = {
  fontWeight: 600,
  fontSize: '0.85rem',
  marginBottom: 0.5,
}

export const textFieldStyle = {
  marginBottom: 1.75,
  // backgroundColor: "#fff",
  borderRadius: 0,
  borderColor: '#e7e8e7',
}

export const carouselIcons = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.11vh',
  padding: '0px 3%',
}

export const triangleIcon = {
  // color: '$primary_white',
  // fontSize: '3vw',
  // fontWeight: 500,
  cursor: 'pointer',
  top: 0,
  left: 0,
  zIndex: 2,
}

export const disabledIcon = {
  cursor: 'not-allowed',
}

export const propertyCarousel = {
  width: '80%',
  height: '1000px',
  margin: '3%',
}

export const priceGraph = {
  marginBottom: '-18px',
}

export const myMarketPlaceBackBtn = {
  marginRight: `calc(100% - 82% )`,
}
