import { FC, ReactElement, cloneElement } from 'react'
import { CiSettings } from 'react-icons/ci'
import { FiUser } from 'react-icons/fi'
import { GiWindTurbine } from 'react-icons/gi'
import { IoHomeOutline } from 'react-icons/io5'
import { useMatch, useNavigate } from 'react-router-dom'

interface SidebarItemProps {
  icon: ReactElement
  text: string
  url: string
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

const Sidebar: FC = (): ReactElement => {
  return (
    <section className='w-[300px] h-[100%] flex flex-col py-4 px-5 bg-[#1C2834] border-r border-gray-100'>
      <div className='flex flex-row items-center gap-5 mb-8'>
        <GiWindTurbine size={50} className='text-[#C1CF16]' />
        <h1 className='text-2xl  text-[#C1CF16]'>CARBONOZ</h1>
      </div>

      <div className='mt-0 w-full'>
        <SidebarItem
          icon={<IoHomeOutline size={30} />}
          text='Dashboard'
          url='/ds/'
        />
        <SidebarItem
          icon={<CiSettings size={30} />}
          text='Settings'
          url='/ds/settings'
        />
        <SidebarItem
          icon={<FiUser size={30} />}
          text='Profile'
          url='/ds/profile'
        />
      </div>
    </section>
  )
}

export default Sidebar
