import { Col, Form, Row, FormInstance } from 'antd'
import { FC, useEffect } from 'react'
import { language, timezones } from '../../config/constant'
import { useWindowSize } from '../../helpers/interfaceSize'
import {
  AdditionalInfoInt,
  additionalInfoInt,
} from '../../lib/api/user/userEndPoints'
import CustomInput from '../common/input/customInput'

interface EditUserInformationFormProps {
  form: FormInstance
  data: AdditionalInfoInt | undefined
  onFinish: (values: additionalInfoInt) => void
}

const EditUserInformationForm: FC<EditUserInformationFormProps> = ({
  form,
  data,
  onFinish,
}) => {
  const { width } = useWindowSize()

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  return (
    <Form
      className='space-y-12'
      name='edit-user-info-form'
      form={form}
      onFinish={onFinish}
      layout='vertical'
    >
      <Row className='w-[100%]' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='First Name'
            label='First Name'
            inputType='text'
            name='firstName'
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='Last Name'
            label='Last Name'
            inputType='text'
            name='lastName'
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='Street'
            label='Street'
            inputType='text'
            name='street'
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='City'
            label='City'
            inputType='text'
            name='city'
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='Telephone'
            label='Telephone'
            inputType='number'
            name='telephone'
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='Customer Language'
            label='Customer Language'
            name='customerLanguage'
            type='select'
            options={language.map((item, index) => ({
              key: index,
              value: item,
              label: item,
            }))}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 720 ? 24 : 12}>
          <CustomInput
            placeholder='Customer Timezone'
            label='Customer Timezone'
            name='customerTimezone'
            type='select'
            options={timezones.map((timezone, index) => ({
              key: index,
              value: timezone,
              label: timezone,
            }))}
          />
        </Col>
      </Row>
    </Form>
  )
}

export default EditUserInformationForm
