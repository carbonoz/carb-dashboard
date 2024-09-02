import { Col, Form, Row } from 'antd'
import { FC, ReactElement, useEffect, useMemo } from 'react'
import countryList from 'react-select-country-list'
import { EFuelType, ESteps } from '../../../config/constant'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import { useWindowSize } from '../../../helpers/interfaceSize'
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

  const options = useMemo(() => countryList().getData(), [])

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
    obj.assetOwner = 'tes'
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

  const { width } = useWindowSize()

  const latitudeRegex = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)$/
  const longitudeRegex =
    /^-?((1[0-7][0-9](\.\d+)?)|([1-9]?[0-9](\.\d+)?)|180(\.0+)?)$/

  return (
    <Form
      className='space-y-12'
      name='asset-info-form'
      form={form}
      onFinish={onFinish}
    >
      <Row className='w-[100%]' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
          <CustomInput
            placeholder='Asset name'
            label='Asset name'
            inputType='text'
            name='assetName'
            rules={requiredField('Asset name')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
          <CustomInput
            placeholder='Address'
            label='Address'
            inputType='text'
            name='address'
            rules={requiredField('address')}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
          <CustomInput
            placeholder='Fuel type'
            label='Type of electricity generation'
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
        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
          <CustomInput
            placeholder='-74.0058'
            label='Latitude '
            inputType='number'
            name='latitude'
            rules={[
              {
                pattern: latitudeRegex,
                message:
                  'Latitude must be between -90 and 90 with up to 6 decimal places.',
              },
            ]}
          />
        </Col>

        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
          <CustomInput
            placeholder='139.7500'
            label='Longitude'
            inputType='number'
            name='longitude'
            rules={[
              {
                pattern: longitudeRegex,
                message:
                  'Longitude must be between -180 and 180 with up to 6 decimal places.',
              },
            ]}
          />
        </Col>
        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
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
        <Col className='gutter-row mt-2 ' span={width <= 480 ? 24 : 12}>
          <CustomInput
            placeholder='Capacity KWh'
            label='Capacity KWh'
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
