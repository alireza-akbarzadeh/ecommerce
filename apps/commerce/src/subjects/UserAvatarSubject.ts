import { Subject } from 'rxjs'

const avatarSubject = new Subject()

export const UserAvatarSubjectFuncs = {
  avatarCreated: (src: string) => avatarSubject.next(src),
  getCreatedAvatar: () => avatarSubject.asObservable(),
}
