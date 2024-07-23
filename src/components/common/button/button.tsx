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
  background?: string
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
  background,
}) => {
  const PrimaryButton: FC = () => {
    return (
      <Button
        className={`${className} ${
          background ? background : 'bg-[#C1CF16]'
        }   font-medium text-white rounded-[4px]  ${
          disabled ? ' hover:text-black' : 'hover:text-white'
        } custom-general-button`}
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
