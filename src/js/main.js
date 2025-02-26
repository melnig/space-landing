import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Three.js для зірок (без змін)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const starsCanvas = document.createElement('div');
  starsCanvas.className = 'stars-canvas';
  starsCanvas.style.position = 'fixed';
  starsCanvas.style.top = '0';
  starsCanvas.style.left = '0';
  starsCanvas.style.width = '100%';
  starsCanvas.style.height = '100%';
  starsCanvas.style.zIndex = '-1';
  document.body.appendChild(starsCanvas);
  starsCanvas.appendChild(renderer.domElement);

  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 5000;
  const positions = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  camera.position.z = 100;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    stars.position.y = scrollY * 0.05;
  });

  function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  
  gsap.to('.rocket', {
    y: -1000,
    duration: 3,
    ease: 'power1.in',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  
  gsap.from('.planet', {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    scrollTrigger: { trigger: '.destinations', start: 'top 80%' }
  });

  gsap.to('.about p', {
    y: 50,
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
  });

  gsap.from('.timeline-point', {
    scale: 0,
    stagger: 0.3,
    duration: 0.8,
    scrollTrigger: { trigger: '.timeline', start: 'top 80%' }
  });

  gsap.to('.scroll-progress', {
    width: '100%',
    ease: 'none',
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true }
  });

  const countdown = document.getElementById('countdown');
  const launchDate = new Date('2025-12-31 00:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
      countdown.innerHTML = 'Launch Happened!';
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const priceCards = document.querySelectorAll('.price-card');
  console.log('Price cards found:', priceCards.length);
  priceCards.forEach(card => {
    const targetPrice = parseInt(card.dataset.price);
    gsap.to(card.querySelector('.price-value'), {
      duration: 2,
      ease: 'power1.out',
      scrollTrigger: { trigger: card, start: 'top 80%' },
      onUpdate: function() {
        const progress = this.progress(); // 0 до 1
        const value = Math.round(progress * targetPrice);
        this.targets()[0].innerHTML = `$${value}k`;
      }
    });
  });

  const headings = document.querySelectorAll('h1, h2');
  headings.forEach(heading => {
    gsap.from(heading, {
      opacity: 0,
      y: 50, // Зсув униз на 50px
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: heading, // Тригер — сам заголовок
        start: 'top 80%', // Початок, коли верх заголовка на 80% екрану
        toggleActions: 'play none none reset' // Граємо при вході, скидаємо при виході
      }
    });
  });

  const textElements = document.querySelectorAll('p, li, .price-card:not(.price-value), .modal-content p, .modal-content li, .countdown, .rocket');
  textElements.forEach(text => {
    gsap.from(text, {
      opacity: 0,
      y: 30, // Менший зсув, щоб відрізнити від заголовків
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: text,
        start: 'top 85%', // Трішки пізніше за заголовки
        toggleActions: 'play none none reset'
      }
    });
  });

  gsap.from('.form-field', {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 1,
    scrollTrigger: { trigger: '.contact', start: 'top 80%' }
  });

  // Модальні вікна
  const planets = document.querySelectorAll('.planet');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.modal-close');

  planets.forEach(planet => {
    planet.addEventListener('click', () => {
      const planetId = planet.dataset.planet;
      const modal = document.getElementById(`modal-${planetId}`);
      modal.style.display = 'block';
      gsap.from(modal.querySelector('.modal-content'), {
        y: window.innerHeight,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      gsap.to(modal.querySelector('.modal-content'), {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        onComplete: () => { modal.style.display = 'none'; }
      });
    });
  });

  // Закриття модалки кліком по фону
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { // Перевіряємо, чи клікнули по фону
        gsap.to(modal.querySelector('.modal-content'), {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          onComplete: () => { modal.style.display = 'none'; }
        });
      }
    });
  });
});