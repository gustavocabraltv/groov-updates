document.addEventListener('DOMContentLoaded', function () {
  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  console.log('Iniciando Lenis...');

  // Initialize Lenis com configuração bem visível
  const lenis = new Lenis({
    duration: 2.5, // Duração bem maior para notar facilmente
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.5, // Reduzir para notar mais facilmente
    touchMultiplier: 0.5,
    syncTouch: false,
  });

  console.log('Lenis inicializado:', lenis);

  // Adicione um log para cada evento de scroll
  lenis.on('scroll', (e) => {
    console.log('Evento de scroll Lenis:', e);
    ScrollTrigger.update();
  });

  // Adicione logs para eventos específicos do Lenis
  const eventTypes = ['scroll', 'scroll-start', 'scroll-end'];
  eventTypes.forEach((eventType) => {
    lenis.on(eventType, (e) => {
      console.log(`Evento ${eventType}:`, e);
    });
  });

  // Integração com GSAP
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  console.log('Integração Lenis+GSAP completa!');

  // Lidar com links de âncora
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        console.log('Scrollando para âncora:', targetId);
        lenis.scrollTo(targetId);
      }
    });
  });

  // Você também pode verificar a versão do Lenis
  if (window.Lenis && window.Lenis.version) {
    console.log('Versão do Lenis:', window.Lenis.version);
  }

  // Exponha o Lenis globalmente para testes no console
  window.lenisInstance = lenis;
  console.log("Lenis está disponível globalmente como 'window.lenisInstance'");
});
