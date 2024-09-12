import { useState } from 'react'
import { useUploadFormMutation } from '../MoorServe/MoorserveApi'
import { FormsResponse } from '../../Type/ApiTypes'

const useSubmit = () => {
  const [error, setError] = useState<any>(undefined)
  const [response, setResponse] = useState<FormsResponse>()
  const [uploadForms] = useUploadFormMutation()

  const handleSubmit = async (formData: FormData) => {
    setError(undefined)

    try {
      const response = await uploadForms(formData).unwrap()
      setResponse(response as FormsResponse)
    } catch (error) {
      setError(error)
    }
  }

  return { error, response, handleSubmit }
}

export default useSubmit
