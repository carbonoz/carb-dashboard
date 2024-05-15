/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, FC } from 'react'
import { getFromLocal } from '../helpers/handleStorage'

const Private = <P extends object>(Wrapped: ComponentType<P>): FC<P> => {
  const PrivateComponent: FC<P> = (props) => {
    const localToken = getFromLocal<any>('token')
    if (!localToken) {
      window.location.href = '/'
      return null
    }
    return <Wrapped {...props} />
  }
  return PrivateComponent
}

export default Private
