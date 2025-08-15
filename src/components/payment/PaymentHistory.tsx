import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import handleAPIRequests from '../../helpers/handleApiRequest'
import {
  useCancelPaymentMutation,
  useGetUserPaymentsQuery,
} from '../../lib/api/payment/paymentEndpoints'
import { RootState } from '../../lib/redux/store'
import CustomButton from '../common/button/button'
import { GeneralContentLoader } from '../common/loader/loader'
import CustomModal from '../common/modal/customModal'
import Paginator from '../common/paginator/paginator'

const { Title, Text } = Typography
const { Column } = Table

interface PaymentRecord {
  id: string
  amount: number
  currency: string
  status: string
  paypalOrderId?: string
  transactionId?: string
  description?: string
  createdAt: string
  updatedAt: string
}

const PaymentHistory: FC = (): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [status, setStatus] = useState<string>('')
  const size = 10

  const {
    data: paymentsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserPaymentsQuery({
    page: currentPage.toString(),
    size: size.toString(),
    status,
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const [cancelPayment, { isLoading: isCancelling }] =
    useCancelPaymentMutation()
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(
    null
  )
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate()
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'success'
      case 'PENDING':
        return 'processing'
      case 'FAILED':
        return 'error'
      case 'CANCELLED':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircleOutlined />
      case 'PENDING':
        return <ClockCircleOutlined />
      case 'FAILED':
        return <CloseCircleOutlined />
      case 'CANCELLED':
        return <ExclamationCircleOutlined />
      default:
        return <ClockCircleOutlined />
    }
  }

  const formatDate = useCallback((dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm')
  }, [])

  const formatAmount = useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
  }, [])

  const handleViewDetails = (payment: PaymentRecord) => {
    setSelectedPayment(payment)
    setIsModalVisible(true)
  }

  const handleCancelPayment = useCallback(
    (paymentId: string) => {
      handleAPIRequests({
        request: () => cancelPayment(paymentId),
        message: 'Payment cancelled successfully',
        onSuccess: () => {
          refetch()
        },
        onError: (error) => {
          console.error('Failed to cancel payment:', error)
        },
      })
    },
    [cancelPayment, refetch]
  )

  const getColumnProps = useCallback(
    (label: string) => ({
      className: 'bg-white dark:bg-gray-800 dark:text-gray-100 c-column',
      onCell: () =>
        ({
          'data-label': label,
        } as React.TdHTMLAttributes<HTMLTableCellElement>),
    }),
    []
  )

  const onChangeStatus = (status: string) => {
    setStatus(status)
    setCurrentPage(0)
  }

  const getPaymentSummary = () => {
    const payments = paymentsData?.data.items || []
    const total = payments.reduce((sum, payment) => {
      return payment.status.toUpperCase() === 'COMPLETED'
        ? sum + payment.amount
        : sum
    }, 0)

    const completed = payments.filter(
      (p) => p.status.toUpperCase() === 'COMPLETED'
    ).length
    const pending = payments.filter(
      (p) => p.status.toUpperCase() === 'PENDING'
    ).length
    const failed = payments.filter(
      (p) => p.status.toUpperCase() === 'FAILED'
    ).length

    return { total, completed, pending, failed, totalPayments: payments.length }
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  const summary = getPaymentSummary()

  if (isLoading) {
    return <GeneralContentLoader />
  }

  return (
    <div className='w-full'>
      <div className='p-6'>
        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4'>
          <div className='flex-1'>
            <Title level={2} className='text-gray-800 dark:text-white mb-2'>
              Payment History
            </Title>
            <Text className='text-gray-600 dark:text-gray-300'>
              View and manage all your payment transactions
            </Text>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 lg:flex-shrink-0'>
            <CustomButton
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isFetching}
              className='w-full sm:w-auto h-[60px]'
            >
              Refresh
            </CustomButton>
            <CustomButton
              type='primary'
              icon={<DollarOutlined />}
              onClick={() => navigate('/subscription')}
              className='w-full sm:w-auto h-[60px]'
            >
              New Payment
            </CustomButton>
          </div>
        </div>

        {/* Filters */}
        <div className='mb-6 border border-gray-300 dark:border-gray-600 rounded-2xl'>
          <div className='flex justify-between items-center p-5 w-[100%] bg-[#1C2834] rounded-t-2xl'>
            <h1 className='lg:text-xl text-base text-[#C1CF16] font-bold rounded-t-2xl'>
              {paymentsData?.data.totalItems || 0} Payments
            </h1>
          </div>
          <div className='border-t-[1px] border-gray-300 dark:border-gray-600' />
          <div className='p-5'>
            <div className='mb-5 flex justify-start items-center'>
              <div className='w-[250px] h-full'>
                <label className='text-[14px] text-black dark:text-white mb-2 block font-bold'>
                  Filter by Status
                </label>
                <Select
                  value={status}
                  onChange={(value) => onChangeStatus(value as string)}
                  className={`rounded h-[60px] w-[100%] flex items-center hover:border-[#c1cf16] ${
                    darkMode ? 'custom-select' : 'select-input'
                  }`}
                  options={statusOptions}
                  placeholder='Select status'
                >
                  {statusOptions.map((option, index) => (
                    <Select.Option key={index} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} className='mb-6'>
          <Col xs={24} sm={12} md={6}>
            <Card
              className={`text-center ${darkMode ? 'dark:bg-gray-800' : ''}`}
            >
              <div className='text-2xl font-bold text-green-600'>
                {formatAmount(summary.total, 'USD')}
              </div>
              <div className='text-gray-500 dark:text-gray-300 text-sm'>
                Total Paid
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              className={`text-center ${darkMode ? 'dark:bg-gray-800' : ''}`}
            >
              <div className='text-2xl font-bold text-blue-600'>
                {summary.totalPayments}
              </div>
              <div className='text-gray-500 dark:text-gray-300 text-sm'>
                Total Payments
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              className={`text-center ${darkMode ? 'dark:bg-gray-800' : ''}`}
            >
              <Badge count={summary.completed} showZero color='green'>
                <div className='text-2xl font-bold text-green-600'>
                  {summary.completed}
                </div>
              </Badge>
              <div className='text-gray-500 dark:text-gray-300 text-sm'>
                Completed
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              className={`text-center ${darkMode ? 'dark:bg-gray-800' : ''}`}
            >
              <Badge count={summary.pending} showZero color='orange'>
                <div className='text-2xl font-bold text-orange-600'>
                  {summary.pending}
                </div>
              </Badge>
              <div className='text-gray-500 dark:text-gray-300 text-sm'>
                Pending
              </div>
            </Card>
          </Col>
        </Row>

        {/* Payments Table */}
        <Card className={`shadow-sm ${darkMode ? 'dark:bg-gray-800' : ''}`}>
          <Table
            className={`data_table border-collapse w-full ${
              darkMode ? 'dark-table' : ''
            }`}
            dataSource={paymentsData?.data.items || []}
            rowKey='id'
            rowClassName='shadow'
            pagination={false}
            loading={isFetching}
            bordered={false}
            scroll={{ x: 0 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className='text-center'>
                      <Text className='text-gray-500 dark:text-gray-300'>
                        No payments found
                      </Text>
                      <div className='mt-2'>
                        <CustomButton
                          type='primary'
                          onClick={() => navigate('/subscription')}
                        >
                          Make Your First Payment
                        </CustomButton>
                      </div>
                    </div>
                  }
                />
              ),
            }}
          >
            <Column
              title='Payment ID'
              key='id'
              {...getColumnProps('Payment ID')}
              render={(record: PaymentRecord) => (
                <Text code className='text-xs dark:text-gray-100'>
                  {record.id.slice(0, 8)}...
                </Text>
              )}
            />
            <Column
              title='Amount'
              key='amount'
              {...getColumnProps('Amount')}
              render={(record: PaymentRecord) => (
                <Text
                  strong
                  className='text-lg font-bold text-blue-500 dark:text-gray-100'
                >
                  {formatAmount(record.amount, record.currency)}
                </Text>
              )}
            />
            <Column
              title='Status'
              key='status'
              {...getColumnProps('Status')}
              render={(record: PaymentRecord) => (
                <Tag
                  color={getStatusColor(record.status)}
                  icon={getStatusIcon(record.status)}
                  className='flex items-center gap-1 w-fit'
                >
                  {record.status.toUpperCase()}
                </Tag>
              )}
            />
            <Column
              title='Description'
              key='description'
              {...getColumnProps('Description')}
              render={(record: PaymentRecord) => (
                <Text className='text-gray-600 dark:text-gray-300'>
                  {record.description || 'No description'}
                </Text>
              )}
            />
            <Column
              title='Date'
              key='createdAt'
              {...getColumnProps('Date')}
              render={(record: PaymentRecord) => (
                <Text className='text-gray-500 dark:text-gray-100 font-bold'>
                  {formatDate(record.createdAt)}
                </Text>
              )}
            />
            <Column
              title='Actions'
              key='actions'
              {...getColumnProps('Actions')}
              render={(record: PaymentRecord) => (
                <Space>
                  <Tooltip title='View Details'>
                    <Button
                      type='text'
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetails(record)}
                    />
                  </Tooltip>
                  {record.status.toUpperCase() === 'PENDING' && (
                    <Tooltip title='Cancel Payment'>
                      <Button
                        type='text'
                        danger
                        icon={<CloseCircleOutlined />}
                        loading={isCancelling}
                        onClick={() => handleCancelPayment(record.id)}
                      />
                    </Tooltip>
                  )}
                </Space>
              )}
            />
          </Table>
          <Paginator
            total={paymentsData?.data.totalItems}
            setCurrentPage={setCurrentPage}
            totalPages={paymentsData?.data.totalPages}
            currentPage={currentPage}
            pageSize={size}
            isDarkMode={darkMode}
          />
        </Card>
      </div>

      {/* Payment Details Modal */}
      <CustomModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        title='Payment Details'
        width={700}
        footerContent={
          <CustomButton onClick={() => setIsModalVisible(false)}>
            Close
          </CustomButton>
        }
      >
        {selectedPayment && (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Text strong className='text-gray-600 dark:text-gray-300'>
                  Payment ID:
                </Text>
                <div>
                  <Text code className='dark:text-gray-100'>
                    {selectedPayment.id}
                  </Text>
                </div>
              </div>
              <div>
                <Text strong className='text-gray-600 dark:text-gray-300'>
                  Amount:
                </Text>
                <div>
                  <Text strong className='text-lg text-green-600'>
                    {formatAmount(
                      selectedPayment.amount,
                      selectedPayment.currency
                    )}
                  </Text>
                </div>
              </div>
              <div>
                <Text strong className='text-gray-600 dark:text-gray-300'>
                  Status:
                </Text>
                <div className='mt-1'>
                  <Tag
                    color={getStatusColor(selectedPayment.status)}
                    icon={getStatusIcon(selectedPayment.status)}
                  >
                    {selectedPayment.status.toUpperCase()}
                  </Tag>
                </div>
              </div>
              <div>
                <Text strong className='text-gray-600 dark:text-gray-300'>
                  Description:
                </Text>
                <div>
                  <Text className='dark:text-gray-100'>
                    {selectedPayment.description || 'No description provided'}
                  </Text>
                </div>
              </div>
              {selectedPayment.paypalOrderId && (
                <div>
                  <Text strong className='text-gray-600 dark:text-gray-300'>
                    PayPal Order ID:
                  </Text>
                  <div>
                    <Text code className='dark:text-gray-100'>
                      {selectedPayment.paypalOrderId}
                    </Text>
                  </div>
                </div>
              )}
              {selectedPayment.transactionId && (
                <div>
                  <Text strong className='text-gray-600 dark:text-gray-300'>
                    Transaction ID:
                  </Text>
                  <div>
                    <Text code className='dark:text-gray-100'>
                      {selectedPayment.transactionId}
                    </Text>
                  </div>
                </div>
              )}
              <div>
                <Text strong className='text-gray-600 dark:text-gray-300'>
                  Created:
                </Text>
                <div>
                  <Text className='dark:text-gray-100'>
                    {formatDate(selectedPayment.createdAt)}
                  </Text>
                </div>
              </div>
              <div>
                <Text strong className='text-gray-600 dark:text-gray-300'>
                  Last Updated:
                </Text>
                <div>
                  <Text className='dark:text-gray-100'>
                    {formatDate(selectedPayment.updatedAt)}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  )
}

export default PaymentHistory
