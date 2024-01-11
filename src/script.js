// He visto los tutoriales de Bruno Simon y estoy usando su repositorio: https://github.com/brunosimon/my-room-in-3d 
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


// Materials
const bakedTexture = textureLoader.load('/baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({ 
    map: bakedTexture,
    side: THREE.DoubleSide
})


//Loader
gltfLoader.load(
    '/model.glb',
    (gltf) => {
        gltf.scene.traverse( child => {
            child.material = bakedMaterial 
        })
        scene.add(gltf.scene)
        
    }
)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Base camera
const camera = new THREE.PerspectiveCamera(15, sizes.width / sizes.height, 0.1, 500)

camera.position.x = 8
camera.position.y = 4   
camera.position.z = 15
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = true
controls.minDistance = 10
controls.maxDistance = 50
controls.minPolarAngle = Math.PI / 5
controls.maxPolarAngle = Math.PI / 2

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

//Animation
const tick = () =>
{
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()