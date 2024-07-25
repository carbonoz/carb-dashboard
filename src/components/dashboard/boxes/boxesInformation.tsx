import { Form } from 'antd'
import { FC, Fragment, useState } from 'react'
import Dropzone, { Accept } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import requiredField from '../../../helpers/requiredField'
import uploadFile from '../../../helpers/uplaodFile'
import { useRegisterBoxesMutation } from '../../../lib/api/box/boxEndPoints'
import CustomButton from '../../common/button/button'
import CustomImage from '../../common/image/customImage'
import CustomInput from '../../common/input/customInput'

interface onFinishProps {
  serialNumber: string
}

const BoxInformation: FC = () => {
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

  const onSuccess = () => {
    navigate('/ds/profile')
  }

  const onFinish = async (values: onFinishProps) => {
    if (files.length === 0) return
    setLoading(true)
    setUploadSuccess(false)
    setUploadFailure(false)

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
          ...values,
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
          <CustomInput
            name='serialNumber'
            placeholder='Serial number'
            label='Serial number'
            rules={requiredField('Serial number ')}
          />
          <div className='mb-3 font-bold'>
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
