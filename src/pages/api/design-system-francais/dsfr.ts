import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join('node_modules/@gouvfr/dsfr/dist/dsfr/dsfr.module.min.js')
  const stat = fs.statSync(filePath)

  res.writeHead(200, {
    'Content-Length': stat.size,
    'Content-Type': 'text/javascript',
  })

  fs.createReadStream(filePath)
    .pipe(res)
}
