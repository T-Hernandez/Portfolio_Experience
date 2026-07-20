import CameraAnchor from './CameraAnchor'

/**
 * Encuadres estimados visualmente a partir de
 * design/reference/initial-camera-angle.png. Aproximaciones para trabajar
 * sin room.glb — se reemplazan por los Empties Camera_* reales del modelo,
 * este archivo entero deja de usarse en ese momento.
 */
export default function PlaceholderCameraAnchors() {
  return (
    <>
      <CameraAnchor name="Camera_Default" position={[0.4, 1.55, 2.6]} lookAt={[0.1, 1.05, -2.5]} />
      <CameraAnchor name="Camera_Laptop" position={[-0.5, 1.2, -0.6]} lookAt={[-0.6, 1.05, -2.2]} />
      <CameraAnchor name="Camera_Bookshelf" position={[-1.9, 1.35, -0.9]} lookAt={[-2.6, 1.0, -2.5]} />
      <CameraAnchor name="Camera_Turntable" position={[0.75, 1.2, -0.7]} lookAt={[0.6, 1.0, -2.2]} />
      <CameraAnchor name="Camera_Plant" position={[2.35, 1.3, -0.9]} lookAt={[2.6, 0.9, -2.3]} />
    </>
  )
}
