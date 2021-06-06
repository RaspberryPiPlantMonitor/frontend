import useCanvas from './useCanvas'

const Canvas = (props: { [x: string]: any; draw: any }) => {  
  
  const { draw, ...rest } = props
  const canvasRef = useCanvas(draw)
  
  return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas