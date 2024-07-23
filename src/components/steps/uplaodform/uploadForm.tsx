import { Form } from 'antd'
import { FC, ReactElement, useState } from 'react'
import Dropzone, { Accept } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { ESteps } from '../../../config/constant'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import { getFromLocal, removeFromLocal } from '../../../helpers/handleStorage'
import Notify from '../../common/notification/notification'
import RedexForm from '../redexform/redexInfo'

interface Props {
  makeStep: () => void
  setLoadingAction: (state: boolean) => void
}

const UploadForm: FC<Props> = ({
  makeStep,
  setLoadingAction,
}): ReactElement => {
  const navigate = useNavigate()
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>('')
  const [preview, setPreview] = useState<Uint8Array | null>(null)
  const [File, setFile] = useState<File | null>(null)
  const onDrop = (acceptedFiles: File[]) => {
    setIsDragging(false)
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setFile(file)
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        setPreview(uint8Array)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const acceptedFileTypes: Accept = {
    'application/pdf': ['.pdf'],
  }

  const [form] = Form.useForm()

  const onAddSucess = () => {
    navigate('/ds')
  }

  const onSuccess = () => {
    setLoadingAction(false)
    const data = {
      step: ESteps.LAST_STEP,
    }
    handleAPIRequests({
      request: makeStep,
      ...data,
      onSuccess: onAddSucess,
      notify: true,
    })
  }

  const onFinish = () => {
    if (!File) {
      return
    }
    setLoadingAction(true)
    const formData = new FormData()
    formData.append('file', File)

    const localToken = getFromLocal<string>('token')

    fetch(`http://localhost:9000/api/v1/user/redex-file`, {
      headers: {
        authorization: `Bearer ${localToken}`,
      },
      method: 'POST',
      body: formData,
    })
      .then(() => {
        onSuccess()
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          removeFromLocal('token')
          window.location.href = '/'
        }

        if (err?.data) {
          Notify({
            message: err?.data?.error || 'Error',
            description:
              typeof err?.data?.message === 'string'
                ? err?.data?.message
                : err?.data?.message?.length >= 1
                ? err?.data?.message[0]
                : 'Something went wrong. Please try again later!',
            type: 'error',
          })
        }
      })
  }

  return (
    <Form name='upload-info-form' form={form} onFinish={onFinish}>
      <h2>Upload form</h2>
      <div>
        <Dropzone
          multiple={false}
          onDrop={onDrop}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          accept={acceptedFileTypes}
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
                {fileName.length > 0 ? (
                  <div className=' font-bold flex flex-col  gap-5'>
                    {preview && (
                      <RedexForm
                        file={preview}
                        className='h-[200px] w-[200px] '
                      />
                    )}
                    <p>{fileName}</p>
                  </div>
                ) : (
                  <div className='font-bold'>
                    <p>Drag and drop file here, or click to select file</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </Form>
  )
}

export default UploadForm
