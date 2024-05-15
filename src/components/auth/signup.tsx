import { Col, Form, Row } from 'antd'
import { FC, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import CustomButton from '../button/button'
import CustomInput from '../common/input/customInput'

const Signup: FC = (): ReactElement => {
  const [form] = Form.useForm()

  return (
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background'>
      <div className='w-[30%] h-[650px] flex justify-center items-start flex-col bg-white shadow-md lg:p-8 bg-signup'>
        <h2 className='ml-7 -mt-[60px] text-white  font-semibold text-lg'>
          Welcome to
        </h2>
        <h1 className='ml-6 text-white  text-[2rem]  font-bold'>Carbonoz</h1>
      </div>
      <div className='p-4 w-[30%] h-[650px] bg-white   shadow-md sm:p-6 lg:p-8'>
        <Form className='space-y-12' name='sign-up-form' form={form}>
          <h5 className='text-xl font-medium text-center text-black'>
            Create a account
          </h5>
          <Row className='w-[100%]'>
            <Col className='gutter-row mt-2 w-full'>
              <CustomInput
                placeholder='Email'
                label='Email'
                inputType='email'
              />
            </Col>
            <Col className='gutter-row mt-2 w-full'>
              <CustomInput
                placeholder='Password'
                label='Password'
                inputType='password'
              />
            </Col>
          </Row>

          <div className='flex items-center justify-center'>
            <CustomButton type='primary' className=' w-[100%] h-[60px]'>
              SIGN UP
            </CustomButton>
          </div>
          <div className='flex items-center'>
            <Link
              to='/'
              className=' text-md text-blue hover:underline dark:text-blue-500'
            >
              Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Signup
