import { Button } from 'antd'
import { FC, MouseEventHandler, ReactNode } from 'react'

interface CustomButtonProps {
  disabled?: boolean
  icon?: ReactNode
  size?: 'large' | 'middle' | 'small'
  target?: string
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
  onClick?: MouseEventHandler<HTMLElement>
  children?: ReactNode
  htmlType?: 'button' | 'submit' | 'reset'
  className?: string
  loading?: boolean
  form?: string
}

const CustomButton: FC<CustomButtonProps> = ({
  disabled,
  icon,
  size,
  target,
  type,
  onClick,
  children,
  htmlType,
  className,
  loading,
  form,
}) => {
  const PrimaryButton: FC = () => {
    return (
      <Button
        className={`${className}   bg-blue-500 font-medium text-white rounded-[4px] hover:text-white `}
        disabled={disabled}
        icon={icon}
        size={size}
        target={target}
        type={type}
        onClick={onClick}
        htmlType={htmlType}
        loading={loading}
        form={form}
      >
        {children}
      </Button>
    )
  }

  return <PrimaryButton />
}

export default CustomButton
