import { Col, Form, Row } from 'antd'
import { FC, ReactElement, useEffect } from 'react'
import { EFuelType, ESteps } from '../../../config/constant'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import requiredField from '../../../helpers/requiredField'
import {
  assetInt,
  useAddAssetMutation,
  useGetAssetsQuery,
} from '../../../lib/api/user/userEndPoints'
import CustomInput from '../../common/input/customInput'

interface props {
  makeStep: () => unknown
  setAssetData: (data: Array<assetInt>) => void
  setLoadingAction: (state: boolean) => void
}

interface AssetDTO {
  assetName: string
  assetOwner: string
  fuelType: string
  country: string
  address: string
  latitude: number
  longitude: number
  capacity: number
}

const AssetsInfo: FC<props> = ({
  makeStep,
  setAssetData,
  setLoadingAction,
}): ReactElement => {
  const [form] = Form.useForm()

  const [addAsset] = useAddAssetMutation()
  const { data, refetch } = useGetAssetsQuery()

  const onAddSucess = () => {}

  const onSuccess = () => {
    const data = {
      step: ESteps.REDEX_FORM,
    }
    setLoadingAction(false)
    handleAPIRequests({
      request: makeStep,
      ...data,
      onSuccess: onAddSucess,
      notify: true,
    })
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (data?.data) {
      form.setFieldsValue(data.data[0])
      setAssetData(data.data)
    }
  }, [data, form, setAssetData])

  const onFinish = (values: AssetDTO) => {
    const obj = values
    obj.latitude = parseFloat(`${obj.latitude}`)
    obj.longitude = parseFloat(`${obj.longitude}`)
    obj.capacity = parseFloat(`${obj.capacity}`)
    setLoadingAction(true)

    handleAPIRequests({
      request: addAsset,
      ...obj,
      onSuccess: onSuccess,
    })
  }

  const fuelOptions = [
    {
      id: 1,
      fuelType: EFuelType.HYDRO,
    },
    {
      id: 2,
      fuelType: EFuelType.SOLAR,
    },
    {
      id: 3,
      fuelType: EFuelType.WIND,
    },
  ]

  return (
    <Form
      className='space-y-12'
      name='asset-info-form'
      form={form}
      onFinish={onFinish}
    >
      <Row className='w-[100%]' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Asset name'
            label='Asset name'
            inputType='text'
            name='assetName'
            rules={requiredField('Asset name')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Asset owner'
            label='Asset owner'
            inputType='text'
            name='assetOwner'
            rules={requiredField('Asset owner')}
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
            placeholder='Fuel type'
            label='Fuel type'
            inputType='text'
            name='fuelType'
            type='select'
            options={fuelOptions.map((item) => ({
              key: item.id,
              value: item.fuelType,
              label: item.fuelType,
            }))}
            rules={requiredField('Fuel type')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Latitude'
            label='Latitude'
            inputType='number'
            name='latitude'
            rules={requiredField('Latitude')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Country'
            label='Country'
            inputType='text'
            name='country'
            rules={requiredField('Country')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Longitude'
            label='Longitude'
            inputType='number'
            name='longitude'
            rules={requiredField('Longitude')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={12}>
          <CustomInput
            placeholder='Capacity'
            label='Capacity'
            inputType='number'
            name='capacity'
            rules={requiredField('Capacity')}
          />
        </Col>
      </Row>
    </Form>
  )
}

export default AssetsInfo
