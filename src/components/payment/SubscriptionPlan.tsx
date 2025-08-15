import { CheckOutlined, ThunderboltOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Switch,
  Typography,
} from 'antd'
import { FC, ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAdditionalInfoQuery } from '../../lib/api/user/userEndPoints'
import NavBar from '../common/header/header'

const { Title, Text } = Typography

interface PlanFeature {
  name: string
  included: boolean
}

interface SubscriptionPlanType {
  id: string
  name: string
  icon: ReactElement
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: PlanFeature[]
  popular?: boolean
  color: string
  buttonText: string
}

const SubscriptionPlan: FC = (): ReactElement => {
  const { data } = useGetAdditionalInfoQuery()
  const navigate = useNavigate()
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')

  const plans: SubscriptionPlanType[] = [
    {
      id: 'professional',
      name: 'Carbonoz Pro',
      icon: <ThunderboltOutlined style={{ fontSize: '28px' }} />,
      price: { monthly: 49, yearly: 490 },
      description: 'Complete energy monitoring and analytics solution',
      color: '#C1CF16',
      buttonText: 'Start Monitoring',
      popular: true,
      features: [
        { name: 'Real-time energy monitoring', included: true },
        { name: 'Unlimited device connections', included: true },
        { name: 'Advanced energy analytics', included: true },
        { name: 'Carbon footprint tracking', included: true },
        // { name: 'Smart alerts & notifications', included: true },
        // { name: 'Energy usage optimization', included: true },
        // { name: 'Export energy reports (PDF/CSV)', included: true },
        // { name: 'Historical data (5 years)', included: true },
        // { name: 'Mobile app access', included: true },
        // { name: 'Priority technical support', included: true },
        // { name: 'API access for integrations', included: true },
        // { name: 'Custom dashboards', included: true },
      ],
    },
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handleProceedToPayment = () => {
    const selectedPlanData = plans.find(plan => plan.id === selectedPlan)
    if (selectedPlanData) {
      const paymentData = {
        planId: selectedPlan,
        billingType: isYearly ? 'yearly' : 'monthly',
        amount: isYearly ? selectedPlanData.price.yearly : selectedPlanData.price.monthly,
        currency: 'USD'
      }
      // Navigate to PayPal payment with plan data
      navigate('/payment/paypal', { state: paymentData })
    }
  }

  const getDiscountPercentage = (monthly: number, yearly: number) => {
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100)
  }

  return (
    <div className='flex flex-col h-screen'>
      <NavBar data={data?.data} additional={true} />
      <div className='flex-1 overflow-y-auto bg-white p-10 scroll'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-10'>
            <Space size='middle' align='center'>
              <Text className='text-base font-medium text-gray-700'>
                Monthly
              </Text>
              <Switch
                checked={isYearly}
                onChange={setIsYearly}
                style={{ backgroundColor: isYearly ? '#C1CF16' : '#e5e7eb' }}
              />
              <Text className='text-base font-medium text-gray-700'>
                Yearly
                <Badge
                  count='Save 20%'
                  style={{
                    backgroundColor: '#C1CF16',
                    marginLeft: '8px',
                    fontSize: '12px',
                    color: 'white',
                  }}
                />
              </Text>
            </Space>
          </div>

          <Row gutter={[24, 24]} justify='center'>
            {plans.map((plan) => (
              <Col xs={24} md={16} lg={12} key={plan.id}>
                <Card
                  hoverable
                  className={`h-full rounded-2xl bg-white relative transition-all duration-300 ease-in-out border ${
                    selectedPlan === plan.id
                      ? 'border-[3px] -translate-y-1'
                      : 'border-gray-200'
                  } ${
                    plan.popular
                      ? 'shadow-[0_20px_40px_rgba(193,207,22,0.2)]'
                      : 'shadow-lg'
                  }`}
                  style={{
                    borderColor:
                      selectedPlan === plan.id ? plan.color : '#e5e7eb',
                    overflow: 'visible',
                  }}
                  bodyStyle={{
                    padding: '32px 24px',
                    backgroundColor: 'white',
                  }}
                >
                  {plan.popular && (
                    <div className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#C1CF16] text-white px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider'>
                      Recommended Plan
                    </div>
                  )}

                  <div className='text-center mb-6'>
                    <div
                      className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'
                      style={{
                        background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}40)`,
                        color: plan.color,
                      }}
                    >
                      {plan.icon}
                    </div>
                    <Title level={3} className='mb-2 text-gray-800'>
                      {plan.name}
                    </Title>
                    <Text className='text-gray-500 text-sm'>
                      {plan.description}
                    </Text>
                  </div>

                  <div className='text-center mb-8'>
                    <div className='flex items-baseline justify-center gap-1'>
                      <Text
                        className='text-5xl font-bold'
                        style={{ color: plan.color }}
                      >
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </Text>
                      <Text className='text-base text-gray-500'>
                        /{isYearly ? 'year' : 'month'}
                      </Text>
                    </div>
                    {isYearly && (
                      <Text className='text-[#C1CF16] text-sm font-medium block mt-1'>
                        Save{' '}
                        {getDiscountPercentage(
                          plan.price.monthly,
                          plan.price.yearly
                        )}
                        % annually
                      </Text>
                    )}
                  </div>

                  <Button
                    type={
                      selectedPlan === plan.id
                        ? 'primary'
                        : plan.popular
                        ? 'primary'
                        : 'default'
                    }
                    size='large'
                    block
                    className='h-12 rounded-lg font-semibold text-base mb-6'
                    style={{
                      backgroundColor:
                        selectedPlan === plan.id
                          ? plan.color
                          : plan.popular
                          ? plan.color
                          : 'white',
                      borderColor:
                        selectedPlan === plan.id
                          ? plan.color
                          : plan.popular
                          ? plan.color
                          : '#d1d5db',
                      color:
                        selectedPlan === plan.id
                          ? '#1C2834'
                          : plan.popular
                          ? '#1C2834'
                          : '#374151',
                    }}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Selected' : plan.buttonText}
                  </Button>

                  <Divider className='my-6 border-gray-200' />

                  <div>
                    <Text className='text-base font-semibold text-gray-800 block mb-4'>
                      Features included:
                    </Text>
                    <Space direction='vertical' size='small' className='w-full'>
                      {plan.features.map((feature, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <CheckOutlined
                            className={`text-sm flex-shrink-0 ${
                              feature.included
                                ? 'text-[#C1CF16]'
                                : 'text-gray-400'
                            }`}
                          />
                          <Text
                            className={`text-sm ${
                              feature.included
                                ? 'text-gray-700'
                                : 'text-gray-400 line-through'
                            }`}
                          >
                            {feature.name}
                          </Text>
                        </div>
                      ))}
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className='text-center mt-10'>
            <Button
              type='primary'
              size='large'
              className='mb-6 px-12 py-3 h-12 rounded-lg font-semibold text-base'
              style={{
                backgroundColor: '#C1CF16',
                borderColor: '#C1CF16',
                color: '#1C2834',
              }}
              onClick={handleProceedToPayment}
              disabled={!selectedPlan}
            >
              Proceed to Payment
            </Button>
            <br />
            <Text className='text-gray-600 text-sm'>
              Start monitoring your energy usage today. Cancel anytime.
            </Text>
            <br />
            <Text className='text-gray-600 text-sm'>
              Questions?{' '}
              <a
                href='#'
                className='text-[#C1CF16] hover:text-[#C1CF16]/80 transition-colors'
              >
                Contact our technical support
              </a>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionPlan
