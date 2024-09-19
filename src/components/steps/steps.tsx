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
import { useNavigate } from 'react-router-dom'
import pdf from '../../assets/redex-form/Template.pdf'
import { ESteps } from '../../config/constant'
import handleAPIRequests from '../../helpers/handleApiRequest'
import {
  useGetStepsQuery,
  useMakeStepMutation,
} from '../../lib/api/redexsteps/stepsEndpoints'
import { useGetAdditionalInfoQuery } from '../../lib/api/user/userEndPoints'
import Private from '../../routes/private'
import CustomButton from '../common/button/button'
import NavBar from '../common/header/header'
import { GeneralContentLoader } from '../common/loader/loader'
import RedexForm from './redexform/redexInfo'
import UploadForm from './uplaodform/uploadForm'
import RedexFields from './redexFields/redexFields'

const UserSteps: FC = (): ReactElement | boolean => {
  const { data: stepsData, isFetching, refetch } = useGetStepsQuery()
  const { data } = useGetAdditionalInfoQuery()

  const navigate = useNavigate()

  const [makeStep, { isLoading }] = useMakeStepMutation()
  const [isFile, setIsFile] = useState<boolean>(false)
  const [loadingAction, setLoadingAction] = useState<boolean>(false)

  const initialStepIndex = useMemo(() => {
    const stepMapping: { [key: string]: number } = {
      REDEX_FORM: 0,
      UPLOAD_FORM: 1,
      REDEX_FIELDS: 2,
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
      navigate('/systemsteps')
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
      {
        title: 'Redex Fields',
        content: (
          <RedexFields
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'redex-fields-form',
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
    if (!!isFile && current === 0) {
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
    0: 'Redex Information',
    1: 'Upload signed form',
    2: 'Redex Fields',
  }

  return (
    <div className='flex flex-col overflow-y-hidden 2xl:h-[100vh] xl:h-[100%] lg:h-[100%] h-[100%]'>
      <NavBar data={data?.data} additional={true} />
      {!isFetching ? (
        <div className='h-[100%] overflow-y-auto scroll'>
          <section className='flex justify-center h-[100%] overflow-y-auto scroll '>
            <div className='2xl:w-[60%] xl:w-[80%] lg:w-[88%] w-[80%] mt-10 h-[100%]'>
              <h1 className='text-lg font-bold text-[#c1cf16]'>
                {stepHeaders[current] || 'Additional Information'}
              </h1>
              <Steps
                current={current}
                items={items}
                className='mt-10  w-[100%]'
              />
              <div
                className={` ${
                  current === 2
                    ? 'lg:h-[500px] overflow-y-auto overflow-x-hidden mt-[50px] scroll '
                    : 'lg:h-[600px] overflow-y-auto overflow-x-hidden scroll '
                } '  h-[100%] p-10`}
              >
                {steps[current].content}
              </div>
              <div className=' 2xl:mt-[60px] lg:mt-[60px] mt-[30px] mb-[100px] flex lg:flex-row md:flex-row sm:flex-row flex-col gap-5 w-full'>
                {current === 1 &&
                stepsData?.data &&
                stepsData.data.length > 0 &&
                stepsData.data[0].step !== ESteps.REDEX_FIELDS
                  ? null
                  : current < steps.length - 1 &&
                    stepsData?.data &&
                    stepsData.data.length > 0 &&
                    typeof stepsData.data[0].isFile === 'boolean' && (
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
                {current === 0 && (
                  <CustomButton
                    onClick={saveFile}
                    className='lg:w-[30%] w-[100%] h-[60px] custom-button'
                    type='primary'
                    background={'bg-[#31b0d5]'}
                  >
                    Download form
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
