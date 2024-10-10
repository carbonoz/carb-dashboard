import { FC, ReactElement, cloneElement } from 'react'
import { CiSettings } from 'react-icons/ci'
import { FaChartPie } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { IoHomeOutline } from 'react-icons/io5'
import { MdDeviceHub } from 'react-icons/md'
import { useMatch, useNavigate } from 'react-router-dom'
import Logo from '../../../assets/1.jpg'
import { boxInterface } from '../../../lib/api/box/boxEndPoints'
import CustomImage from '../image/customImage'

interface SidebarItemProps {
  icon: ReactElement
  text: string
  url: string
}

interface SideBarProps {
  boxesData?: Array<boxInterface> | undefined
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  url,
}): ReactElement => {
  const navigate = useNavigate()
  const isMatch = useMatch(url)

  const handleClick = (): void => {
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
        color: isMatch ? '#C1CF16' : 'white',
      })}
      <p
        className={`${
          isMatch ? ' font-bold ' : ' font-medium'
        } text-white text-base`}
      >
        {text}
      </p>
    </div>
  )
}

const Sidebar: FC<SideBarProps> = ({ boxesData }): ReactElement => {
  return (
    <section className='w-[300px] h-[100%] flex flex-col py-4 px-5 bg-[#1C2834] border-r border-gray-100'>
      <div className='flex flex-row items-center gap-5 mb-8'>
        <CustomImage src={Logo} width={50} className=' rounded-lg ' />
        <h1 className='text-2xl  text-[#C1CF16]'>CARBONOZ</h1>
      </div>
      <div className='mt-0 w-full'>
        {!boxesData || boxesData.length === 0 ? (
          <>
            <SidebarItem
              icon={<MdDeviceHub size={30} />}
              text='Configurations'
              url='/ds/devices'
            />
          </>
        ) : (
          <>
            <SidebarItem
              icon={<IoHomeOutline size={30} />}
              text='Dashboard'
              url='/ds/'
            />
            <SidebarItem
              icon={<FiUser size={30} />}
              text='Profile'
              url='/ds/profile'
            />
            <SidebarItem
              icon={<CiSettings size={30} />}
              text='Settings'
              url='/ds/settings'
            />
            <SidebarItem
              icon={<FaChartPie size={30} />}
              text='Charts'
              url='/ds/charts'
            />
          </>
        )}
      </div>
    </section>
  )
}

export default Sidebar
