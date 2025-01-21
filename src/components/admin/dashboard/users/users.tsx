import { Form, Select } from 'antd'
import { FC, useState } from 'react'
import { MdAirplanemodeInactive } from 'react-icons/md'
import { TiUserAdd } from 'react-icons/ti'
import { useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'
import { EUserStatus } from '../../../../config/constant'
import handleAPIRequests from '../../../../helpers/handleApiRequest'
import { useWindowSize } from '../../../../helpers/interfaceSize'
import {
  AccountUser,
  toogleAccountDto,
  useGetAllUsersQuery,
  useToogleActivationMutation,
} from '../../../../lib/api/admin/adminEndpoints'
import { RootState } from '../../../../lib/redux/store'
import CustomButton from '../../../common/button/button'
import CustomModal from '../../../common/modal/customModal'
import Paginator from '../../../common/paginator/paginator'
import ToogleActivationForm from '../../../forms/toogleActivation'
import UsersTable from '../../../tables/usersTable'

interface FormPropsValues {
  status: string
}

const Users: FC = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const isMatch = useMatch('/admin/*')

  const [form] = Form.useForm()

  const [toogle, { isLoading }] = useToogleActivationMutation()

  const [currentPage, setCurrentPage] = useState<number>(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<AccountUser[]>([])
  const [open, setOpen] = useState<boolean>(false)

  const [status, setStatus] = useState<EUserStatus>(EUserStatus.ENABLED)

  const size = 10

  const { data, isFetching } = useGetAllUsersQuery({
    status,
    page: currentPage.toString(),
    size: size.toString(),
  })

  const onChangeStatus = (status: EUserStatus) => {
    setStatus(status)
    setCurrentPage(0)
  }

  const options = [
    { value: EUserStatus.ENABLED, label: 'Enabled' },
    { value: EUserStatus.DISABLED, label: 'Disabled' },
  ]

  const handleRowSelection = (
    selectedKeys: React.Key[],
    selectedRows: AccountUser[]
  ) => {
    setSelectedRowKeys(selectedKeys)
    setSelectedRows(selectedRows)
  }

  const resetTableSelection = () => {
    setSelectedRowKeys([])
    setSelectedRows([])
  }

  const handleCancel = () => {
    resetTableSelection()
    setOpen(false)
    form.resetFields()
  }

  const onFinish = (values: FormPropsValues) => {
    const userIds: Array<string> = selectedRows.map((row) => row.id)
    const data: toogleAccountDto = {
      status: values.status,
      userIds,
    }
    handleAPIRequests({
      request: toogle,
      ...data,
      notify: true,
      message: `${selectedRowKeys.length} ${
        selectedRowKeys.length === 1
          ? 'account'
          : selectedRowKeys.length > 1
          ? 'accounts'
          : null
      } status changed successfully `,
      onSuccess: handleCancel,
    })
  }

  const { width } = useWindowSize()

  return (
    <>
      <CustomModal
        isVisible={open}
        setIsVisible={setOpen}
        title={`Account modification`}
        width={width <= 500 ? 500 : 1000}
        handleCancel={handleCancel}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='toogle-status'
            className='h-[50px] w-[100px]'
            loading={isLoading}
          >
            Save
          </CustomButton>
        }
      >
        <h2 className=' font-semibold mb-10'>
          <span>Activate or Deactivate </span>
          <span className='pl-2'>{selectedRowKeys.length}</span>
          <span className='pl-2'>
            {selectedRowKeys.length === 1
              ? 'account'
              : selectedRowKeys.length > 1
              ? 'accounts'
              : null}
          </span>
          <span className='pl-2'>selected</span>
        </h2>
        <ToogleActivationForm onFinish={onFinish} form={form} />
      </CustomModal>
      <div className='w-[100%]'>
        <h1 className=' text-xl mb-5 text-[#C1CF16] font-bold'>
          List of users
        </h1>
        <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
          <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
            <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
              {data?.data.items.length} Users
            </h1>
            <CustomButton type='primary' htmlType='button' icon={<TiUserAdd />}>
              Add User
            </CustomButton>
          </div>
          <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
          <div className='p-5'>
            <div className='mb-5 flex sm:justify-between sm:items-center flex-col sm:flex-row'>
              <div className='w-[100%]'>
                <label
                  className={`text-[14px] text-black dark:text-white  mb-2 block font-bold ${
                    isMatch ? ' ' : ''
                  } `}
                >
                  Filter status
                </label>

                <Select
                  value={status}
                  onChange={(value) => onChangeStatus(value as EUserStatus)}
                  className={`rounded h-[60px] sm:w-[35%] w-[100%]  flex items-center hover:border-[#c1cf16] ${
                    darkMode && isMatch ? 'custom-select' : 'select-input'
                  } `}
                  options={options}
                  defaultValue={'active'}
                >
                  {options.map((option, index) => (
                    <Select.Option key={index} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              {selectedRowKeys.length > 0 && (
                <CustomButton
                  type='primary'
                  htmlType='button'
                  icon={<MdAirplanemodeInactive />}
                  className='h-[60px]'
                  onClick={() => setOpen(true)}
                >
                  Deactivate or Activate
                  <span className='pl-2'>
                    {selectedRowKeys.length === 1
                      ? 'account'
                      : selectedRowKeys.length > 1
                      ? 'accounts'
                      : null}
                  </span>
                </CustomButton>
              )}
            </div>
            <UsersTable
              data={data?.data.items}
              isFetching={isFetching}
              rowSelectionEnabled={true}
              onRowSelectionChange={handleRowSelection}
              selectedRowKeys={selectedRowKeys}
              key={selectedRowKeys.length}
            />
            <Paginator
              total={data?.data.totalItems}
              setCurrentPage={setCurrentPage}
              totalPages={data?.data.totalPages}
              currentPage={currentPage}
              pageSize={size}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Users
