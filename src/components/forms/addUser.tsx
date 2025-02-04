import { Form, FormInstance } from 'antd'
import { FC } from 'react'
import CustomInput from '../common/input/customInput'

interface CustomInputProps {
  email: string
}

interface AddNewUserFormProps {
  form: FormInstance
  onFinish: (values: CustomInputProps) => void
}

const AddNewUserForm: FC<AddNewUserFormProps> = ({ form, onFinish }) => {
  return (
    <div className='w-[100%]'>
      <Form
        className=' w-[100%]'
        name='add-user-form'
        form={form}
        onFinish={onFinish}
        layout='vertical'
      >
        <CustomInput
          placeholder='Email'
          label='User email'
          name='email'
          type='normal'
          inputType='text'
        />
      </Form>
    </div>
  )
}

export default AddNewUserForm
