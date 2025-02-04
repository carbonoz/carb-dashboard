import { Pagination } from 'antd'
import { FC, ReactElement } from 'react'

interface PaginatorProps {
  total?: number
  setCurrentPage?: (page: number) => void
  pageSize?: number
  totalPages?: number
  currentPage: number
  isDarkMode?: boolean
}

const Paginator: FC<PaginatorProps> = ({
  total = 0,
  setCurrentPage = () => null,
  pageSize = 10,
  totalPages,
  currentPage,
  isDarkMode = false,
}): ReactElement | null => {
  const onChange = (page: number) => {
    setCurrentPage(page - 1)
  }

  if ((totalPages ?? 0) <= 1) {
    return null
  }

  return (
    <div className='grid justify-end mt-8 w-full mb-5'>
      <div
        className={`
        ${isDarkMode ? 'dark-pagination' : 'light-pagination'}
        [&_.ant-pagination-item]:border
        [&_.ant-pagination-item]:rounded
        [&_.ant-pagination-item]:transition-colors
        [&_.ant-pagination-item]:duration-200
        [&_.ant-pagination-prev]:transition-colors
        [&_.ant-pagination-next]:transition-colors
        [&_.ant-pagination-item-active]:font-medium
        
        ${
          isDarkMode
            ? `
          [&_.ant-pagination-item]:border-gray-700
          [&_.ant-pagination-item]:bg-gray-800
          [&_.ant-pagination-item_a]:text-white
          [&_.ant-pagination-item:hover]:border-gray-400
          [&_.ant-pagination-item:hover_a]:text-white
          [&_.ant-pagination-item:hover]:bg-gray-700
          [&_.ant-pagination-item-active]:border-white
          [&_.ant-pagination-item-active_a]:text-white
          [&_.ant-pagination-item-active]:bg-gray-700
          [&_.ant-pagination-prev_button]:text-white
          [&_.ant-pagination-next_button]:text-white
          [&_.ant-pagination-prev:hover_button]:text-gray-300
          [&_.ant-pagination-next:hover_button]:text-gray-300
          [&_.ant-pagination-disabled_button]:text-gray-600
          [&_.ant-pagination-disabled:hover_button]:text-gray-600
        `
            : `
          [&_.ant-pagination-item]:border-gray-200
          [&_.ant-pagination-item]:bg-white
          [&_.ant-pagination-item_a]:text-gray-700
          [&_.ant-pagination-item:hover]:border-blue-500
          [&_.ant-pagination-item:hover_a]:text-blue-600
          [&_.ant-pagination-item-active]:border-blue-500
          [&_.ant-pagination-item-active_a]:text-blue-600
          [&_.ant-pagination-item-active]:bg-blue-50
          [&_.ant-pagination-prev_button]:text-gray-500
          [&_.ant-pagination-next_button]:text-gray-500
          [&_.ant-pagination-prev:hover_button]:text-blue-600
          [&_.ant-pagination-next:hover_button]:text-blue-600
        `
        }
      `}
      >
        <Pagination
          onChange={onChange}
          showSizeChanger={false}
          defaultCurrent={1}
          current={totalPages ? currentPage + 1 : 1}
          total={total}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}

export default Paginator
