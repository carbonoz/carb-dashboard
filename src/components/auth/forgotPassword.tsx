import { Col, Form, Row } from 'antd'
import { Link } from 'react-router-dom'
import logo from '../../assets/1.jpg'
import handleAPIRequests from '../../helpers/handleApiRequest'
import requiredField from '../../helpers/requiredField'
import {
  resetPasswordDTO,
  useResetAuthPasswordMutation,
} from '../../lib/api/Auth/authEndpoints'
import CustomButton from '../common/button/button'
import CustomImage from '../common/image/customImage'
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
              Forgot password
            </h5>
          </div>
        </section>
        <h5 className='lg:text-xl text-base font-bold text-center text-black hidden lg:block '>
          Forgot password
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
