import { FC, useEffect, useState } from 'react'
import { useLogsQuery } from '../../../../lib/api/admin/adminEndpoints'
import Paginator from '../../../common/paginator/paginator'
import LogsTable from '../../../tables/logs.table'
import { RootState } from '../../../../lib/redux/store'
import { useSelector } from 'react-redux'

const Logs: FC = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  const [currentPage, setCurrentPage] = useState<number>(0)
  const size = 10
  const { data, isFetching, refetch } = useLogsQuery({
    page: currentPage.toString(),
    size: size.toString(),
  })
  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <div>
      <h1 className=' text-xl mb-5 text-[#C1CF16] font-bold'>Logs list</h1>
      <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
        <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
          <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
            {data?.data.totalItems} Logs
          </h1>
        </div>
        <LogsTable data={data?.data.items} isFetching={isFetching} />
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
  )
}

export default Logs
