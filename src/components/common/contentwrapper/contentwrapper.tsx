import { Layout } from 'antd'
import { FC, ReactElement, ReactNode } from 'react'

interface WrapperProps {
  children: ReactNode
}

const ContentWrapper: FC<WrapperProps> = ({ children }): ReactElement => {
  const { Content } = Layout
  return (
    <Content className=' h-[100%] w-full  bg-white  overflow-y-auto'>
      <div className='w-full h-[100%]  mt-[4px] p-5 '> {children} </div>
    </Content>
  )
}

export default ContentWrapper
