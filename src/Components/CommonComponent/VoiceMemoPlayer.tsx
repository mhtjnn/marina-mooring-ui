import React from 'react'
import { PlayVoiceMemoProps } from '../../Type/ComponentBasedType'

const VoiceMemoPlayer: React.FC<PlayVoiceMemoProps> = ({ voiceMemo }) => {
  const audioSrc = `data:audio/aac;base64,${voiceMemo?.encodedData}`

  if (!voiceMemo?.encodedData) {
    return (
      <div className="text-center mt-10">
        <img src="/assets/images/empty.png" alt="Empty Data" className="w-20 mx-auto mb-2" />
        <p className="text-gray-500 text-lg">No Audio Available</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{voiceMemo?.name}</h2>
        <audio controls className="w-full">
          <source src={audioSrc} type="audio/aac" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
  )
}

export default VoiceMemoPlayer
