import { Col, Form, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import handleAPIRequests from '../../helpers/handleApiRequest'
import requiredField from '../../helpers/requiredField'
import {
  ResetPasswordDto,
  useResetPasswordMutation,
} from '../../lib/api/user/userEndPoints'
import CustomButton from '../common/button/button'
import CustomInput from '../common/input/customInput'
import Notify from '../common/notification/notification'

interface resetDto {
  password: string
  confirmPassword: string
}

const ResetPassword = () => {
  const [form] = Form.useForm()

  const [reset, { isLoading }] = useResetPasswordMutation()

  const navigate = useNavigate()

  const onSuccess = () => {
    navigate('/ds')
  }

  const onFinish = (values: resetDto) => {
    if (values.confirmPassword !== values.password) {
      Notify({
        message: 'Error',
        description: 'Password do not match',
        type: 'error',
      })
    } else {
      const data: ResetPasswordDto = {
        password: values.password,
      }
      handleAPIRequests({
        request: reset,
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
            Update password
          </h5>
          <Row className='w-[100%]'>
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
              loading={isLoading}
              disabled={isLoading}
            >
              SUBMIT
            </CustomButton>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ResetPassword
