import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FC, ReactElement, useEffect, useMemo } from 'react'
import countryList from 'react-select-country-list'
import { ESteps } from '../../../config/constant'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import requiredField from '../../../helpers/requiredField'
import {
  AdditionalInfoInt,
  additionalInfoInt,
  useAddAdditionalInfoMutation,
  useGetAdditionalInfoQuery,
} from '../../../lib/api/user/userEndPoints'
import CustomInput from '../../common/input/customInput'

interface Props {
  setUserInfoData: (data: AdditionalInfoInt) => void
  makeStep: () => unknown
  setLoadingAction: (state: boolean) => void
}

const UserInfo: FC<Props> = ({
  setUserInfoData,
  makeStep,
  setLoadingAction,
}): ReactElement => {
  const [form] = useForm()

  const [addAdditionalInfo] = useAddAdditionalInfoMutation()

  const { data, refetch } = useGetAdditionalInfoQuery()

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue(data.data)
      setUserInfoData(data.data)
    }
  }, [data, form, setUserInfoData])

  useEffect(() => {
    refetch()
  }, [refetch])

  const options = useMemo(() => countryList().getData(), [])

  const onAddSucess = () => {}

  const onSuccess = () => {
    setLoadingAction(false)
    const data = {
      step: ESteps.ASSET_INFO,
    }
    handleAPIRequests({
      request: makeStep,
      ...data,
      onSuccess: onAddSucess,
      notify: true,
    })
  }
  const onFinish = (values: additionalInfoInt) => {
    setLoadingAction(true)
    handleAPIRequests({
      request: addAdditionalInfo,
      ...values,
      onSuccess: onSuccess,
    })
  }
  return (
    <Form
      className='space-y-12'
      name='user-info-form'
      form={form}
      onFinish={onFinish}
    >
      <Row className='w-[100%]' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Job title'
            label='Job title'
            inputType='text'
            name='jobTitle'
            rules={requiredField('Job title')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Full name'
            label='Full name'
            inputType='text'
            name='names'
            rules={requiredField('Full name')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Address'
            label='Address'
            inputType='text'
            name='address'
            rules={requiredField('address')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Postal Code'
            label='Postal Code'
            inputType='text'
            name='postalCode'
            rules={requiredField('Postal Code')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Country'
            label='Country'
            inputType='text'
            name='country'
            type='select'
            options={options.map((item) => ({
              key: item.value,
              value: item.label,
              label: item.label,
            }))}
            rules={requiredField('Country')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='City'
            label='City'
            inputType='text'
            name='city'
            rules={requiredField('City')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Phone'
            label='Phone'
            inputType='text'
            name='phone'
            rules={requiredField('Phone')}
          />
        </Col>
      </Row>
    </Form>
  )
}

export default UserInfo
