import { FC, ReactElement } from 'react'

const ErrorPage: FC = (): ReactElement => {
  return (
    <pre className='text-[160px] font-bold text_404 text-center'>
      404
      <br />
      <br />
      Page Not found
    </pre>
  )
}

export default ErrorPage
