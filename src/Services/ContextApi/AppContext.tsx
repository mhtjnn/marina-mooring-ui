import React, { createContext, useState, ReactNode } from 'react'

interface AppContextType {
  isMapModalOpen: {
    someValue: string
    editMode: boolean
  }
  setMapModalOpen: React.Dispatch<React.SetStateAction<{ someValue: string; editMode: boolean }>>
  IsdialogVisible: boolean
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
  isUploadImageDialogVisible: boolean
  setUploadImageDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultContextValue: AppContextType = {
  isMapModalOpen: { someValue: '', editMode: false },
  setMapModalOpen: () => {},
  IsdialogVisible: false,
  setDialogVisible: () => {},
  isUploadImageDialogVisible: false,
  setUploadImageDialogVisible: () => {},
}

export const AppContext = createContext<AppContextType>(defaultContextValue)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isMapModalOpen, setMapModalOpen] = useState({ someValue: '', editMode: false })
  const [IsdialogVisible, setDialogVisible] = useState(false)
  const [isUploadImageDialogVisible, setUploadImageDialogVisible] = useState(false)

  const value = {
    isMapModalOpen,
    setMapModalOpen,
    IsdialogVisible,
    setDialogVisible,
    isUploadImageDialogVisible,
    setUploadImageDialogVisible,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
