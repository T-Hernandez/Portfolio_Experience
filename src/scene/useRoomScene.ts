import { useGLTF } from '@react-three/drei'

const ROOM_PATH = '/models/room.glb'

/**
 * useGLTF cachea por URL, así que llamarlo desde Room/CameraRig/InterfaceLayer
 * no dispara tres cargas — todos comparten la misma escena ya parseada. No
 * hace falta un provider/contexto solo para compartir esta referencia.
 */
export function useRoomScene() {
  return useGLTF(ROOM_PATH).scene
}

useGLTF.preload(ROOM_PATH)
