import { Col, Form, Row } from 'antd'
import { FC, ReactElement } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ERoles } from '../../config/constant'
import handleAPIRequests from '../../helpers/handleApiRequest'
import { setToLocal } from '../../helpers/handleStorage'
import requiredField from '../../helpers/requiredField'
import {
  AuthResponse,
  SignupDTO,
  useSignupMutation,
} from '../../lib/api/Auth/authEndpoints'
import CustomButton from '../common/button/button'
import CustomInput from '../common/input/customInput'
import Notify from '../common/notification/notification'

interface signupDto {
  email: string
  password: string
  confirmPassword: string
}

const Signup: FC = (): ReactElement => {
  const [form] = Form.useForm()

  const [signup, { isLoading }] = useSignupMutation()

  const navigate = useNavigate()

  const onSuccess = (res: AuthResponse): void => {
    if (res.data) {
      setToLocal('token', res.data.token)
      navigate('/steps')
    }
  }

  const onFinish = (values: signupDto) => {
    if (values.confirmPassword !== values.password) {
      Notify({
        message: 'Error',
        description: 'Password do not match',
        type: 'error',
      })
    } else {
      const data: SignupDTO = {
        ...values,
        role: ERoles.USER,
      }
      handleAPIRequests({
        request: signup,
        ...data,
        onSuccess: onSuccess,
        notify: true,
      })
    }
  }

  return (
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background'>
      <div className='xl:w-[40%] 2xl:w-[32%] lg:w-[40%] 2xl:h-[650px] xl:h-[620px] lg:h-[600px] hidden lg:flex justify-center items-start flex-col bg-white shadow-md  lg:p-8 bg-signup'>
        <h2 className='ml-7 -mt-[60px] text-white  font-bold text-[30px]'>
          Welcome to
        </h2>
      </div>
      <div className='p-4 xl:w-[40%] 2xl:w-[32%]  w-[80%] lg:w-[40%]  h-fit 2xl:h-[650px] xl:h-[620px] lg:h-[600px] bg-white    shadow-md sm:p-6 lg:p-8'>
        <Form
          className='space-y-12'
          name='sign-up-form'
          form={form}
          onFinish={onFinish}
        >
          <h5 className='text-xl font-bold text-center text-black'>
            Create a account
          </h5>
          <Row className='w-[100%]'>
            <Col className='gutter-row mt-1 w-full '>
              <CustomInput
                placeholder='Email'
                label='Email'
                inputType='email'
                name='email'
                rules={requiredField('Email')}
              />
            </Col>
            <Col className='gutter-row mt-1 w-full'>
              <CustomInput
                placeholder='Password'
                label='Password'
                inputType='password'
                name='password'
                rules={requiredField('Password')}
              />
            </Col>
            <Col className='gutter-row mt-1 w-full'>
              <CustomInput
                placeholder='Confirm password'
                label='Confirm password'
                inputType='password'
                name='confirmPassword'
                rules={requiredField('Confirm password')}
              />
            </Col>
          </Row>
          <div className='flex items-center justify-center '>
            <CustomButton
              type='primary'
              className=' w-[100%] h-[60px] -mt-5'
              form='sign-up-form'
              htmlType='submit'
              disabled={isLoading}
            >
              {isLoading ? 'LOADING....' : 'SIGNUP'}
            </CustomButton>
          </div>
          <div className='flex items-center'>
            <Link
              to='/'
              className='text-md text-blue-300 font-bold hover:text-blue-300'
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
