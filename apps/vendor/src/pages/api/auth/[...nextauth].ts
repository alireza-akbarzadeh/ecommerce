import NextAuth from '@hasty-bazar-vendor/domains/Auth/NextAuth/NextAuth'
import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  NextAuth(req, res, (defaultOptions) => ({}))
}
