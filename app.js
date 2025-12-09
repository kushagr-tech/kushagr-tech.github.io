// document.addEventListener('DOMContentLoaded', () => {
//     initThreeJS();
//     initTiltEffect();
//     initCounters();
//     initSmoothScroll();
// });

// // --- 1. THREE.JS BACKGROUND ---
// function initThreeJS() {
//     const container = document.getElementById('canvas-container');
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     // Particles
//     const particlesGeometry = new THREE.BufferGeometry();
//     const particlesCount = 700;
//     const posArray = new Float32Array(particlesCount * 3);

//     for(let i = 0; i < particlesCount * 3; i++) {
//         // Spread particles across a wide area
//         posArray[i] = (Math.random() - 0.5) * 20; 
//     }

//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

//     // Material
//     const material = new THREE.PointsMaterial({
//         size: 0.02,
//         color: 0x6C63FF, // Your accent color
//         transparent: true,
//         opacity: 0.8,
//     });

//     // Mesh
//     const particlesMesh = new THREE.Points(particlesGeometry, material);
//     scene.add(particlesMesh);

//     camera.position.z = 3;

//     // Mouse Interaction
//     let mouseX = 0;
//     let mouseY = 0;

//     document.addEventListener('mousemove', (event) => {
//         mouseX = event.clientX / window.innerWidth - 0.5;
//         mouseY = event.clientY / window.innerHeight - 0.5;
//     });

//     // Animation Loop
//     const clock = new THREE.Clock();

//     function animate() {
//         requestAnimationFrame(animate);
//         const elapsedTime = clock.getElapsedTime();

//         // Rotate the entire particle system slowly
//         particlesMesh.rotation.y = elapsedTime * 0.05;
//         particlesMesh.rotation.x = elapsedTime * 0.02;

//         // Mouse Parallax effect
//         particlesMesh.rotation.y += mouseX * 0.05;
//         particlesMesh.rotation.x += mouseY * 0.05;

//         renderer.render(scene, camera);
//     }

//     animate();

//     // Handle Resize
//     window.addEventListener('resize', () => {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//     });
// }

// // --- 2. 3D TILT EFFECT FOR CARDS ---
// function initTiltEffect() {
//     const cards = document.querySelectorAll('[data-tilt]');

//     cards.forEach(card => {
//         card.addEventListener('mousemove', (e) => {
//             const rect = card.getBoundingClientRect();
//             const x = e.clientX - rect.left;
//             const y = e.clientY - rect.top;

//             // Calculate rotation based on mouse position
//             const xRotation = -1 * ((y - rect.height / 2) / 20); // Rotate around X axis
//             const yRotation = (x - rect.width / 2) / 20;  // Rotate around Y axis

//             card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
//         });

//         card.addEventListener('mouseleave', () => {
//             card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
//         });
//     });
// }

// // --- 3. ANIMATED COUNTERS ---
// function initCounters() {
//     const counters = document.querySelectorAll('.stat-num');
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const target = +entry.target.getAttribute('data-count');
//                 const duration = 2000; // ms
//                 const increment = target / (duration / 16); 
                
//                 let current = 0;
//                 const updateCounter = () => {
//                     current += increment;
//                     if (current < target) {
//                         entry.target.innerText = Math.ceil(current);
//                         requestAnimationFrame(updateCounter);
//                     } else {
//                         entry.target.innerText = target;
//                     }
//                 };
//                 updateCounter();
//                 observer.unobserve(entry.target);
//             }
//         });
//     }, { threshold: 0.5 });

//     counters.forEach(counter => observer.observe(counter));
// }

// // --- 4. SMOOTH SCROLL ---
// function initSmoothScroll() {
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();
//             document.querySelector(this.getAttribute('href')).scrollIntoView({
//                 behavior: 'smooth'
//             });
//         });
//     });
// }

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Animation on Scroll
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    initThreeJS();
    initTiltEffect();
    initCounters();
    initSmoothScroll();
    initMobileMenu();
});

// --- THREE.JS BACKGROUND (Connected Network) ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particlesCount = 100; // Reduced count for cleaner look with lines
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6C63FF,
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Lines for connection
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6C63FF,
        transparent: true,
        opacity: 0.15
    });

    camera.position.z = 5;

    // Mouse
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animate
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.1;
        particlesMesh.rotation.y += mouseX * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 3D TILT EFFECT ---
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Subtle rotation
            const xRotation = -1 * ((y - rect.height / 2) / 15);
            const yRotation = (x - rect.width / 2) / 15;

            card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// --- ANIMATED COUNTERS ---
function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-count');
                const duration = 2000;
                const increment = target / (duration / 16);
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// --- SMOOTH SCROLL ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                document.getElementById('nav-menu').classList.remove('active');
            }
        });
    });
}

// --- MOBILE MENU ---
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    if(toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('open');
        });
    }
}