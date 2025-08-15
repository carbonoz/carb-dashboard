import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Alert, Button, Card, Col, Divider, Row, Spin, Typography } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGetAdditionalInfoQuery } from '../../lib/api/user/userEndPoints'
import {
  useCreatePaymentMutation,
  useCapturePaymentMutation,
  PaymentResponse,
  CapturePaymentResponse,
} from '../../lib/api/payment/paymentEndpoints'
import NavBar from '../common/header/header'
import handleAPIRequests from '../../helpers/handleApiRequest'

const { Title, Text } = Typography

interface PaymentData {
  planId: string
  billingType: 'monthly' | 'yearly'
  amount: number
  currency: string
}

const PayPalPayment: FC = (): ReactElement => {
  const { data } = useGetAdditionalInfoQuery()
  const location = useLocation()
  const navigate = useNavigate()
  const paymentData = location.state as PaymentData

  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation()
  const [capturePayment, { isLoading: isCapturing }] =
    useCapturePaymentMutation()

  const [paypalClientId, setPaypalClientId] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID
    if (clientId) {
      setPaypalClientId(clientId)
    } else {
      setError('PayPal client ID not configured')
    }
  }, [])

  useEffect(() => {
    if (!paymentData) {
      navigate('/subscription')
    }
  }, [paymentData, navigate])

  const handleCreateOrder = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!paymentData?.amount || paymentData.amount <= 0) {
        reject(new Error('Invalid payment amount'))
        return
      }

      const description = `Carbonoz Pro - ${paymentData.billingType} subscription`

      console.log('Creating PayPal order with data:', {
        amount: paymentData.amount,
        currency: paymentData.currency,
        description,
      })

      handleAPIRequests<PaymentResponse>({
        request: (props) =>
          createPayment({
            amount: paymentData.amount,
            currency: paymentData.currency || 'USD',
            description,
            ...props,
          }),
        onSuccess: (response: PaymentResponse) => {
          console.log('PayPal order created successfully:', response)

          if (!response?.data?.paypalOrder?.id) {
            console.error('Invalid PayPal order response:', response)
            reject(new Error('Invalid PayPal order response'))
            return
          }

          resolve(response.data.paypalOrder.id)
        },
        onError: (error) => {
          console.error('Failed to create PayPal order:', error)
          setError('Failed to create PayPal order. Please try again.')
          reject(new Error('Failed to create PayPal order'))
        },
        notify: false,
      })
    })
  }

  const handleApprove = async (data: { orderID: string }): Promise<void> => {
    return new Promise((resolve) => {
      if (!data?.orderID) {
        console.error('Missing PayPal order ID')
        setError('Payment approval failed - missing order ID')
        resolve()
        return
      }

      console.log('Capturing PayPal payment for order:', data.orderID)

      handleAPIRequests<CapturePaymentResponse>({
        request: (props) =>
          capturePayment({
            paypalOrderId: data.orderID,
            ...props,
          }),
        message: 'Your subscription has been activated successfully!',
        onSuccess: (response) => {
          console.log('Payment captured successfully:', response)

          if (response?.data?.success) {
            navigate('/payment/success')
          } else {
            console.error('Payment capture failed:', response)
            setError('Payment processing failed. Please contact support.')
          }
          resolve()
        },
        onError: (error) => {
          console.error('Payment capture error:', error)
          setError(
            'Payment processing failed. Please try again or contact support.'
          )
          resolve()
        },
        notify: true,
      })
    })
  }

  const handleError = (err: Record<string, unknown>) => {
    console.error('PayPal error:', err)
    setError(
      'PayPal payment processing failed. Please try again or use a different payment method.'
    )
  }

  const handleCancel = () => {
    console.log('Payment cancelled by user')
  }

  if (!paymentData) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div className='flex flex-col h-screen'>
        <NavBar data={data?.data} additional={true} />
        <div className='flex-1 flex items-center justify-center bg-gray-50'>
          <Alert
            message='Configuration Error'
            description={error}
            type='error'
            showIcon
            action={
              <Button onClick={() => navigate('/subscription')}>
                Back to Subscription
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-screen'>
      <NavBar data={data?.data} additional={true} />
      <div className='flex-1 overflow-y-auto bg-gray-50 p-6'>
        <div className='max-w-2xl mx-auto'>
          <div className='text-center mb-8'>
            <Title level={2} className='text-gray-800 mb-2'>
              Complete Your Payment
            </Title>
            <Text className='text-gray-600'>
              Secure payment processing powered by PayPal
            </Text>
          </div>

          <Row gutter={24}>
            <Col xs={24} lg={14}>
              <Card title='Payment Method' className='mb-6'>
                {paypalClientId ? (
                  <PayPalScriptProvider
                    options={{
                      clientId: paypalClientId,
                      currency: paymentData.currency,
                      intent: 'capture',
                    }}
                  >
                    <PayPalButtons
                      style={{
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'paypal',
                      }}
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                      onError={handleError}
                      onCancel={handleCancel}
                      disabled={isCreating || isCapturing}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <Spin size='large' />
                )}
              </Card>

              <div className='text-center'>
                <Button
                  type='link'
                  onClick={() => navigate('/subscription')}
                  className='text-gray-500'
                >
                  ← Back to Subscription Plans
                </Button>
              </div>
            </Col>

            <Col xs={24} lg={10}>
              <Card title='Order Summary' className='sticky top-6'>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <Text className='text-gray-600'>Plan:</Text>
                    <Text className='font-medium'>Carbonoz Pro</Text>
                  </div>

                  <div className='flex justify-between items-center'>
                    <Text className='text-gray-600'>Billing:</Text>
                    <Text className='font-medium capitalize'>
                      {paymentData.billingType}
                    </Text>
                  </div>

                  <Divider className='my-4' />

                  <div className='flex justify-between items-center'>
                    <Text className='text-lg font-semibold'>Total:</Text>
                    <Text className='text-xl font-bold text-[#C1CF16]'>
                      ${paymentData.amount} {paymentData.currency}
                    </Text>
                  </div>

                  <Divider className='my-4' />

                  <div className='text-sm text-gray-500 space-y-2'>
                    <p>✓ Real-time energy monitoring</p>
                    <p>✓ Unlimited device connections</p>
                    <p>✓ Advanced energy analytics</p>
                    <p>✓ Carbon footprint tracking</p>
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

export default PayPalPayment
