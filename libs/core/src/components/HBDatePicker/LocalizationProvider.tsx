import { DateIOFormats, IUtils } from '@date-io/core/IUtils'
import { useThemeProps } from '@mui/material/styles'
import * as React from 'react'

type MuiPickersAdapter<TDate> = IUtils<TDate>
export interface MuiPickersAdapterContextValue<TDate> {
  defaultDates: {
    minDate: TDate
    maxDate: TDate
  }
  utils: MuiPickersAdapter<TDate>
}

export const MuiPickersAdapterContext =
  React.createContext<MuiPickersAdapterContextValue<unknown> | null>(null)

export interface LocalizationProviderProps {
  children?: React.ReactNode
  dateAdapter: new (...args: any) => MuiPickersAdapter<unknown>
  dateFormats?: Partial<DateIOFormats>
  dateLibInstance?: any
  locale?: string | object
  adapterLocale?: string | object
}

let warnedOnce = false

/**
 * @ignore - do not document.
 */
export function LocalizationProvider(inProps: LocalizationProviderProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiLocalizationProvider' })

  const {
    children,
    dateAdapter: Utils,
    dateFormats,
    dateLibInstance,
    locale,
    adapterLocale,
  } = props

  const utils = React.useMemo(
    () =>
      new Utils({
        locale: adapterLocale ?? locale,
        formats: dateFormats,
        instance: dateLibInstance,
      }),
    [Utils, locale, adapterLocale, dateFormats, dateLibInstance],
  )

  const defaultDates: MuiPickersAdapterContextValue<unknown>['defaultDates'] = React.useMemo(() => {
    return {
      minDate: utils.date('1900-01-01T00:00:00.000'),
      maxDate: utils.date('2099-12-31T00:00:00.000'),
    }
  }, [utils])

  const contextValue: MuiPickersAdapterContextValue<unknown> = React.useMemo(() => {
    return {
      utils,
      defaultDates,
    }
  }, [defaultDates, utils])

  return (
    <MuiPickersAdapterContext.Provider value={contextValue}>
      {children}
    </MuiPickersAdapterContext.Provider>
  )
}
