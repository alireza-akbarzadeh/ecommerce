import { createContext } from 'react'

interface IProductContextData {
  addingCategory: any
  setAddingCategoryFunc: any
  editingCategory: any
  setEditingCategoryFunc: any
}

export const ProductContext = createContext<IProductContextData>({
  addingCategory: '',
  setAddingCategoryFunc: '',
  editingCategory: '',
  setEditingCategoryFunc: '',
})
