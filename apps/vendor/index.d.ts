/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export const ReactComponent: any
  export default content
}
type StringAble<T> = {
  [P in keyof T]: T[P] | string
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
