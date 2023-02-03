import { createContext, ReactNode, useContext, useState } from 'react'

interface IFaqProvider {
  children: ReactNode
}

type FaqContextType = {
  categoryId: string
  searchParam: string
  setCategoryId: (id: string) => void
  setSearchParam: (param: string) => void
}

const FaqContextValues: FaqContextType = {
  categoryId: '',
  searchParam: '',
  setCategoryId: () => {},
  setSearchParam: () => {},
}

const FaqContext = createContext<FaqContextType>(FaqContextValues)

export function FaqProvider({ children }: IFaqProvider) {
  const [categoryId, setCategory] = useState<string>('')
  const [searchParam, setParam] = useState<string>('')

  const setCategoryId = (id: string) => {
    setCategory(id)
  }

  const setSearchParam = (param: string) => {
    setParam(param)
  }
  const value: FaqContextType = {
    categoryId,
    searchParam,
    setCategoryId,
    setSearchParam,
  }

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>
}

export function useFaqContext() {
  return useContext(FaqContext)
}
