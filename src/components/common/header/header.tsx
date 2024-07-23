import { Dropdown } from 'antd'
import { FC, ReactElement } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { GiWindTurbine } from 'react-icons/gi'
import { IoIosLogOut } from 'react-icons/io'
import { MdKeyboardArrowDown, MdMenuOpen } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { removeFromLocal } from '../../../helpers/handleStorage'
import { AdditionalInfoInt } from '../../../lib/api/user/userEndPoints'

interface props {
  data: AdditionalInfoInt | undefined
  additional?: boolean
}

const NavBar: FC<props> = ({ data, additional }): ReactElement => {
  const navigate = useNavigate()

  const handleLogout = (): void => {
    removeFromLocal('token')
    navigate('/')
  }

  const ProfileDropdown = (
    <div className='w-[100%] rounded shadow-md z-100 bg-white p-2 mt-6'>
      <p className='p-4 px-2 w-[100%] font-medium flex flex-row gap-2'>
        <span className='text-gray-400'>{data?.names}</span>
      </p>

      <div
        className='flex items-center gap-2 w-[100%] rounded p-2 bg-[#C1CF16] font-[600] cursor-pointer   hover:bg-gray-200'
        onClick={handleLogout}
      >
        <IoIosLogOut size={20} className='text-black' />
        <p className='flex-1 text-black'>Logout</p>
      </div>
    </div>
  )

  return (
    <nav
      className={`p-5 ${
        additional ? 'bg-[#1C2834] text-white' : 'bg-white text-black'
      }  flex   justify-between items-center border-b border-gray-300`}
    >
      {additional ? (
        <div className='flex flex-row items-center gap-5'>
          <GiWindTurbine size={28} className='text-[#C1CF16] font-bold' />
          <p>Welcome</p>
        </div>
      ) : (
        <MdMenuOpen size={25} className='text-[#C1CF16]' />
      )}
      <Dropdown overlay={ProfileDropdown} trigger={['click']}>
        <div className='flex items-center gap-2 lg:gap-4 cursor-pointer hover:bg-inherit hover:text-[#C1CF16]  p-2 px-2 rounded'>
          <FaRegUser />
          <div className='flex items-center gap-2'>
            <p className='hidden lg:block'>{data?.names}</p>
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
