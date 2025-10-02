'use client'

import React from 'react'

const CloudBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, #FFFFFF, #6DD5FA, #2980B9)'
      }}></div>
      
    </div>
  )
}

export default CloudBackground
