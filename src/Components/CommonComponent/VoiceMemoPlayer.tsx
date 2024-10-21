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
    <div>
      <h2>{voiceMemo?.name}</h2>
      <h2>{voiceMemo?.name}</h2>
      <audio controls>
        <source src={audioSrc} type="audio/aac" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  )
}

export default VoiceMemoPlayer
