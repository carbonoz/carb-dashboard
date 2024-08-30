/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { FC, ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import handleAPIRequests from '../../helpers/handleApiRequest'
import { setToLocal } from '../../helpers/handleStorage'
import requiredField from '../../helpers/requiredField'
import {
  AuthResponse,
  LoginDTO,
  useLoginMutation,
} from '../../lib/api/Auth/authEndpoints'
import CustomButton from '../common/button/button'
import CustomInput from '../common/input/customInput'

const Login: FC = (): ReactElement => {
  const [form] = Form.useForm()
  const [login, { isLoading }] = useLoginMutation()

  const navigate = useNavigate()

  const onSuccess = (res: AuthResponse): void => {
    if (res.data) {
      setToLocal('token', res.data.token)
      navigate('/ds')
    }
  }

  const onFinish = (values: LoginDTO) => {
    handleAPIRequests({
      request: login,
      ...values,
      onSuccess: onSuccess,
    })
  }
  return (
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background'>
      <div className='xl:w-[40%] 2xl:w-[32%] lg:w-[40%] 2xl:h-[650px] xl:h-[600px] lg:h-[550px] hidden lg:flex justify-center items-start flex-col bg-white shadow-md  lg:p-8 bg-login'>
        <h2 className='ml-7 -mt-[60px] text-white  font-semibold text-lg'>
          Welcome back to
        </h2>
        <h1 className='ml-6 text-white  text-[2rem]   font-bold'>Carbonoz</h1>
      </div>
      <div className='p-4 xl:w-[40%] 2xl:w-[32%]  w-[80%] lg:w-[40%]  h-fit 2xl:h-[650px] xl:h-[600px] lg:h-[550px] bg-white    shadow-md sm:p-6 lg:p-8'>
        <Form
          className='space-y-12'
          name='login-form'
          form={form}
          onFinish={onFinish}
        >
          <h5 className='text-xl font-bold text-center text-black'>Log in</h5>
          <Row className='w-[100%]'>
            <Col className='gutter-row mt-2 w-full'>
              <CustomInput
                placeholder='Email'
                label='Email'
                inputType='email'
                name='email'
                rules={requiredField('Email')}
              />
            </Col>
            <Col className='gutter-row mt-2 w-full'>
              <CustomInput
                placeholder='Password'
                label='Password'
                inputType='password'
                name='password'
                rules={requiredField('Password')}
              />
            </Col>
          </Row>
          <div className='flex items-center justify-center'>
            <CustomButton
              type='primary'
              className=' w-[100%] h-[60px]'
              form='login-form'
              htmlType='submit'
              disabled={isLoading}
            >
              {isLoading ? 'LOADING....' : 'LOGIN'}
            </CustomButton>
          </div>
          <div className='flex items-center'>
            <Link
              to='/signup'
              className='text-md text-blue-300 font-bold hover:text-blue-300'
            >
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
