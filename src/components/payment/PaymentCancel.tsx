import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Card, Col, Result, Row, Typography } from 'antd'
import { FC, ReactElement } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetAdditionalInfoQuery } from '../../lib/api/user/userEndPoints'
import CustomButton from '../common/button/button'
import NavBar from '../common/header/header'

const { Text } = Typography

const PaymentCancel: FC = (): ReactElement => {
  const { data } = useGetAdditionalInfoQuery()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const handleRetryPayment = () => {
    navigate('/subscription')
  }

  const handleBackToDashboard = () => {
    navigate('/ds/dashboard')
  }

  // const handleContactSupport = () => {
  //   window.open('mailto:support@carbonoz.com?subject=Payment Cancelled - Need Help')
  // }

  return (
    <div className='flex flex-col h-screen'>
      <NavBar data={data?.data} additional={true} />
      <div className='flex-1 overflow-y-auto bg-gray-50 p-6'>
        <div className='max-w-4xl mx-auto'>
          <Row justify='center'>
            <Col xs={24} md={16} lg={12}>
              <Card className='shadow-lg'>
                <Result
                  icon={
                    <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                  }
                  status='warning'
                  title='Payment Cancelled'
                  subTitle={
                    <div className='space-y-2'>
                      <p>You cancelled the payment process.</p>
                      <p className='text-sm text-gray-600'>
                        No charges were made to your account.
                      </p>
                      {token && (
                        <p className='text-xs text-gray-500'>
                          PayPal Token: {token.substring(0, 20)}...
                        </p>
                      )}
                    </div>
                  }
                  extra={[
                    <CustomButton
                      type='primary'
                      key='retry'
                      onClick={handleRetryPayment}
                    >
                      Try Payment Again
                    </CustomButton>,
                    <CustomButton
                      key='dashboard'
                      onClick={handleBackToDashboard}
                    >
                      Back to Dashboard
                    </CustomButton>,
                  ]}
                />
              </Card>
            </Col>
          </Row>

          <Row justify='center' className='mt-8'>
            <Col xs={24} md={16}>
              <Card title='Why Choose Carbonoz Pro?' className='text-center'>
                <div className='space-y-4'>
                  <Text>
                    Don't miss out on premium features that can help you save
                    energy and reduce your carbon footprint.
                  </Text>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                    <div className='p-4 bg-green-50 rounded-lg'>
                      <h4 className='font-semibold text-green-700'>
                        Real-time Monitoring
                      </h4>
                      <Text className='text-sm'>
                        Get instant insights into your energy consumption
                      </Text>
                    </div>

                    <div className='p-4 bg-blue-50 rounded-lg'>
                      <h4 className='font-semibold text-blue-700'>
                        Advanced Analytics
                      </h4>
                      <Text className='text-sm'>
                        Detailed reports and energy optimization tips
                      </Text>
                    </div>

                    <div className='p-4 bg-purple-50 rounded-lg'>
                      <h4 className='font-semibold text-purple-700'>
                        Carbon Footprint
                      </h4>
                      <Text className='text-sm'>
                        Track and reduce your environmental impact
                      </Text>
                    </div>

                    <div className='p-4 bg-orange-50 rounded-lg'>
                      <h4 className='font-semibold text-orange-700'>
                        Unlimited Devices
                      </h4>
                      <Text className='text-sm'>
                        Connect and monitor all your devices
                      </Text>
                    </div>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 justify-center mt-6'>
                    <CustomButton
                      type='primary'
                      size='large'
                      onClick={handleRetryPayment}
                    >
                      Subscribe Now
                    </CustomButton>
                    <CustomButton size='large'>
                      Have Questions? Contact Us
                    </CustomButton>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel
