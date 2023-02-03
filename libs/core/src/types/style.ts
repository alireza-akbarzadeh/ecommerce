import { SxProps, Theme } from '@mui/material'

export type HBClassesType<T extends string> = Partial<Record<T, SxProps<Theme>>>
