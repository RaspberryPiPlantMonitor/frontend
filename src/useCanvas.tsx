import { useRef, useEffect } from 'react'

const useCanvas = (draw: any) => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    draw(canvas)

  }, [draw])
  
  return canvasRef
}

export default useCanvas