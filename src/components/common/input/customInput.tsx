import { Form, Input } from 'antd'
import { Rule } from 'antd/lib/form'
import { ChangeEvent, FC } from 'react'

interface CustomInputProps {
  label?: string
  placeholder?: string
  type?: 'normal' | 'file'
  inputType?: string
  value?: string | number | string[] | FileList | null
  name?: string
  isLoading?: boolean
  disabled?: boolean
  rules?: Rule[]
  styles?: string
  onChange?: (value: string | number | string[] | FileList | null) => void
}

const CustomInput: FC<CustomInputProps> = ({
  label = '',
  placeholder,
  type = 'normal',
  inputType,
  value,
  name,
  isLoading,
  disabled,
  rules,
  styles,
  onChange = () => null,
}) => {
  const NormalInput = (
    <div className='mb-[-10px]'>
      {label && (
        <label className='text-[18px] text-black font-[500] mb-2 block'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules}>
        <Input
          value={value as string}
          type={inputType}
          placeholder={placeholder || 'Type'}
          className={`rounded h-[60px] ${styles}`}
          disabled={(type === 'file' && isLoading) || disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(type === 'file' ? e?.target?.files : e?.target?.value)
          }
        />
      </Form.Item>
    </div>
  )

  return NormalInput
}

export default CustomInput
