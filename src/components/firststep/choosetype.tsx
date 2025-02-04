import { Form } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useNavigate } from 'react-router-dom'
import handleAPIRequests from '../../helpers/handleApiRequest'
import {
  partnerResponse,
  useRegisterPartnersMutation,
} from '../../lib/api/partners/partnersEndPoints'
import { useGetAdditionalInfoQuery } from '../../lib/api/user/userEndPoints'
import CustomButton from '../common/button/button'
import NavBar from '../common/header/header'
import CustomInput from '../common/input/customInput'
import { GeneralContentLoader } from '../common/loader/loader'
import Notify from '../common/notification/notification'
import requiredField from '../../helpers/requiredField'

interface submitOptions {
  partner: string
}

const ChoosePartnersTypeForm = () => {
  const { data, isFetching } = useGetAdditionalInfoQuery()
  const [form] = useForm()

  const [registerpartner, { isLoading }] = useRegisterPartnersMutation()

  const navigate = useNavigate()

  const onSuccess = (res: partnerResponse): void => {
    if (res.data) {
      res.data.partner.forEach((partner: string) => {
        if (partner === 'REDEX') {
          navigate('/redexsteps')
        }
        if (partner === 'No') {
          navigate('/systemsteps')
        }
      })
    }
  }

  const onFinish = (values: submitOptions) => {
    if (!values.partner) {
      Notify({
        message: 'Error',
        description: 'Please choose an option',
        type: 'error',
      })
      return
    } else {
      const obj = {
        partner: [values.partner],
      }
      handleAPIRequests({
        request: registerpartner,
        ...obj,
        onSuccess: onSuccess,
      })
    }
  }

  if (isFetching) {
    return <GeneralContentLoader />
  }
  return (
    <div className='flex flex-col overflow-y-hidden 2xl:h-[100vh] xl:h-[100%] lg:h-[100%] h-[100%]'>
      <NavBar data={data?.data} additional={true} />
      <div className='p-10 flex  justify-center'>
        <div>
          <div className='mb-5'>
            <h1 className='text-lg font-bold text-gray-800'>
              Data Sharing with Third Parties
            </h1>
            <p className='mt-5'>
              As part of our services, we may need to share your data with the
              following third parties
            </p>
          </div>
          <Form form={form} onFinish={onFinish} name='patners-form'>
            <CustomInput
              label='Choose an option below'
              type='radio'
              name='partner'
              styles='w-[40px]'
              options={[
                { label: 'Redex', value: 'REDEX' },
                { label: 'No', value: 'No' },
              ]}
              rules={requiredField('Option')}
            />
          </Form>
          <p>
            Please note that if you opt out of sharing your data with these
            third parties, you may still proceed with our onboarding process
            <br />
            without any disruption to your experience. By continuing, you
            acknowledge that you have reviewed this information and understand
            <br />
            your options.
          </p>
          <div className='flex items-center justify-start mt-[50px]'>
            <CustomButton
              type='primary'
              className=' w-[50%] h-[60px]'
              form='patners-form'
              htmlType='submit'
              disabled={isLoading}
            >
              {isLoading ? 'LOADING....' : 'SUBMIT'}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChoosePartnersTypeForm
