import { Steps } from 'antd'
import saveAs from 'file-saver'
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import pdf from '../../assets/redex-form/Template.pdf'
import { ESteps } from '../../config/constant'
import handleAPIRequests from '../../helpers/handleApiRequest'
import {
  useGetStepsQuery,
  useMakeStepMutation,
} from '../../lib/api/steps/stepsEndpoints'
import {
  AdditionalInfoInt,
  assetInt,
  useGetAdditionalInfoQuery,
} from '../../lib/api/user/userEndPoints'
import CustomButton from '../common/button/button'
import NavBar from '../common/header/header'
import { GeneralContentLoader } from '../common/loader/loader'
import AssetsInfo from './assetInfo/assetsInfo'
import RedexForm from './redexform/redexInfo'
import UploadForm from './uplaodform/uploadForm'
import UserInfo from './userInfo/userInfo'
import Private from '../../routes/private'
import { useNavigate } from 'react-router-dom'

const UserSteps: FC = (): ReactElement | boolean => {
  const { data: stepsData, isFetching, refetch } = useGetStepsQuery()
  const { data } = useGetAdditionalInfoQuery()

  const navigate = useNavigate()

  const [makeStep, { isLoading }] = useMakeStepMutation()
  const [userInfoData, setUserInfoData] = useState<
    AdditionalInfoInt | undefined
  >(undefined)

  const [assetData, setAssetData] = useState<Array<assetInt> | undefined>(
    undefined
  )

  const [isFile, setIsFile] = useState<boolean>(false)
  const [loadingAction, setLoadingAction] = useState<boolean>(false)

  const initialStepIndex = useMemo(() => {
    const stepMapping: { [key: string]: number } = {
      USER_INFO: 0,
      ASSET_INFO: 1,
      REDEX_FORM: 2,
      UPLOAD_FORM: 3,
    }
    if (stepsData?.data && stepsData.data.length > 0) {
      return stepMapping[stepsData.data[0].step] ?? 0
    }
    return 0
  }, [stepsData])

  const [current, setCurrent] = useState<number>(initialStepIndex)

  useEffect(() => {
    setCurrent(initialStepIndex)
  }, [initialStepIndex])

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (
      stepsData?.data &&
      stepsData.data.length > 0 &&
      stepsData.data[0].status === true
    ) {
      navigate('/ds')
    }
  }, [stepsData, navigate])

  useEffect(() => {
    if (
      stepsData?.data &&
      stepsData.data.length > 0 &&
      typeof stepsData.data[0].isFile === 'boolean'
    ) {
      setIsFile(stepsData.data[0].isFile)
    }
  }, [stepsData])

  const steps = useMemo(
    () => [
      {
        title: 'User Information',
        content: (
          <UserInfo
            setUserInfoData={setUserInfoData}
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'user-info-form',
      },
      {
        title: 'Assets Information',
        content: (
          <AssetsInfo
            makeStep={makeStep as () => unknown}
            setAssetData={setAssetData}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'asset-info-form',
      },
      {
        title: 'Redex Information',
        content: <RedexForm />,
        formId: 'redex-info-form',
      },
      {
        title: 'Upload signed form',
        content: (
          <UploadForm
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'upload-info-form',
      },
    ],
    [makeStep]
  )

  const items = useMemo(
    () => steps.map((item) => ({ key: item.title, title: item.title })),
    [steps]
  )

  const next = useCallback(() => {
    setCurrent((prev) => prev + 1)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => prev - 1)
  }, [])

  const getCurrentFormId = useCallback(
    () => steps[current].formId,
    [current, steps]
  )

  const saveFile = useCallback(() => {
    const onSuccess = () => {
      saveAs(pdf, 'Form')
    }
    const data = {
      step: ESteps.UPLOAD_FORM,
    }
    handleAPIRequests({
      request: makeStep,
      ...data,
      onSuccess: onSuccess,
    })
  }, [makeStep])

  const checkFile = useCallback(() => {
    const onSuccess = () => {
      next()
    }
    if (!!isFile && current === 2) {
      const data = {
        step: ESteps.UPLOAD_FORM,
      }
      handleAPIRequests({
        request: makeStep,
        ...data,
        onSuccess,
      })
    } else {
      next()
    }
  }, [isFile, current, makeStep, next])

  const stepHeaders: { [key: number]: string } = {
    0: 'User Information',
    1: 'Assets Information',
    2: 'Redex Information',
    3: 'Upload signed form',
  }

  return (
    <div className='flex flex-col overflow-y-hidden 2xl:h-[100vh] xl:h-[100%] lg:h-[100%] h-[100%]'>
      <NavBar data={data?.data} additional={true} />
      {!isFetching ? (
        <div className='h-[100%] overflow-y-auto'>
          <section className='flex justify-center h-[100%] overflow-y-hidden '>
            <div className='2xl:w-[60%] xl:w-[80%] lg:w-[88%] w-[80%] mt-10 h-[100%]'>
              <h1 className='text-lg font-bold text-[#c1cf16]'>
                {stepHeaders[current] || 'Additional Information'}
              </h1>
              <Steps
                current={current}
                items={items}
                className='mt-10  w-[100%]'
              />
              <div className='mt-[50px]  lg:h-[500px] h-[100%]  overflow-y-hidden'>
                {steps[current].content}
              </div>
              <div className=' 2xl:mt-[25px] lg:mt-[20px] mt-[30px] mb-[100px] flex lg:flex-row md:flex-row sm:flex-row flex-col gap-5 w-full'>
                {current === 0 && !userInfoData
                  ? null
                  : current === 1 && (!assetData || assetData.length === 0)
                  ? null
                  : current < steps.length - 1 && (
                      <CustomButton
                        type='primary'
                        onClick={checkFile}
                        className='lg:w-[30%] w-[100%] h-[60px]'
                      >
                        Next
                      </CustomButton>
                    )}
                {current > 0 && (
                  <CustomButton
                    onClick={prev}
                    className='lg:w-[30%] w-[100%] h-[60px]'
                    type='primary'
                  >
                    Previous
                  </CustomButton>
                )}
                {current === 2 && (
                  <CustomButton
                    onClick={saveFile}
                    className='lg:w-[30%] w-[100%] h-[60px] custom-button'
                    type='primary'
                    background={'bg-[#31b0d5]'}
                  >
                    Downlaod form
                  </CustomButton>
                )}
                <CustomButton
                  type='primary'
                  className='lg:w-[30%] w-[100%] h-[60px] custom-button '
                  form={getCurrentFormId()}
                  htmlType='submit'
                  background={'bg-[#31b0d5]'}
                  loading={loadingAction || isLoading}
                >
                  {current === steps.length - 1 ? 'SEND' : 'SUBMIT'}
                </CustomButton>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <GeneralContentLoader />
      )}
    </div>
  )
}

const PrivateUserSteps = Private(UserSteps)

export default PrivateUserSteps
