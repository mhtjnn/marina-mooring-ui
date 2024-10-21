import { Dialog } from 'primereact/dialog'
import React, { useState } from 'react'
import { PlayVoiceMemoProps } from '../../Type/ComponentBasedType'

const VoiceMemoPlayer: React.FC<PlayVoiceMemoProps> = ({
  imageVisible,
  setImageVisible,
  voiceMemo,
}) => {
  const audioSrc = `data:audio/aac;base64,${voiceMemo?.encodedData}`

  return (
    <div className="flex items-center justify-center h-20 mt-20">
      <div className="text-center">
        <h2 className="mb-4">{voiceMemo?.name}</h2>
        <audio controls>
          <source src={audioSrc} type="audio/aac" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  )
}

export default VoiceMemoPlayer
