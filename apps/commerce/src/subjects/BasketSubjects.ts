import { Subject } from 'rxjs'
const BasketSubject = new Subject()
const BasketSubjectSignOut = new Subject()

export const BasketSubjectFuncs = {
  receivedClientSession: () => BasketSubject.next(),
  getReceivedClientSession: () => BasketSubject.asObservable(),
  signOut: () => BasketSubjectSignOut.next(),
  getSignOut: () => BasketSubjectSignOut.asObservable(),
}
