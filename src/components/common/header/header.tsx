import { Drawer, Dropdown } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import { AiOutlineMoon } from 'react-icons/ai'
import { FaRegUser } from 'react-icons/fa'
import { GoSun } from 'react-icons/go'
import { IoIosLogOut } from 'react-icons/io'
import { MdKeyboardArrowDown, MdMenuOpen } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Logo from '../../../assets/1.jpg'
import { removeFromLocal } from '../../../helpers/handleStorage'
import { boxInterface } from '../../../lib/api/box/boxEndPoints'
import { AdditionalInfoInt } from '../../../lib/api/user/userEndPoints'
import { RootState } from '../../../lib/redux/store'
import { toggleDarkMode } from '../../../lib/redux/themeSlice'
import CustomImage from '../image/customImage'
import Sidebar from '../sidebar/sidebar'

interface props {
  data: AdditionalInfoInt | undefined
  additional?: boolean
  boxesData?: Array<boxInterface> | undefined
}

const NavBar: FC<props> = ({ data, additional, boxesData }): ReactElement => {
  const navigate = useNavigate()

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const toggleDrawer = () => {
    setDrawerVisible((prev) => !prev)
  }

  const handleLogout = (): void => {
    removeFromLocal('token')
    navigate('/')
  }

  const dispatch = useDispatch()
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    if (savedDarkMode !== darkMode) {
      dispatch(toggleDarkMode())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleToggle = () => {
    dispatch(toggleDarkMode())
  }

  const ProfileDropdown = (
    <div className='w-[100%] rounded shadow-md z-100 bg-white p-2 mt-6'>
      <p className='p-4 px-2 w-[100%] font-medium flex flex-row gap-2'>
        <span className='text-gray-400'>{data?.firstName}</span>
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
    <>
      <Drawer
        placement='left'
        onClose={toggleDrawer}
        closeIcon={false}
        open={drawerVisible}
        zIndex={900}
        width={'fit-content'}
        height={'100%'}
        styles={{ body: { padding: 0 } }}
        className='custom-drawer'
      >
        <section className=' h-[100%] w-[100%] overflow-y-auto scroll'>
          <Sidebar
            isDrawer={true}
            boxesData={boxesData}
            setDrawerVisible={setDrawerVisible}
          />
        </section>
      </Drawer>
      <nav
        className={`p-5 ${
          additional ? 'bg-[#1C2834] text-white' : 'bg-white text-black'
        }  flex   justify-between items-center border-b border-gray-300 dark:border-gray-600  dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        {additional ? (
          <div className='flex flex-row items-center gap-5'>
            <CustomImage src={Logo} width={28} className=' rounded-lg ' />
            <p>Welcome</p>
          </div>
        ) : (
          <>
            <MdMenuOpen
              size={25}
              className='text-[#C1CF16] cursor-pointer lg:hidden block'
              onClick={toggleDrawer}
            />
            <MdMenuOpen
              size={25}
              className='text-[#C1CF16] cursor-pointer lg:block hidden'
            />
          </>
        )}
        {darkMode ? (
          <GoSun
            size={25}
            color='gray'
            onClick={handleToggle}
            className='cursor-pointer'
          />
        ) : (
          <AiOutlineMoon
            size={25}
            color='gray'
            onClick={handleToggle}
            className='cursor-pointer'
          />
        )}
        <Dropdown overlay={ProfileDropdown} trigger={['click']}>
          <div className='flex items-center gap-2 lg:gap-4 cursor-pointer hover:bg-inherit hover:text-[#C1CF16]  p-2 px-2 rounded'>
            <FaRegUser />
            <div className='flex items-center gap-2'>
              <p className='hidden lg:block'>{data?.lastName}</p>
              <MdKeyboardArrowDown
                size={14}
                className='object-cover rounded-full'
              />
            </div>
          </div>
        </Dropdown>
      </nav>
    </>
  )
}

export default NavBar
