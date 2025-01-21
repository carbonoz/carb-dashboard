/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { FC, ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/1.jpg'
import { ERoles } from '../../config/constant'
import handleAPIRequests from '../../helpers/handleApiRequest'
import { setToLocal } from '../../helpers/handleStorage'
import requiredField from '../../helpers/requiredField'
import {
  AuthResponse,
  LoginDTO,
  useLoginMutation,
} from '../../lib/api/Auth/authEndpoints'
import CustomButton from '../common/button/button'
import CustomImage from '../common/image/customImage'
import CustomInput from '../common/input/customInput'
import Notify from '../common/notification/notification'

const Login: FC = (): ReactElement => {
  const [form] = Form.useForm()
  const [login, { isLoading }] = useLoginMutation()

  const navigate = useNavigate()

  const onSuccess = (res: AuthResponse): void => {
    if (res.data) {
      if (res.data.token) {
        setToLocal('token', res.data.token)
        if (res.data.user.role === ERoles.ADMIN) {
          navigate('/admin')
        } else {
          navigate('/ds')
        }
      } else {
        Notify({
          message: 'Error',
          description:
            'Your Email is not verified , we sent you a verification link to your email Address',
          duration: 0,
          type: 'error',
        })
      }
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
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background '>
      <div className='xl:w-[40%] 2xl:w-[32%]  md:w-[45%] lg:w-[45%] 2xl:h-[650px] sm:h-[600px] md:h-[600px] xl:h-[650px] lg:h-[650px] hidden sm:flex md:flex lg:flex justify-center items-start flex-col bg-white shadow-md  lg:p-8 bg-login'></div>
      <div className='p-4 xl:w-[40%] 2xl:w-[32%]   md:w-[45%]   w-[80%] lg:w-[45%] sm:h-[600px] md:h-[600px]  h-fit 2xl:h-[650px] xl:h-[650px] lg:h-[650px] bg-white    shadow-md sm:p-6 lg:p-8'>
        <section className='lg:hidden flex justify-center'>
          <div className='flex lg:flex-row md:flex-row flex-col lg:gap-5 md:gap-5 gap-1 items-center '>
            <CustomImage
              src={logo}
              alt='logo'
              className=' rounded-xl w-full'
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
            <h5 className='lg:text-xl text-base font-bold text-center text-black lg:hidden block'>
              Log in
            </h5>
          </div>
        </section>
        <h5 className='lg:text-xl text-base font-bold text-center text-black hidden lg:block '>
          Log in
        </h5>
        <Form
          className='space-y-12 mt-5'
          name='login-form'
          form={form}
          onFinish={onFinish}
        >
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
          <div className='flex flex-col gap-5 '>
            <Link
              to='/signup'
              className='text-md text-blue-300 font-bold hover:text-blue-300'
            >
              Sign up
            </Link>
            <Link
              to='/forgot-password'
              className='text-md text-blue-300 font-bold hover:text-blue-300'
            >
              Forgot password?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
