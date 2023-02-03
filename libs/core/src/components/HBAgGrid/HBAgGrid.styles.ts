import {
  buttonBaseClasses,
  formLabelClasses,
  inputAdornmentClasses,
  inputBaseClasses,
  outlinedInputClasses,
  styled,
  SxProps,
  Theme,
} from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import { HBAgGridProps } from './HBAgGrid'

export const HBAgGridRootStyle = styled(AgGridReact)<HBAgGridProps>(
  ({ theme: { typography, spacing, palette } }) => `
  font-family: ${typography.fontFamily};
  color: ${palette.grey[700]};
  border-radius: ${spacing(2)};
  background-color: ${palette.common.white};  
  & .ag-root-wrapper{
    border-radius: ${spacing(2)};
    border-radius: ${spacing(2)};
    background-color: ${palette.common.white};  
    border-color:${palette.grey[200]} !important;
  };
  & .ag-row{
    border-color: ${palette.grey[100]} !important;
  };
  & .ag-header{
    border-color: ${palette.grey[300]} !important;
  };
  & input[class^=ag-][type=text] {
    height: 30px;
  };
  & input[class^=ag-][type=text]:focus {
    box-shadow: 0 0 2px 0.1rem ${palette.primary.light};
    border: 0;
  };
  & .ag-header , .ag-column-drop-horizontal , .ag-column-panel-column-select {
    background-color: ${palette.common.white} !important;
  };
  & .ag-status-bar {
    border-color: ${palette.grey[200]};
  };
  & .ag-header-row {
    font-weight: ${typography.fontWeightRegular} !important;
  };
  & .ag-checkbox-input-wrapper.ag-checked::after {
    color: ${palette.primary.main} !important;
  };
  & .ag-checkbox-input-wrapper::after {
    color: ${palette.grey[300]};
    background-color: ${palette.grey[200]};
  };
  & .ag-header-cell-text {
    color: ${palette.grey[700]}
    font-family: ${typography.fontFamily};
  };
  & .ag-cell {
    color: ${palette.grey[900]};
    font-family: ${typography.fontFamily}
  };
  & input,button , .ag-popup-child {
    font-family: ${typography.fontFamily};
  };
  & .ag-column-select-header-filter-wrapper .ag-text-field-input-wrapper {
    position: relative;
  };
  & .ag-column-select-header-filter-wrapper .ag-text-field-input-wrapper::after {
    font-family: 'unicons-line';
    content: "\\e96b";
    position: absolute;
    top: ${spacing(2)};
    width: ${spacing(2)};
    height: ${spacing(2)};
    display: inline-block;
    font-size: ${typography.pxToRem(14)};
    right: ${spacing(3)};
    left: unset;
  };
  & .ag-column-select-header-filter-wrapper .ag-input-field-input {
    padding-left: ${spacing(6)};
  };
  & .ag-icon-grip , .ag-icon-linked , .ag-icon-columns {
    font-family: 'unicons-line' !important;
    color: ${palette.grey[700]};
  };
  & .ag-icon-columns::before {
    content: "\\eb2b" !important;
    font-weight: ${typography.fontWeightBold};
  };
  & .ag-icon-grip::before , .ag-icon-unlinked::before {
    content: "\\eb8e" !important;
  };
  & .ag-selection-checkbox >div {
    border: 0 !important;
    border-radius: ${spacing(1)};
  },
  & .ag-cell-wrapper{
    flex-direction: row-reverse;
    gap: ${spacing(0.5)};
  },
  & .ag-watermark{
    display: none !important
  }
  `,
)

export type HBAgGridClassNames =
  | 'gridWrapper'
  | 'gridHeader'
  | 'gridHeaderWrapper'
  | 'gridPagination'
  | 'wrapper'
  | 'gridPaginationWrapper'
  | 'gridPaginationLabel'
  | 'gridPaginationTotal'
  | 'gridCustomLoading'
  | 'gridToolbarIcon'
  | 'gridToolbarSearch'
export type HBAgGridClasses = Partial<Record<HBAgGridClassNames, SxProps<Theme>>>

export const gridClasses: HBAgGridClasses = {
  gridHeader: {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  gridHeaderWrapper: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    gap: 2,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      paddingBottom: theme.spacing(3),
      alignItems: 'flex-end',
    },
  }),
  gridPaginationWrapper: ({ typography, palette, spacing, breakpoints }) => ({
    fontFamily: typography.fontFamily,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: `solid 1px ${palette.grey[200]}`,
    borderBottomRightRadius: spacing(2),
    borderBottomLeftRadius: spacing(2),
    borderTop: 0,
    padding: `${spacing(3)} ${spacing(4)}`,
    backgroundColor: palette.common.white,
    [`& .${formLabelClasses.root}`]: {
      top: 3,
    },
    [breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: 2,
    },
  }),
  gridPaginationLabel: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  gridPaginationTotal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 1,
    minWidth: 100,
    flexDirection: 'row-reverse',
  },
  gridCustomLoading: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  gridToolbarIcon: (theme) => ({
    color: theme.palette.common.black,
    [`&.${buttonBaseClasses.disabled}`]: {
      color: theme.palette.grey[300],
    },
  }),
  gridToolbarSearch: (theme) => ({
    height: 33,
    minWidth: 151,
    '& input': {
      padding: 0,
    },
    [`& .${outlinedInputClasses.root}`]: {
      height: 33,
    },
    [`& .${outlinedInputClasses.focused} , .${outlinedInputClasses.focused} i`]: {
      color: theme.palette.common.black,
    },
    [`& .${inputBaseClasses.root}`]: {
      borderRadius: theme.spacing(2),
    },
    [`& .${inputAdornmentClasses.root}`]: {
      mt: 1,
    },
  }),
}

export const gridWrapper = {
  height: 500,
  width: '100%',
}
