import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'
import handleAPIRequests from '../../../../helpers/handleApiRequest'
import {
  useRedexInfosQuery,
  useSendToRedexMutation,
} from '../../../../lib/api/admin/adminEndpoints'
import { RootState } from '../../../../lib/redux/store'
import CustomButton from '../../../common/button/button'
import Paginator from '../../../common/paginator/paginator'
import RedexTable from '../../../tables/redex.table'

const AdminRedexInformation = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const isMatch = useMatch('/admin/*')
  const [status, setStatus] = useState<string>('false')
  const size = 10
  const [currentPage, setCurrentPage] = useState<number>(0)

  const { data, isFetching, refetch } = useRedexInfosQuery({
    status,
    page: currentPage.toString(),
    size: size.toString(),
  })
  const [sendData, { isLoading }] = useSendToRedexMutation()

  const options = [
    { value: 'true', label: 'Registered devices' },
    { value: 'false', label: 'Non Registered devices' },
  ]

  const onChangeStatus = (status: string) => {
    setStatus(status)
    setCurrentPage(0)
  }

  const onFinish = () => {
    handleAPIRequests({
      request: sendData,
      ...{},
      notify: true,
      message: 'Data sent successfully',
    })
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className='w-[100%]'>
      <h1 className=' text-xl mb-5 text-[#C1CF16] font-bold'>
        List of Redex requests
      </h1>
      <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
        <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
          <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
            {data?.data.items.length} Redex requests
          </h1>
        </div>
        <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
        <div className='p-5'>
          <div className='mb-5 flex sm:justify-between sm:items-center flex-col sm:flex-row'>
            <div className='w-[30%] h-full'>
              <label
                className={`text-[14px] text-black dark:text-white  mb-2 block font-bold ${
                  isMatch ? ' ' : ''
                } `}
              >
                Filter by status
              </label>

              <Select
                value={status}
                onChange={(value) => onChangeStatus(value)}
                className={`rounded h-[60px] sm:w-[85%] w-[100%]  flex items-center hover:border-[#c1cf16] ${
                  darkMode && isMatch ? 'custom-select' : 'select-input'
                } `}
                options={options}
                defaultValue={'false'}
              >
                {options.map((option, index) => (
                  <Select.Option key={index} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <CustomButton
              type='primary'
              htmlType='button'
              icon={<IoSend />}
              className='h-[60px] mt-6'
              onClick={onFinish}
              loading={isLoading}
            >
              Send Data to Redex
            </CustomButton>
          </div>
          <RedexTable data={data?.data.items} isFetching={isFetching} />
          <Paginator
            total={data?.data.totalItems}
            setCurrentPage={setCurrentPage}
            totalPages={data?.data.totalPages}
            currentPage={currentPage}
            pageSize={size}
            isDarkMode={darkMode}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminRedexInformation
