import { Subject } from 'rxjs'

const ProductDetailOtherVendorExpandedSubject = new Subject()

export const ProductDetailSubjectFuncs = {
  expandedChange: () => ProductDetailOtherVendorExpandedSubject.next(),
  getExpandedChange: () => ProductDetailOtherVendorExpandedSubject.asObservable(),
}
