import { FC } from 'react'

interface AppLoaderProps {
  height?: string
  className?: string
}

const Loader: FC = () => (
  <div className='lds-ripple m-auto'>
    <div></div>
    <div></div>
  </div>
)

export const AppLoader: FC<AppLoaderProps> = ({ height, className }) => {
  return (
    <div
      className={`${className} ${
        height ? `h-[${height}]` : 'h-[100vh]'
      } w-[100%] flex items-center justify-center`}
    >
      <Loader />
    </div>
  )
}

export const GeneralContentLoader: FC<AppLoaderProps> = ({ height }) => {
  return (
    <div
      className={`w-[100%]  ${
        height ? `h-[${height}]` : 'h-[70vh]'
      } flex items-center justify-center`}
    >
      <Loader />
    </div>
  )
}
