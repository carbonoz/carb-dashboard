import { Dropdown } from 'antd'
import { FC, ReactElement } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { IoIosLogOut } from 'react-icons/io'
import { MdKeyboardArrowDown, MdMenuOpen } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { removeFromLocal } from '../../../helpers/handleStorage'

const NavBar: FC = (): ReactElement => {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    removeFromLocal('token')
    navigate('/')
  }

  const ProfileDropdown = (
    <div className='w-[100%] rounded shadow-md z-100 bg-white p-2 mt-6'>
      <p className='p-4 px-2 w-[100%] font-medium flex flex-row gap-2'>
        <p>Akashi</p>
        <span className='text-gray-400'>USER</span>
      </p>

      <div className='flex items-center gap-2 w-[100%] rounded p-2 bg-gray-100 font-[600] cursor-pointer   hover:bg-gray-200'>
        <IoIosLogOut size={20} className='text-[#31b0d5]' />

        <p className='flex-1 text-[#31b0d5]' onClick={handleLogout}>
          Logout
        </p>
      </div>
    </div>
  )

  return (
    <nav className='p-5  bg-[#31b0d5] flex  text-white justify-between items-center border-b border-gray-100'>
      <MdMenuOpen size={25} />
      <Dropdown overlay={ProfileDropdown} trigger={['click']}>
        <div className='flex items-center gap-2 lg:gap-4 cursor-pointer hover:bg-gray-200 hover:text-[#31b0d5]  p-2 px-2 rounded'>
          <FaRegUser />

          <div className='flex items-center gap-2'>
            <p className='hidden lg:block'>chris</p>
            <MdKeyboardArrowDown
              size={14}
              className='object-cover rounded-full'
            />
          </div>
        </div>
      </Dropdown>
    </nav>
  )
}

export default NavBar
