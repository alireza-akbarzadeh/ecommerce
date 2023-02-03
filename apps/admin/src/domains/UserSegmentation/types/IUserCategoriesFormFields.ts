import { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import { IUserCategoriesFormModel } from './IUserCategoriesFormModel'

export interface IUserCategoriesFormFields {
  setValue: UseFormSetValue<IUserCategoriesFormModel>
  getValues: UseFormGetValues<IUserCategoriesFormModel>
  id: string
  control: Control<IUserCategoriesFormModel, any>
}
