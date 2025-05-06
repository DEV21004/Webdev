// Smooth Scrolling for Navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Enhanced Parallax Effect for Other Sections
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section:not(#view360):not(#engine270)');
    sections.forEach(section => {
      const bg = section.querySelector('.parallax-bg');
      const fg = section.querySelector('.parallax-fg');
      if (bg && fg) {
        const offset = section.getBoundingClientRect().top;
        bg.style.transform = `translateY(${offset * 0.4}px)`;
        fg.style.transform = `translateY(${offset * 0.6}px)`;
      }
    });
  });
  
  // Active Navigation Highlight
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('.section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });
  
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Scroll Animations for Section Content
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.section-content')?.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });
  
  sections.forEach(section => observer.observe(section));
  
  // 3D Model for View360 Section
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const container = document.getElementById('car-3d-container');
  
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  // OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // Load GLTF Model
  const loader = new THREE.GLTFLoader();
  loader.load('assets/car.glb', (gltf) => {
    const model = gltf.scene;
    scene.add(model);
  
    // Center and scale model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    model.scale.set(scale, scale, scale);
    model.position.sub(center.multiplyScalar(scale));
  
    // Position camera
    camera.position.z = 5;
  }, undefined, (error) => {
    console.error('Error loading GLTF model:', error);
  });
  
  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  
  // Handle Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
  
  // 270 View Rotation with GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.to('#engine-image', {
    rotation: 270,
    ease: 'none',
    scrollTrigger: {
      trigger: '#engine270',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      pin: true,
    }
  });