import React, { createContext, useState, ReactNode } from 'react'

interface FormDataContextType {
  formData: string
  setFormData: React.Dispatch<React.SetStateAction<string>>
}

const defaultContextValue: FormDataContextType = {
  formData: '',
  setFormData: () => {},
}

export const FormDataContext = createContext<FormDataContextType>(defaultContextValue)

export const FormDataProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState('')

  const value = {
    formData,
    setFormData,
  }

  return <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>
}
