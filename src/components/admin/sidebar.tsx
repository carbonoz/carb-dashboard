import { FC, ReactElement, cloneElement, useEffect } from 'react'
import { AiOutlineMoon } from 'react-icons/ai'
import { FaUsers } from 'react-icons/fa'
import { GoSun } from 'react-icons/go'
import { IoHomeOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, useNavigate } from 'react-router-dom'
import Logo from '../../assets/1.jpg'
import { removeFromLocal } from '../../helpers/handleStorage'
import { RootState } from '../../lib/redux/store'
import { toggleDarkMode } from '../../lib/redux/themeSlice'
import CustomImage from '../common/image/customImage'

interface SidebarItemProps {
  icon: ReactElement
  text: string
  url: string
  isLogout?: boolean
  setDrawerVisible?: (value: boolean) => void
}

interface SideBarProps {
  isDrawer?: boolean
  setDrawerVisible?: (value: boolean) => void
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  url,
  isLogout,
  setDrawerVisible,
}): ReactElement => {
  const navigate = useNavigate()
  const isMatch = useMatch(url)

  const handleClick = (): void => {
    if (isLogout) {
      removeFromLocal('token')
    }
    setDrawerVisible && setDrawerVisible(false)
    navigate(url)
  }

  return (
    <div
      className={`flex flex-row gap-5 items-center mb-5 ${
        isMatch ? '' : ''
      } cursor-pointer p-3 rounded-lg w-full`}
      onClick={handleClick}
    >
      {cloneElement(icon, {
        color: isMatch || isLogout ? '#C1CF16' : 'white',
      })}
      <p
        className={`${isMatch ? ' font-bold ' : ' font-medium'} ${
          isLogout ? 'text-[#C1CF16]' : 'text-white'
        }  text-base`}
      >
        {text}
      </p>
    </div>
  )
}

const AdminSidebar: FC<SideBarProps> = ({
  isDrawer,
  setDrawerVisible,
}): ReactElement => {
  const navigate = useNavigate()

  function goToDashboard() {
    navigate('/admin/')
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

  return (
    <section
      className={`lg:w-[300px] 2xl:w-[300px] ${
        isDrawer ? 'flex w-[300x]' : 'hidden'
      }     h-[100%] lg:flex flex-col py-4 px-5 bg-[#1C2834] border-r border-gray-100 dark:border-gray-600 relative`}
    >
      <div
        className='flex flex-row items-center gap-5 mb-8 cursor-pointer'
        onClick={goToDashboard}
      >
        <CustomImage src={Logo} width={50} className=' rounded-lg ' />
        <h1 className='text-2xl  text-[#C1CF16] font-bold'>CARBONOZ</h1>
      </div>
      <div className='mt-0 w-full'>
        <>
          <SidebarItem
            icon={<IoHomeOutline size={30} />}
            text='Dashboard'
            url='/admin/'
            setDrawerVisible={setDrawerVisible}
          />
          <SidebarItem
            icon={<FaUsers size={30} />}
            text='Users'
            url='/admin/users'
            setDrawerVisible={setDrawerVisible}
          />
        </>
      </div>
      <div className='absolute bottom-8'>
        <div className='flex  flex-row items-center gap-5  text-white'>
          {darkMode ? (
            <GoSun
              size={30}
              color='gray'
              onClick={handleToggle}
              className='cursor-pointer'
            />
          ) : (
            <AiOutlineMoon
              size={30}
              color='gray'
              onClick={handleToggle}
              className='cursor-pointer'
            />
          )}
          <div>Dark mode</div>
        </div>
      </div>
    </section>
  )
}

export default AdminSidebar
