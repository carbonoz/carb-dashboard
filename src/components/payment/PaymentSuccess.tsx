import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Alert, Card, Col, Result, Row, Spin, Typography } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useGetPaymentByIdQuery } from '../../lib/api/payment/paymentEndpoints'
import { useGetAdditionalInfoQuery } from '../../lib/api/user/userEndPoints'
import CustomButton from '../common/button/button'
import NavBar from '../common/header/header'

const { Title, Text, Paragraph } = Typography

interface PaymentDetailsType {
  id?: string
  amount?: number
  currency?: string
  status?: string
  transactionId?: string
  paypalToken?: string
  paypalPayerID?: string
  message?: string
}

interface LocationState {
  paymentId?: string
}

const PaymentSuccess: FC = (): ReactElement => {
  const { data } = useGetAdditionalInfoQuery()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [paymentStatus, setPaymentStatus] = useState<
    'loading' | 'success' | 'failed' | 'cancelled'
  >('loading')
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentDetailsType | null>(null)

  const paymentId =
    searchParams.get('paymentId') ||
    (location.state as LocationState)?.paymentId
  const token = searchParams.get('token')
  const payerID = searchParams.get('PayerID')
  const status = searchParams.get('status')

  const { data: paymentData, isLoading } = useGetPaymentByIdQuery(paymentId!, {
    skip: !paymentId,
  })

  useEffect(() => {
    if (location.pathname.includes('/success')) {
      if (paymentData) {
        const status = paymentData.data.status.toUpperCase()
        if (status === 'COMPLETED') {
          setPaymentStatus('success')
          setPaymentDetails(paymentData.data)
        } else if (status === 'FAILED') {
          setPaymentStatus('failed')
          setPaymentDetails(paymentData.data)
        } else if (status === 'PENDING') {
          setPaymentStatus('loading')
        } else {
          setPaymentStatus('loading')
        }
      } else if (token && payerID && !paymentId) {
        setPaymentStatus('success')
        setPaymentDetails({
          paypalToken: token,
          paypalPayerID: payerID,
          message: 'Payment completed successfully via PayPal',
        })
      } else if (!paymentId && !token) {
        setPaymentStatus('success')
      }
    } else if (location.pathname.includes('/cancel')) {
      setPaymentStatus('cancelled')
    } else if (status === 'failed') {
      setPaymentStatus('failed')
    }
  }, [location, paymentData, token, payerID, status, paymentId])

  const handleBackToDashboard = () => {
    navigate('/ds')
  }

  const handleViewPayments = () => {
    navigate('/ds/payments')
  }

  const handleRetryPayment = () => {
    navigate('/subscription')
  }

  if (isLoading) {
    return (
      <div className='flex flex-col h-screen'>
        <NavBar data={data?.data} additional={true} />
        <div className='flex-1 flex items-center justify-center bg-gray-50'>
          <Spin size='large' tip='Loading payment details...' />
        </div>
      </div>
    )
  }

  const renderSuccessContent = () => (
    <Result
      icon={<CheckCircleOutlined style={{ color: '#C1CF16' }} />}
      status='success'
      title='Payment Successful!'
      subTitle={
        <div className='space-y-2'>
          <p>Your subscription has been activated successfully.</p>
          {paymentDetails && (
            <div className='text-sm text-gray-600 space-y-1'>
              <p>Payment ID: {paymentDetails.id}</p>
              <p>
                Amount: ${paymentDetails.amount} {paymentDetails.currency}
              </p>
              {paymentDetails.transactionId && (
                <p>Transaction ID: {paymentDetails.transactionId}</p>
              )}
            </div>
          )}
        </div>
      }
      extra={[
        <CustomButton
          type='primary'
          key='dashboard'
          onClick={handleBackToDashboard}
        >
          Go to Dashboard
        </CustomButton>,
        <CustomButton key='payments' onClick={handleViewPayments}>
          View Payments
        </CustomButton>,
      ]}
    />
  )

  const renderFailedContent = () => (
    <Result
      icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
      status='error'
      title='Payment Failed'
      subTitle={
        <div className='space-y-2'>
          <p>We couldn't process your payment. Please try again.</p>
          {paymentDetails && (
            <div className='text-sm text-gray-600'>
              <p>Payment ID: {paymentDetails.id}</p>
              <p>Status: {paymentDetails.status}</p>
            </div>
          )}
        </div>
      }
      extra={[
        <CustomButton type='primary' key='retry' onClick={handleRetryPayment}>
          Try Again
        </CustomButton>,
        <CustomButton
          key='support'
          onClick={() => window.open('mailto:support@carbonoz.com')}
        >
          Contact Support
        </CustomButton>,
      ]}
    />
  )

  const renderCancelledContent = () => (
    <Result
      status='warning'
      title='Payment Cancelled'
      subTitle='You cancelled the payment process. No charges were made to your account.'
      extra={[
        <CustomButton type='primary' key='retry' onClick={handleRetryPayment}>
          Try Again
        </CustomButton>,
        <CustomButton key='dashboard' onClick={handleBackToDashboard}>
          Back to Dashboard
        </CustomButton>,
      ]}
    />
  )

  const renderContent = () => {
    switch (paymentStatus) {
      case 'success':
        return renderSuccessContent()
      case 'failed':
        return renderFailedContent()
      case 'cancelled':
        return renderCancelledContent()
      default:
        return (
          <div className='text-center'>
            <Spin size='large' />
            <p className='mt-4'>Processing your payment...</p>
          </div>
        )
    }
  }

  return (
    <div className='flex flex-col h-screen'>
      <NavBar data={data?.data} additional={true} />
      <div
        className='flex-1 overflow-y-auto p-6'
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className='max-w-4xl mx-auto'>
          <Row justify='center'>
            <Col xs={24} md={16} lg={12}>
              <Card className='shadow-lg'>{renderContent()}</Card>
            </Col>
          </Row>

          {paymentStatus === 'success' && (
            <Row justify='center' className='mt-8'>
              <Col xs={24} md={16}>
                <Card
                  title={
                    <div className='flex items-center gap-2'>
                      <CheckCircleOutlined style={{ color: '#C1CF16' }} />
                      <span>What's Next?</span>
                    </div>
                  }
                  className='text-center'
                >
                  <div className='space-y-4'>
                    <Paragraph>
                      Welcome to Carbonoz Pro! Your subscription is now active
                      and you have access to all premium features.
                    </Paragraph>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                      <div
                        className='p-4 rounded-lg'
                        style={{ backgroundColor: '#C1CF16', opacity: 0.1 }}
                      >
                        <Title level={5} style={{ color: '#1C2834' }}>
                          ✓ Real-time Monitoring
                        </Title>
                        <Text style={{ color: '#1C2834' }}>
                          Track your energy usage in real-time
                        </Text>
                      </div>

                      <div
                        className='p-4 rounded-lg'
                        style={{ backgroundColor: '#C1CF16', opacity: 0.1 }}
                      >
                        <Title level={5} style={{ color: '#1C2834' }}>
                          ✓ Advanced Analytics
                        </Title>
                        <Text style={{ color: '#1C2834' }}>
                          Get detailed insights and reports
                        </Text>
                      </div>

                      <div
                        className='p-4 rounded-lg'
                        style={{ backgroundColor: '#C1CF16', opacity: 0.1 }}
                      >
                        <Title level={5} style={{ color: '#1C2834' }}>
                          ✓ Carbon Tracking
                        </Title>
                        <Text style={{ color: '#1C2834' }}>
                          Monitor your carbon footprint
                        </Text>
                      </div>

                      <div
                        className='p-4 rounded-lg'
                        style={{ backgroundColor: '#C1CF16', opacity: 0.1 }}
                      >
                        <Title level={5} style={{ color: '#1C2834' }}>
                          ✓ Unlimited Devices
                        </Title>
                        <Text style={{ color: '#1C2834' }}>
                          Connect as many devices as you need
                        </Text>
                      </div>
                    </div>

                    <Alert
                      message='Need Help?'
                      description='Check out our documentation or contact support if you need assistance setting up your devices.'
                      type='info'
                      showIcon
                      action={
                        <CustomButton
                          size='small'
                          onClick={() =>
                            window.open('mailto:support@carbonoz.com')
                          }
                        >
                          Contact Support
                        </CustomButton>
                      }
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
