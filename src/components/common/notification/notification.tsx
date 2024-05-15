import { notification } from 'antd'
import { FC } from 'react'

interface NotifyProps {
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  description?: string
  message?: string
  type?: 'success' | 'info' | 'warning' | 'error'
}

const Notify: FC<NotifyProps> = ({
  placement = 'topRight',
  description,
  message = 'Notification',
  type = 'success',
}) => {
  notification.destroy()

  notification[type]({
    message,
    description,
    placement,
  })

  return null
}

export default Notify
