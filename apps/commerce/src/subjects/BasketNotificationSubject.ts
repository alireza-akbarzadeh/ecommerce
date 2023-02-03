import { Subject } from 'rxjs'
const BasketSubject = new Subject()

export const BasketNotificationSubjectFuncs = {
  notificationRemoved: (id: string) => BasketSubject.next(id),
  getNotificationRemoved: () => BasketSubject.asObservable(),
}
