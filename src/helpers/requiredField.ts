interface ValidationRule {
  required: boolean
  message: string
}

const requiredField = (message: string): ValidationRule[] => [
  { required: true, message: `${message} is required` },
]

export default requiredField
