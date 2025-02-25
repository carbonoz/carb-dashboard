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
import CustomImage from '../common/image/customImage'
import logo from '../../assets/1.jpg'

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
    form.resetFields()
    if (res.data) {
      if (res.data.token) {
        setToLocal('token', res.data.token)
        navigate('/onboarding')
      } else {
        Notify({
          message: 'Success',
          description: 'we sent you a verification link to your email Address',
          duration: 0,
        })
      }
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
      })
    }
  }

  return (
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background'>
      {/* <div className='xl:w-[40%] 2xl:w-[32%]  md:w-[45%] lg:w-[45%] 2xl:h-[650px] sm:h-[600px] md:h-[600px] xl:h-[650px] lg:h-[650px] hidden sm:flex md:flex lg:flex justify-center items-start flex-col bg-white shadow-md  lg:p-8 bg-signup'></div> */}
      <div className='border rounded-lg  border-gray-200 p-4 xl:w-[45%] 2xl:w-[32%]   md:w-[60%]   w-[80%] lg:w-[50%] sm:h-[635px] md:h-[635px]  h-fit 2xl:h-[650px] xl:h-[650px] lg:h-[650px] bg-white    shadow-md sm:p-6 lg:p-8'>
        <section className='flex justify-center'>
          <div className='flex lg:flex-row md:flex-row flex-col lg:gap-5 md:gap-5 gap-1 items-center '>
            <CustomImage
              src={logo}
              alt='logo'
              className=' rounded-xl w-full'
              width={50}
              height={50}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </section>

        <h5 className='lg:text-xl text-base font-bold text-center text-black mt-2 mb-3'>
          Create an account
        </h5>

        <Form
          className='space-y-12'
          name='sign-up-form'
          form={form}
          onFinish={onFinish}
        >
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
          <div className='flex items-center '>
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
