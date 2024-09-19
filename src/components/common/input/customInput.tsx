import { Form, Input, Radio, Select, Space } from 'antd'
import { Rule } from 'antd/lib/form'
import { ChangeEvent, FC, ReactNode } from 'react'

interface CustomInputProps {
  label?: string
  placeholder?: string
  type?: 'normal' | 'file' | 'select-multiple' | 'select' | 'radio' | 'textarea'
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
  customlabel?: ReactNode
}

const CustomInput: FC<CustomInputProps> = ({
  label = '',
  customlabel,
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
      {label && !customlabel && (
        <label className='text-[14px] text-black  mb-2 block font-bold'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules} label={customlabel}>
        <Input
          value={value as string}
          type={inputType}
          placeholder={placeholder || 'Type'}
          className={`rounded h-[60px] ${styles} hover:border-[#c1cf16]`}
          disabled={(inputType === 'file' && isLoading) || disabled}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(inputType === 'file' ? e?.target?.files : e?.target?.value)
          }
        />
      </Form.Item>
    </div>
  )

  const TextAreaInput = (
    <div className='mb-[-10px]'>
      {label && !customlabel && (
        <label className='text-[14px] text-black  mb-2 block font-bold'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules} label={customlabel}>
        <Input.TextArea
          value={value as string}
          placeholder={placeholder || 'Enter text'}
          className={`rounded ${styles} hover:border-[#c1cf16]`}
          disabled={disabled}
          rows={6}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(e?.target?.value)
          }
        />
      </Form.Item>
    </div>
  )

  const SelectMultipleInput = (
    <div className='mb-[-10px]'>
      {label && !customlabel && (
        <label className='text-[14px] text-black  mb-2 block font-bold'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules} label={customlabel}>
        <Select
          className={`rounded h-[60px] ${styles} hover:border-[#c1cf16]`}
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
      {label && !customlabel && (
        <label className='text-[14px] text-black  mb-2 block font-bold'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules} label={customlabel}>
        <Select
          value={value as string | number}
          onChange={(value) => onChange(value as string | number)}
          className='rounded h-[60px]  flex items-center hover:border-[#c1cf16]'
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

  const RadioInput = (
    <div className='mb-[-10px]'>
      {label && !customlabel && (
        <label className='text-[14px] text-black  mb-2 block font-bold'>
          {label}
        </label>
      )}

      <Form.Item name={name} rules={rules} label={customlabel}>
        <Radio.Group
          onChange={(e) => onChange(e.target.value)}
          value={value as string}
          className={` ${styles}`}
        >
          <Space direction='vertical' className='mt-5'>
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>
    </div>
  )

  switch (type) {
    case 'select-multiple':
      return SelectMultipleInput
    case 'select':
      return SelectInput
    case 'radio':
      return RadioInput
    case 'textarea':
      return TextAreaInput
    default:
      return NormalInput
  }
}

export default CustomInput
