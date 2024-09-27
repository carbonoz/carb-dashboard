import { Col, Form, Row } from 'antd'
import { Link } from 'react-router-dom'
import handleAPIRequests from '../../helpers/handleApiRequest'
import requiredField from '../../helpers/requiredField'
import {
  resetPasswordDTO,
  useResetAuthPasswordMutation,
} from '../../lib/api/Auth/authEndpoints'
import CustomButton from '../common/button/button'
import CustomInput from '../common/input/customInput'
import Notify from '../common/notification/notification'

const ForgotPassword = () => {
  const [form] = Form.useForm()
  const [resetPassword, { isLoading }] = useResetAuthPasswordMutation()

  const onSuccess = () => {
    Notify({
      message: 'Success',
      description: 'we sent you a verification link to your email Address',
      duration: 0,
    })
  }

  const onFinish = (values: resetPasswordDTO) => {
    handleAPIRequests({
      request: resetPassword,
      ...values,
      onSuccess: onSuccess,
    })
  }

  return (
    <div className='h-[100vh] w-[100%] items-center justify-center flex flex-row background '>
      <div className='xl:w-[40%] 2xl:w-[32%] lg:w-[40%] 2xl:h-[650px] xl:h-[600px] lg:h-[580px] hidden lg:flex justify-center items-start flex-col bg-white shadow-md  lg:p-8 bg-login'>
        <h2 className='ml-7 -mt-[60px] text-white  font-bold text-[30px]'>
          Welcome to
        </h2>
      </div>
      <div className='p-4 xl:w-[40%] 2xl:w-[32%]  w-[80%] lg:w-[40%]  h-fit 2xl:h-[650px] xl:h-[600px] lg:h-[580px] bg-white    shadow-md sm:p-6 lg:p-8'>
        <Form
          className='space-y-12'
          name='login-form'
          form={form}
          onFinish={onFinish}
        >
          <h5 className='text-xl font-bold text-center text-black'>
            Forgot password{' '}
          </h5>
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
          </Row>
          <div className='flex items-center justify-center'>
            <CustomButton
              type='primary'
              className=' w-[100%] h-[60px]'
              form='login-form'
              htmlType='submit'
              disabled={isLoading}
              loading={isLoading}
            >
              SEND
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

export default ForgotPassword
