type UploadFileParams = {
  files?: File[]
  setUploadLoading?: (loading: boolean) => void
  setUploadSuccess?: (success: boolean) => void
  setUploadFailure?: (failure: boolean) => void
  setImgURL?: (url: string | null) => void
}

const uploadFile = ({
  files = [],
  setUploadLoading = () => null,
  setUploadSuccess = () => null,
  setUploadFailure = () => null,
  setImgURL = () => null,
}: UploadFileParams): void => {
  const CLAUD_NAME = import.meta.env.NEXT_PUBLIC_CLAUDINARY_CLAUD_NAME
  const PRESET = import.meta.env.NEXT_PUBLIC_CLAUDINARY_PRESET

  if (!CLAUD_NAME || !PRESET) {
    console.error('Environment variables for Cloudinary are not set.')
    return
  }

  setUploadLoading(true)

  const formData = new FormData()
  formData.append('file', files[0])
  formData.append('upload_preset', PRESET)

  fetch(`https://api.cloudinary.com/v1_1/${CLAUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      setUploadLoading(false)
      setUploadFailure(false)
      setUploadSuccess(true)
      setImgURL(res?.secure_url)
    })
    .catch(() => {
      setUploadLoading(false)
      setUploadFailure(true)
      setUploadSuccess(false)
      setImgURL(null)
    })
}

export default uploadFile
