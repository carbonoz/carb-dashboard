import { Col, Form, Row } from 'antd'
import { FC, Fragment, useEffect, useState } from 'react'
import Dropzone, { Accept } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import { setToLocal } from '../../../helpers/handleStorage'
import requiredField from '../../../helpers/requiredField'
import uploadFile from '../../../helpers/uplaodFile'
import { AuthResponse } from '../../../lib/api/Auth/authEndpoints'
import {
  boxInterface,
  useRegisterBoxesMutation,
} from '../../../lib/api/box/boxEndPoints'
import CustomButton from '../../common/button/button'
import CustomImage from '../../common/image/customImage'
import CustomInput from '../../common/input/customInput'
import Notify from '../../common/notification/notification'

interface onFinishProps {
  serialNumber: string
  mqttIpAddress: string
  mqttUsername: string
  mqttPassword: string
  mqttPort: string
  confirmPassword: string
}

interface BoxInformationInterfaceProps {
  boxesData: Array<boxInterface> | undefined
}

const BoxInformation: FC<BoxInformationInterfaceProps> = ({ boxesData }) => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [, setUploadSuccess] = useState<boolean>(false)
  const [, setUploadFailure] = useState<boolean>(false)
  const [, setUploadedUrls] = useState<string[]>([])

  const [registerBox, { isLoading }] = useRegisterBoxesMutation()

  const onDrop = (acceptedFiles: File[]) => {
    setIsDragging(false)
    const newFiles = acceptedFiles.slice(0, 3)
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    const previews = newFiles.map((file) => URL.createObjectURL(file))
    setFilePreviews((prevPreviews) =>
      [...prevPreviews, ...previews].slice(0, 3)
    )
  }

  const acceptImages: Accept = {
    'image/*': [],
  }

  const onSuccess = (res: AuthResponse) => {
    setToLocal('token', res.data.token)
    navigate('/ds/profile')
  }

  useEffect(() => {
    if (boxesData) {
      if (boxesData.length) {
        navigate('/ds')
      }
    }
    //eslint-disable-next-line
  }, [boxesData])

  const onFinish = async (values: onFinishProps) => {
    if (values.confirmPassword !== values.mqttPassword) {
      Notify({
        message: 'Error',
        description: 'Password do not match',
        type: 'error',
      })
    }
    if (files.length === 0) return
    setLoading(true)
    setUploadSuccess(false)
    setUploadFailure(false)

    const obj = {
      serialNumber: values.serialNumber,
      mqttIpAddress: values.mqttIpAddress,
      mqttUsername: values.mqttUsername,
      mqttPassword: values.mqttPassword,
      mqttPort: parseInt(values.mqttPort),
    }
    try {
      const urls = await uploadFile({
        files: files,
        setUploadLoading: setLoading,
        setUploadSuccess: () => {},
        setUploadFailure: () => {},
        setImgURL: () => {},
      })

      setUploadedUrls(urls)

      if (urls.length > 0) {
        setUploadSuccess(true)
        setUploadFailure(false)
        const data = {
          ...obj,
          photoProof: urls,
        }
        handleAPIRequests({
          request: registerBox,
          ...data,
          onSuccess,
        })
      } else {
        setUploadFailure(true)
        setUploadSuccess(false)
      }
    } catch (error) {
      setUploadFailure(true)
      setUploadSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <h1 className=' text-xl  text-[#C1CF16] font-bold mb-4 '>
        Upload Box Information
      </h1>
      <div className='mb-4'>
        <Form form={form} name='box-info' onFinish={onFinish}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className='gutter-row mt-2 ' span={12}>
              <CustomInput
                name='serialNumber'
                placeholder='Serial number'
                label='Serial number'
                rules={requiredField('Serial number ')}
              />
            </Col>
            <Col className='gutter-row mt-2 ' span={12}>
              <CustomInput
                name='mqttIpAddress'
                placeholder='Mqtt broker Ip address'
                label='Mqtt broker address'
                rules={requiredField('Mqtt broker address ')}
              />
            </Col>
            <Col className='gutter-row mt-2 ' span={12}>
              <CustomInput
                name='mqttPort'
                placeholder='Mqtt broker Ip port'
                label='Mqtt broker port'
                rules={requiredField('Mqtt broker Ip port ')}
              />
            </Col>
            <Col className='gutter-row mt-2 ' span={12}>
              <CustomInput
                name='mqttUsername'
                placeholder='Mqtt broker username'
                label='Mqtt broker username'
                rules={requiredField('Mqtt username ')}
              />
            </Col>
            <Col className='gutter-row mt-2 ' span={12}>
              <CustomInput
                name='mqttPassword'
                placeholder='Mqtt broker password'
                label='Mqtt broker password'
                inputType='password'
                rules={requiredField('Mqtt password ')}
              />
            </Col>
            <Col className='gutter-row mt-2 ' span={12}>
              <CustomInput
                placeholder='Confirm password'
                label='Confirm password'
                inputType='password'
                name='confirmPassword'
                rules={requiredField('Confirm password')}
              />
            </Col>
          </Row>

          <div className='mb-3 mt-3 font-bold'>
            You can upload up to 3 Images of your inverter
          </div>
          <Dropzone
            multiple={true}
            onDrop={onDrop}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            accept={acceptImages}
          >
            {({ getRootProps, getInputProps }) => (
              <section
                className={`relative border-dashed border w-full h-[300px] mt-2 mb-2 ${
                  isDragging ? 'border-blue-500' : 'border-gray-400'
                }`}
              >
                <div
                  {...getRootProps({
                    className:
                      'text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full',
                  })}
                >
                  <input {...getInputProps()} />

                  {filePreviews.length > 0 ? (
                    <div className=' flex justify-center items-center'>
                      <div className='font-bold flex flex-wrap gap-4'>
                        {filePreviews.map((preview, index) => (
                          <Fragment key={index}>
                            <CustomImage
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className='w-full h-auto object-cover'
                              width={120}
                              height={120}
                            />
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className='font-bold'>
                      <p>
                        Drag and drop files here, or click to select files
                        (Images only)
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </Dropzone>
        </Form>
      </div>
      <CustomButton
        htmlType='submit'
        form='box-info'
        type='primary'
        loading={loading || isLoading}
        className=' w-[100px] h-[50px]'
      >
        Submit
      </CustomButton>
    </div>
  )
}

export default BoxInformation
