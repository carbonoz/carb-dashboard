import { Steps } from 'antd'
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useGetSystemStepsQuery,
  useMakeSystemStepMutation,
} from '../../lib/api/systemSteps/systemSteps'
import {
  useGetAdditionalInfoQuery,
  useGetAssetsQuery,
  useGetMeterQuery,
} from '../../lib/api/user/userEndPoints'
import CustomButton from '../common/button/button'
import NavBar from '../common/header/header'
import { GeneralContentLoader } from '../common/loader/loader'
import AgreementInfo from './aggreement/aggreement'
import Assets from './asset/asset'
import MeterInfo from './meter/meterEvidence'
import ProjectInfo from './project/projectInfo'
import UserInformation from './userinfo/userInformation'

const SystemUserSteps: FC = (): ReactElement | boolean => {
  const { data, refetch: refetchUserInfo } = useGetAdditionalInfoQuery()
  const navigate = useNavigate()
  const { data: stepsData, isFetching, refetch } = useGetSystemStepsQuery()
  const [makeStep, { isLoading }] = useMakeSystemStepMutation()
  const { data: assetData, refetch: refetchAsset } = useGetAssetsQuery()
  const { data: MeterData, refetch: refetchMeter } = useGetMeterQuery()

  const initialStepIndex = useMemo(() => {
    const stepMapping: { [key: string]: number } = {
      USER_INFORMATION: 0,
      ASSET: 1,
      METERING_EVIDENCE: 2,
      PROJECT: 3,
      CERTIFICATION: 4,
    }
    return stepsData?.data && stepsData.data.length > 0
      ? stepMapping[stepsData.data[0].step] ?? 0
      : 0
  }, [stepsData])

  const [current, setCurrent] = useState<number>(initialStepIndex)
  const [loadingAction, setLoadingAction] = useState<boolean>(false)

  useEffect(() => {
    refetch()
    refetchUserInfo()
    refetchAsset()
    refetchMeter()
  }, [refetch, refetchUserInfo, refetchAsset, refetchMeter])

  useEffect(() => {
    setCurrent(initialStepIndex)
  }, [initialStepIndex])

  useEffect(() => {
    if (
      stepsData?.data &&
      stepsData.data.length > 0 &&
      stepsData.data[0].status === true
    ) {
      navigate('/ds')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepsData])

  const steps = useMemo(
    () => [
      {
        title: 'User Information',
        content: (
          <UserInformation
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'user-info-form',
      },
      {
        title: 'Asset Information',
        content: (
          <Assets
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'asset-info-form',
      },
      {
        title: 'Meter Information',
        content: (
          <MeterInfo
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'meter-info-form',
      },
      {
        title: 'Project Information',
        content: (
          <ProjectInfo
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'project-info-form',
      },
      {
        title: 'Certificate Information',
        content: (
          <AgreementInfo
            makeStep={makeStep as () => unknown}
            setLoadingAction={setLoadingAction}
          />
        ),
        formId: 'agreement-info-form',
      },
    ],
    [makeStep]
  )

  const items = useMemo(
    () => steps.map((item) => ({ key: item.title, title: item.title })),
    [steps]
  )

  const next = useCallback(() => setCurrent((prev) => prev + 1), [])
  const prev = useCallback(() => setCurrent((prev) => prev - 1), [])
  const getCurrentFormId = useCallback(
    () => steps[current].formId,
    [current, steps]
  )

  const stepHeaders: { [key: number]: string } = {
    0: 'User Information',
    1: 'Asset Information',
    2: 'Meter Information',
    3: 'Project Information',
    4: 'Certificate Information',
  }

  return (
    <div className='flex flex-col overflow-y-hidden h-full'>
      <NavBar data={data?.data} additional={true} />
      {!isFetching ? (
        <div className='h-full overflow-y-auto'>
          <section className='flex justify-center h-full overflow-y-hidden'>
            <div className='2xl:w-[60%] xl:w-[80%] lg:w-[88%] w-[80%] mt-10 h-full'>
              <h1 className='text-lg font-bold text-[#c1cf16]'>
                {stepHeaders[current] || 'User Information'}
              </h1>
              <Steps current={current} items={items} className='mt-10 w-full' />
              <div
                className={`lg:h-[500px] overflow-y-auto mt-[50px] h-full scroll`}
              >
                {steps[current].content}
              </div>
              <div className='2xl:mt-[25px] lg:mt-[20px] mt-[30px] mb-[100px] flex gap-5 w-full'>
                {(current === 0 && !data?.data) ||
                (current === 1 && !assetData?.data) ||
                (current === 2 && !MeterData?.data)
                  ? null
                  : current < steps.length - 1 && (
                      <CustomButton
                        type='primary'
                        onClick={next}
                        className='lg:w-[30%] w-full h-[60px]'
                      >
                        Next
                      </CustomButton>
                    )}
                {current > 0 && (
                  <CustomButton
                    onClick={prev}
                    className='lg:w-[30%] w-full h-[60px]'
                    type='primary'
                  >
                    Previous
                  </CustomButton>
                )}
                <CustomButton
                  type='primary'
                  className='lg:w-[30%] w-full h-[60px] custom-button'
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

export default SystemUserSteps
