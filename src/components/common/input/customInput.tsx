import { Form, Input, Select } from 'antd'
import { Rule } from 'antd/lib/form'
import { ChangeEvent, FC } from 'react'

interface CustomInputProps {
  label?: string
  placeholder?: string
  type?: 'normal' | 'file' | 'select-multiple' | 'select'
  inputType?: string
  value?: string | number | string[] | FileList | null
  name?: string
  isLoading?: boolean
  disabled?: boolean
  rules?: Rule[]
  styles?: string
  onChange?: (value: string | number | string[] | FileList | null) => void
  options?: Array<{ label: string; value: string | number }>
  defaultValue?: Array<string | number | (string | number)>
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
  options = [],
  defaultValue = [],
}) => {
  const NormalInput = (
    <div className='mb-[-10px]'>
      {label && (
        <label className='text-[14px] text-black  mb-2 block font-bold'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules}>
        <Input
          value={value as string}
          type={inputType}
          placeholder={placeholder || 'Type'}
          className={`rounded h-[60px] ${styles} hover:border-[#c1cf16]`}
          disabled={(type === 'file' && isLoading) || disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(type === 'file' ? e?.target?.files : e?.target?.value)
          }
        />
      </Form.Item>
    </div>
  )

  const SelectMultipleInput = (
    <div className='mb-[-10px]'>
      {label && (
        <label className='text-[18px] text-black font-[500] mb-2 block'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules}>
        <Select
          className={`rounded h-[60px] ${styles}`}
          mode='multiple'
          size='large'
          loading={isLoading}
          disabled={disabled}
          placeholder={placeholder || 'Please select'}
          defaultValue={defaultValue as (string | number)[]}
          onChange={(value) => onChange(value as string[])}
          style={{
            width: '100%',
          }}
          options={options}
        />
      </Form.Item>
    </div>
  )

  const SelectInput = (
    <div className='mb-[-10px]'>
      {label && (
        <label className='text-[18px] text-black font-[500] mb-2 block'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules}>
        <Select
          value={value as string | number}
          onChange={(value) => onChange(value as string | number)}
          className='rounded h-[60px] border border-gray-300 flex items-center'
          loading={isLoading}
          disabled={disabled}
          options={options}
        >
          {options.map((option, index) => (
            <Select.Option key={index} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </div>
  )

  switch (type) {
    case 'select-multiple':
      return SelectMultipleInput
    case 'select':
      return SelectInput
    default:
      return NormalInput
  }
}

export default CustomInput
