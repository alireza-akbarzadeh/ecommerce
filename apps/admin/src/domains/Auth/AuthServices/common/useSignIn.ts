import { signIn, SignInResponse } from 'next-auth/react'

export interface UseSignInValues {
  username: string
  password?: string
  captcha?: string
  loginType?: string
  otp?: string
  otpToken?: string
}

const useSignIn = () => {
  return async (values: UseSignInValues): Promise<boolean> => {
    //@ts-ignore
    const response: SignInResponse = await signIn('SIGN_IN', {
      ...values,
      redirect: false,
    })
    if (response?.error || !response?.ok) {
      return Promise.reject(response.error || 'Unknown')
    }

    return Promise.resolve(true)
  }
}
export default useSignIn
