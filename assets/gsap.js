document.addEventListener('DOMContentLoaded', () => {
  // Corrige ao voltar pra aba
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      lenis.resize();
      ScrollTrigger.refresh(true);
    }
  });

  // let lastTouchY = 0;
  // let lastTouchTime = 0;

  // window.addEventListener(
  //   'touchmove',
  //   (e) => {
  //     const touch = e.touches[0];
  //     const now = Date.now();
  //     const deltaY = Math.abs(touch.clientY - lastTouchY);
  //     const deltaTime = now - lastTouchTime;

  //     const velocity = deltaY / deltaTime;

  //     if (velocity > 2.5) {
  //       e.preventDefault();
  //     }

  //     lastTouchY = touch.clientY;
  //     lastTouchTime = now;
  //   },
  //   { passive: false }
  // );

  // Inicializa o Lenis para scroll suave
  const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.4,
    touchMultiplier: 1.1,
    //touchAction: 'auto',
    smoothTouch: true,
    //rafForce30: true,
    // syncTouch: true,
    // touchInertiaMultiplier: 16,
  });

  // Função para animar o Lenis
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Sincronização básica
  lenis.on('scroll', ScrollTrigger.update);

  // Sincronização adicional para garantir precisão
  // lenis.on('scroll', (e) => {
  //   // Força atualização do ScrollTrigger em cada evento de scroll
  //   ScrollTrigger.update();
  // });

  // gsap.ticker.add((time) => {
  //   lenis.raf(time * 1000);
  // });
  // gsap.ticker.lagSmoothing(0);

  // Registra o plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Detecta se estamos em mobile
  const isMobile = () => window.innerWidth <= 480;

  // Função auxiliar once()
  function once(el, event, fn, opts) {
    var onceFn = function (e) {
      el.removeEventListener(event, onceFn);
      fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  }

  // Função para detectar dispositivos touch
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  // ======== ANIMAÇÃO DA HERO ========
  function initHeroAnimation() {
    //console.log('Iniciando animação da hero');
    const video = document.querySelector('.video-scroll__player');

    if (!video) {
      console.error('Vídeo não encontrado para Hero Animation.');
      return;
    }

    // Inicializa os headings
    const title1 = document.querySelector("[data-hero-title='1']");
    const title2 = document.querySelector("[data-hero-title='2']");
    const title3 = document.querySelector("[data-hero-title='3']");
    const title4 = document.querySelector("[data-hero-title='4']");

    // Configuração inicial dos títulos
    gsap.set(title1, { opacity: 1, y: 0, display: 'block' });
    gsap.set([title2, title3, title4], { opacity: 0, y: 50, display: 'none' });

    // Configura o vídeo correto baseado no dispositivo
    const mobileVideoSrc = video.getAttribute('data-mobile-src');
    const desktopVideoSrc = video.getAttribute('data-desktop-src');

    if (mobileVideoSrc && desktopVideoSrc) {
      const src = isMobile() ? mobileVideoSrc : desktopVideoSrc;
      video.src = src;
      // console.log(`Usando vídeo para ${isMobile() ? 'mobile' : 'desktop'}: ${src}`);
    } else {
      const src = video.currentSrc || video.src;
      // console.log('Usando vídeo existente:', src);
    }

    // Força o carregamento do vídeo
    video.load();

    // Animações para fade in do vídeo
    gsap.fromTo(
      '.video-container',
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'top+=1200 top',
          scrub: isMobile() ? 2 : 2,
        },
      }
    );

    // Timeline para elementos da hero
    const heroElements = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=1000',
        scrub: isMobile() ? 3 : 2,
      },
    });

    heroElements
      .to('.hero__image', { y: '100vh', opacity: 0 }, 0)
      .to('.hero__logo__reveal', { y: '-100vh', opacity: 0 }, 0);

    // Distância total de scroll da hero
    const heroScrollDistance = 4750;

    // Pin da seção hero
    const heroPin = ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: `+=${heroScrollDistance}`,
      pin: true,
      pinSpacing: true,
      id: 'hero-pin',
    });

    // NOVA ABORDAGEM: Timeline única para os headings
    // Em vez de múltiplos ScrollTriggers, usamos uma única timeline
    const headingsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: `+=${heroScrollDistance}`,
        scrub: 0.1, // Um valor pequeno em vez de true para tornar as animações mais instantâneas
        // Alternativa: remover o scrub completamente para animações totalmente instantâneas
      },
    });

    // Modificar as durações para valores menores ou zero para animações mais abruptas
    headingsTimeline
      // Transição do título 1 para o título 2
      .to(title1, { opacity: 0, y: 0, duration: 0.01 }, 0.01) // Duração reduzida
      .set(title1, { display: 'none' }, 0.01)
      .set(title2, { display: 'block' }, 0.05)
      .fromTo(title2, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08 }, 0.05) // Duração reduzida

      // Transição do título 2 para o título 3
      .to(title2, { opacity: 0, y: 0, duration: 0.01 }, 0.9) // Duração reduzida
      .set(title2, { display: 'none' }, 0.2)
      .set(title3, { display: 'block' }, 0.2)
      .fromTo(title3, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08 }, 0.2) // Duração reduzida

      // Transição do título 3 para o título 4
      .to(title3, { opacity: 0, y: 0, duration: 0.01 }, 0.5) // Duração reduzida
      .set(title3, { display: 'none' }, 0.51)
      .set(title4, { display: 'block' }, 0.51)
      .fromTo(title4, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.08 }, 0.51); // Duração reduzida

    // Verificamos se é mobile ou desktop
    if (isMobile()) {
      // PARA MOBILE - Mantemos a abordagem que já está funcionando
      let videoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: `+=${heroScrollDistance}`,
          scrub: true,
          onEnter: () => {
            // console.log('ScrollTrigger enter - activating video (Mobile)');
            video.play();
            video.pause();
          },
        },
      });

      // Calculamos o ponto de início do vídeo - **
      const videoStartOffset = 200;
      const startProgress = videoStartOffset / heroScrollDistance;

      // Configuramos a animação do vídeo para mobile
      const setupVideoAnimationMobile = function () {
        // console.log('Setting up video animation for mobile');

        videoTimeline.fromTo(
          video,
          { currentTime: 0 },
          {
            currentTime: video.duration,
            ease: 'none',
            immediateRender: true,
          },
          startProgress
        );
      };

      // Configuramos o carregamento do vídeo para mobile
      video.onloadedmetadata = setupVideoAnimationMobile;

      // Caso o vídeo já esteja carregado
      if (video.readyState >= 2) {
        setupVideoAnimationMobile();
      }
    } else {
      // PARA DESKTOP - Implementação baseada na abordagem mobile
      let videoTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: `+=${heroScrollDistance}`,
          scrub: true,
          onEnter: () => {
            console.log('ScrollTrigger enter - activating video (Desktop)');
            video.play();
            video.pause();
          },
        },
      });

      // Calculamos o ponto de início do vídeo [DESKTOP]
      const videoStartOffset = 225;
      const startProgress = videoStartOffset / heroScrollDistance;

      // Configuramos a animação do vídeo para desktop (usando o mesmo método do mobile)
      const setupVideoAnimationDesktop = function () {
        console.log('Setting up video animation for desktop (usando método mobile)');

        // Garante visibilidade do vídeo
        gsap.set(video, { opacity: 1, visibility: 'visible' });
        gsap.set('.video-container', { opacity: 1, visibility: 'visible' });

        videoTimeline.fromTo(
          video,
          { currentTime: 0 },
          {
            currentTime: video.duration,
            ease: 'none',
            immediateRender: true,
          },
          startProgress
        );
      };

      // Configuramos o carregamento do vídeo para desktop
      video.onloadedmetadata = setupVideoAnimationDesktop;

      // Caso o vídeo já esteja carregado
      if (video.readyState >= 2) {
        setupVideoAnimationDesktop();
      }

      /* 
      // CÓDIGO ORIGINAL PARA DESKTOP (COMENTADO)
      // Função para inicializar o vídeo uma vez
      let once = (el, event, fn) => {
        let onceFn = function () {
          el.removeEventListener(event, onceFn);
          fn.apply(this, arguments);
        };
        el.addEventListener(event, onceFn);
        return onceFn;
      };
  
      // Função para preparar o vídeo
      const prepFunc = () => {
        video.play();
        video.pause();
      };
  
      // Prepara o vídeo para desktop
      once(document.documentElement, 'mousemove', prepFunc)();
  
      // Garante visibilidade do vídeo
      gsap.set(video, { opacity: 1, visibility: 'visible' });
      gsap.set('.video-container', { opacity: 1, visibility: 'visible' });
  
      // Cria o tween diretamente
      const videoTween = gsap.fromTo(
        video,
        { currentTime: 0 },
        {
          paused: true,
          immediateRender: false,
          currentTime: video.duration || 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: `+=${heroScrollDistance}`,
            scrub: true,
          },
        }
      );
  
      // Função para resetar o tween quando o vídeo estiver carregado
      const resetTime = () => {
        videoTween.vars.currentTime = video.duration || 1;
        videoTween.invalidate();
        return videoTween;
      };
  
      // Se o vídeo já estiver carregado, reseta o tween imediatamente
      // Caso contrário, faz isso quando o vídeo estiver carregado
      video.readyState >= 2 ? resetTime() : once(video, 'loadedmetadata', resetTime);
      */
    }
  }
  // ======== ANIMAÇÃO FOOTWEAR ========
  function initFootwearAnimation() {
    // Seleciona os elementos
    const footwearHeading = document.querySelector('.footwear__heading');
    const footwear = document.querySelector('.footwear__inner');
    const title1 = document.querySelector('[data-description="1"] .feature-description__title');
    const title2 = document.querySelector('[data-description="2"] .feature-description__title');
    const title3 = document.querySelector('[data-description="3"] .feature-description__title');
    const line1 = document.querySelector('[data-description="1"] .feature-description__line');
    const line2 = document.querySelector('[data-description="2"] .feature-description__line');
    const line3 = document.querySelector('[data-description="3"] .feature-description__line');
    const textNames = document.querySelector('.text-names');

    if (!footwear) return;

    // Animação dos nomes
    const names = document.querySelectorAll(`.text-names h2`);
    if (names.length) {
      // Configura a timeline para nomes - loop infinito
      const namesTimeline = gsap.timeline({ repeat: -1 });

      // Esconde todos os nomes inicialmente
      gsap.set(names, { opacity: 0 });

      // Adiciona cada nome à timeline
      names.forEach((name) => {
        namesTimeline
          .to(name, { opacity: 1, duration: 0.3 }) // Mostra
          .to({}, { duration: 0.7 }) // Pausa
          .to(name, { opacity: 0, duration: 0.3 }); // Esconde
      });
    }

    // Implementação responsiva com matchMedia
    const mm = gsap.matchMedia();

    // Desktop (telas maiores que 768px)
    mm.add('(min-width: 769px)', () => {
      // Heading Animation
      if (footwearHeading) {
        footwearHeading.setAttribute('animate', '');

        // Inicializa o SplitType no heading
        let typeSplit = new SplitType(footwearHeading, {
          types: 'lines, words, chars',
          tagName: 'span',
        });

        gsap.from(`${footwearHeading.tagName.toLowerCase()}[animate] .line`, {
          y: '100%',
          opacity: 0,
          duration: 0.5,
          ease: 'Second.in',
          stagger: 0.03,
          scrollTrigger: {
            // markers: true,
            trigger: footwearHeading,
            start: 'top+=300 bottom',
            toggleActions: 'play reverse play reverse',
          },
        });
      }

      // ScrollTrigger config
      const scrollTriggerConfig = {
        trigger: '.footwear__inner',
        start: 'top+=500 bottom',
        end: '+=500',
        scrub: 2,
      };

      // Cria a timeline dentro do contexto do matchMedia
      const tlFootwear = gsap.timeline({
        scrollTrigger: scrollTriggerConfig,
      });

      // Linha 1 (direita para esquerda)
      if (line1) {
        tlFootwear
          .fromTo(
            line1,
            { width: '0%', marginLeft: '100%' },
            { width: '100%', marginLeft: '0%', duration: 2, ease: 'power1.inOut' }
          )
          .fromTo([title1, line1], { opacity: 0 }, { opacity: 1 }, '<')
          .to(
            textNames,
            {
              opacity: 1,
              delay: 0.5,
              duration: 1,
            },
            '<'
          );
      }

      // Linha 2 (esquerda para direita)
      if (line2) {
        tlFootwear
          .fromTo(line2, { width: '0%' }, { width: '100%', duration: 2, ease: 'power1.inOut' })
          .fromTo([title2, line2], { opacity: 0 }, { opacity: 1 }, '<');
      }

      // Linha 3 (direita para esquerda)
      if (line3) {
        tlFootwear
          .fromTo(
            line3,
            { width: '0%', marginLeft: '100%' },
            { width: '100%', marginLeft: '0%', duration: 3, ease: 'power1.inOut' }
          )
          .fromTo([title3, line3], { opacity: 0 }, { opacity: 1 }, '<');
      }

      return () => {
        // Cleanup function
        if (tlFootwear.scrollTrigger) {
          tlFootwear.scrollTrigger.kill();
        }
      };
    });

    // Mobile (telas menores que 768px)
    mm.add('(max-width: 768px)', () => {
      const footwearSection = document.querySelector('.footwear');
      const layer = document.querySelector('.layer');

      // First, we'll prepare the elements with initial values
      gsap.set([title1, title2, title3], { opacity: 0, y: 0, visibility: 'hidden' });
      gsap.set([line1, line2, line3], { width: '0%', opacity: 0, visibility: 'hidden' });
      gsap.set(textNames, { opacity: 0, visibility: 'hidden' });

      // PIN the section first
      const footwearPin = ScrollTrigger.create({
        trigger: footwearSection,
        start: 'top top',
        end: '+=2200', // Amount of scroll distance while pinned
        pin: true,
        pinSpacing: true,
        // anticipatePin: 1, // Ajuda a melhorar o comportamento do pin
        id: 'footwear-pin-mobile',
      });

      // Create timeline for animations while pinned
      const tlFootwear = gsap.timeline({
        scrollTrigger: {
          trigger: footwearSection,
          start: 'top top', // Start at the same point as the pin
          end: '+=2200', // Same as pin end
          scrub: 2,
          id: 'footwear-animation-mobile',
        },
      });

      // First line/title (first third of scroll)
      if (line1) {
        tlFootwear
          // Set visibility first
          .set([title1, line1], { visibility: 'visible' }, 0)
          // Animate first title and line
          .fromTo(title1, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.2 }, 0)
          .fromTo(
            line1,
            { width: '0%', marginLeft: '100%', opacity: 1 },
            { width: '90%', marginLeft: '5%', opacity: 1, duration: 0.2 },
            0
          )
          .fromTo(
            textNames,
            { opacity: 0, visibility: 'hidden' },
            { opacity: 1, duration: 0.3, visibility: 'visible' },
            '<'
          )
          .fromTo(footwearHeading, { zIndex: 1 }, { zIndex: 2 }, '<');
      }

      // Second line/title (second third of scroll)
      if (line2) {
        tlFootwear
          .set([title2, line2], { visibility: 'visible' }, 0.33)
          .fromTo(title2, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.2 }, 0.33)
          .fromTo(
            line2,
            { width: '0%', opacity: 1 },
            { width: '90%', marginLeft: '5%', opacity: 1, duration: 0.2 },
            0.33
          );
      }

      // Third line/title (last third of scroll)
      if (line3) {
        tlFootwear
          .set([title3, line3], { visibility: 'visible' }, 0.66)
          .fromTo(title3, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.2 }, 0.66)
          .fromTo(
            line3,
            { width: '0%', marginLeft: '100%', opacity: 1 },
            { width: '90%', marginLeft: '5%', opacity: 1, duration: 0.2 },
            0.66
          )
          .to(layer, { opacity: 0.4, duration: 0.5 }, '<'); // Fade in the layer
      }

      // Configure the names animation
      const names = document.querySelectorAll(`.text-names h2`);
      if (names.length) {
        // Timeline for names - infinite loop
        const namesTimeline = gsap.timeline({ repeat: -1 });

        // Hide all names initially
        gsap.set(names, { opacity: 0 });

        // Add each name to the timeline
        names.forEach((name) => {
          namesTimeline
            .to(name, { opacity: 1, duration: 0.3 })
            .to({}, { duration: 0.7 })
            .to(name, { opacity: 0, duration: 0.3 });
        });
      }

      return () => {
        // Cleanup function
        if (footwearPin) footwearPin.kill();
        if (tlFootwear.scrollTrigger) tlFootwear.scrollTrigger.kill();
      };
    });
  }

  // ======== ANIMAÇÃO INSOLE SOLO ========
  function initInsoleSoloAnimation() {
    const insole = document.querySelector('.insole-solo');
    const footwear = document.querySelector('.footwear');

    if (!insole || !footwear) return;

    // Configuração inicial comum
    gsap.set(insole, {
      opacity: 0,
      visibility: 'visible', // Garante que o elemento esteja visível, apenas com opacity 0
    });

    // Criar um objeto MediaQueryList para detecção de dispositivos
    const mediaMatch = gsap.matchMedia();

    // Desktop (acima de 768px)
    mediaMatch.add('(min-width: 769px)', () => {
      // Definindo o estado inicial para desktop
      gsap.set(insole, {
        width: '100px',
      });

      // Criando uma timeline pausada para desktop
      const tlDesktop = gsap.timeline({
        paused: true,
      });

      // Animação desktop
      tlDesktop.fromTo(
        insole,
        { width: '140px', y: 188 }, // valores iniciais (from)
        { width: '310px', ease: 'none', y: 0 }, // valores finais (to)
        0 // posição na timeline
      );

      // ScrollTrigger para desktop
      const insoleTrigger = ScrollTrigger.create({
        trigger: footwear,
        start: 'top-=150 bottom',
        end: 'bottom-=300 bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          // Atualiza a timeline baseado no progresso do scroll
          tlDesktop.progress(self.progress);

          // Controle separado e abrupto para opacity
          if (self.progress > 0.1) {
            if (insole.style.opacity !== '1') {
              gsap.set(insole, { opacity: 1 });
            }
          } else {
            if (insole.style.opacity !== '0') {
              gsap.set(insole, { opacity: 0 });
            }
          }

          // Log para debug
          console.log(
            'Desktop - Progresso: ' +
              self.progress.toFixed(2) +
              ' | Width: ' +
              getComputedStyle(insole).width +
              ' | Opacity: ' +
              getComputedStyle(insole).opacity
          );
        },
      });

      return () => {
        // Função de limpeza
        if (insoleTrigger) insoleTrigger.kill();
      };
    });

    // Mobile (até 768px)
    mediaMatch.add('(max-width: 768px)', () => {
      // Definindo o estado inicial para mobile
      gsap.set(insole, {
        width: '134px', // Valor inicial menor para mobile
        transformOrigin: 'center center',
      });

      // Criando uma timeline pausada para mobile
      const tlMobile = gsap.timeline({
        paused: true,
      });

      // Animação mobile (valores menores e posicionamento ajustado)
      tlMobile.fromTo(
        insole,
        { width: '132px', y: -29 }, // valores iniciais reduzidos para mobile
        { width: '240px', y: 0 }, // valores finais reduzidos para mobile
        0 // posição na timeline
      );

      // ScrollTrigger para mobile com pontos de ativação ajustados
      const insoleMobileTrigger = ScrollTrigger.create({
        trigger: footwear,
        start: 'top-=280 bottom', // Ajustado para mobile
        end: 'bottom-=200 bottom', // Ajustado para mobile
        onUpdate: (self) => {
          // Atualiza a timeline baseado no progresso do scroll
          tlMobile.progress(self.progress);

          // Controle separado e abrupto para opacity
          if (self.progress > 0.1) {
            if (insole.style.opacity !== '1') {
              gsap.set(insole, { opacity: 1 });
            }
          } else {
            if (insole.style.opacity !== '0') {
              gsap.set(insole, { opacity: 0 });
            }
          }

          // Log para debug
          // console.log(
          //   'Mobile - Progresso: ' +
          //     self.progress.toFixed(2) +
          //     ' | Width: ' +
          //     getComputedStyle(insole).width +
          //     ' | Opacity: ' +
          //     getComputedStyle(insole).opacity
          // );
        },
      });

      return () => {
        // Função de limpeza
        if (insoleMobileTrigger) insoleMobileTrigger.kill();
      };
    });

    // Animação dos nomes na palmilha
    const names = document.querySelectorAll('.text-names h2');
    if (names.length) {
      // Configura a timeline para nomes - loop infinito
      const namesTimeline = gsap.timeline({ repeat: -1 });

      // Esconde todos os nomes inicialmente
      gsap.set(names, { opacity: 0 });

      // Adiciona cada nome à timeline
      names.forEach((name) => {
        namesTimeline
          .to(name, { opacity: 1, duration: 0.3 }) // Mostra
          .to({}, { duration: 0.7 }) // Pausa
          .to(name, { opacity: 0, duration: 0.3 }); // Esconde
      });
    }
  }

  // ======== ANIMAÇÃO DOS CARDS ========
  function initCardAnimation() {
    gsap.set('[data-card]', { opacity: 1, autoAlpha: 1 });

    const cardsHeading = document.querySelector('.cards__heading');
    const gradient = document.querySelectorAll('.gradient-to-left');
    // if (cardsHeading) {
    //   cardsHeading.setAttribute('animate', '');

    //   // Inicializa o SplitType no heading
    //   let typeSplit = new SplitType(cardsHeading, {
    //     types: 'lines, words, chars',
    //     tagName: 'span',
    //   });

    //   gsap.from(`${cardsHeading.tagName.toLowerCase()}[animate] .word`, {
    //     y: '100%',
    //     opacity: 0,
    //     duration: 0.5,
    //     ease: 'Second.in',
    //     stagger: 0.03,
    //     scrollTrigger: {
    //       markers: true,
    //       trigger: cardsHeading,
    //       start: 'top+=200 bottom',
    //       toggleActions: 'play reverse play reverse',
    //     },
    //   });
    // }

    // console.log('Iniciando animação dos cards');

    const cards = document.querySelector('.cards__inner');

    if (!cards) {
      console.error('Cards não encontrados para animação.');
      return;
    }

    // Usa matchMedia para animações responsivas
    let mm = gsap.matchMedia();

    // DESKTOP (telas maiores que 480px)
    mm.add('(min-width: 481px)', () => {
      // Configuração inicial explícita
      gsap.set('[data-card="1"]', { x: '20%', scale: 1, opacity: 0.1 }); // mac miller
      gsap.set('[data-card="2"]', { x: '0', rotate: 10 });
      gsap.set('[data-card="3"]', { x: '0', rotate: -10 });
      gsap.set('[data-card="4"]', { x: '-20%', scale: 1, opacity: 0.1 });

      // Definir z-index iniciais para todos os cards
      gsap.set('[data-card="1"]', { zIndex: 2 });
      gsap.set('[data-card="2"]', { zIndex: 3 });
      gsap.set('[data-card="3"]', { zIndex: 3 });
      gsap.set('[data-card="4"]', { zIndex: 2 });

      // Fase 1: Espalhamento (antes do pin)
      const spreadTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.cards__inner',
          start: 'top-=300 center',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      spreadTL
        .to('[data-card="1"]', { x: '155%', scale: 0.8, opacity: 1 }) // mac miller
        .to('[data-card="2"]', { x: '55%', rotate: 0 }, '<') // tenista
        .to('[data-card="3"]', { x: '-55%', rotate: 0 }, '<') // lebron - removido zIndex
        .to('[data-card="4"]', { x: '-155%', scale: 0.8, opacity: 1 }, '<'); // lakers - removido zIndex

      // Definir z-index entre as timelines para evitar problemas de interpolação
      // Isso é executado assim que a primeira timeline termina e antes da segunda começar
      const setupZIndex = gsap.timeline({
        scrollTrigger: {
          trigger: '.cards__inner',
          start: 'top-=50 top',
          end: 'top top',
          onEnter: () => {
            gsap.set('[data-card="4"]', { zIndex: 10 });
            gsap.set('[data-card="1"]', { zIndex: 10 });
            gsap.set('[data-card="2"], [data-card="3"]', { zIndex: 5 });
          },
          onLeaveBack: () => {
            gsap.set('[data-card="1"]', { zIndex: 2 });
            gsap.set('[data-card="2"]', { zIndex: 3 });
            gsap.set('[data-card="3"]', { zIndex: 3 });
            gsap.set('[data-card="4"]', { zIndex: 2 });
          },
        },
      });

      // Fase 2: Transformação final (com pin)
      const finalTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.cards__inner',
          start: 'top top',
          end: '+=800',
          scrub: true,
          pin: true,
          // anticipatePin: 1, // desativado
          invalidateOnRefresh: true,
        },
      });

      // Estados iniciais
      gsap.set('[data-heading="2"]', { y: '40', opacity: 0 });
      gsap.set('[data-footer="2"]', { y: '-50', opacity: 0 });

      finalTL
        // Não precisamos mais animar o zIndex aqui, apenas as outras propriedades
        .to('[data-card="4"]', { scale: 1, x: '-55%', duration: 0.32 }, 0) // lakers - removido zIndex
        .to('[data-card="1"]', { scale: 1, x: '55%', duration: 0.32 }, 0) // mac miller - removido zIndex
        .to(
          '[data-card="3"], [data-card="2"]',
          { scale: 0.5, y: '-20%', opacity: 0, duration: 0.5 }, // removido zIndex duplicado
          0
        ) // lebron e tenista
        .to('[data-footer="1"]', { opacity: 0, y: '-30', duration: 0.2 }, 0)
        .to('[data-footer="2"]', { opacity: 1, y: '-80' }, 0)
        .to(gradient, { opacity: 0 }, 0);

      const triggerConfig = {
        trigger: '.cards__inner',
        start: 'top top',
        toggleActions: 'play reverse play reverse',
      };

      gsap.to('[data-heading="1"]', {
        opacity: 0,
        y: '-25',
        duration: 0.25,
        scrollTrigger: triggerConfig,
      });

      gsap.to('[data-heading="2"]', {
        opacity: 1,
        y: '0',
        duration: 0.25,
        scrollTrigger: triggerConfig,
      });

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (spreadTL.scrollTrigger) spreadTL.scrollTrigger.kill();
        if (setupZIndex.scrollTrigger) setupZIndex.scrollTrigger.kill();
        if (finalTL.scrollTrigger) finalTL.scrollTrigger.kill();
      };
    });

    // MOBILE (telas menores que 480px)
    mm.add('(max-width: 480px)', () => {
      // Pré-definir altura para evitar recálculos
      const cardsHeight = cards.offsetHeight;
      gsap.set(cards, { height: cardsHeight });

      // Definir estados iniciais
      gsap.set('[data-card="1"]', { x: '0', scale: 0.95, y: 40, opacity: 1 }); // mac miller (-30)
      gsap.set('[data-card="4"]', { x: '0', rotate: 0, scale: 1, y: 20, zIndex: 2, opacity: 1 }); // lakers (-20)
      gsap.set('[data-card="3"]', { x: '0', rotate: 0, scale: 1, y: 10, zIndex: 3, opacity: 1 }); //lebron (-10)
      gsap.set('[data-card="2"]', { x: '0', scale: 1, zIndex: 4, opacity: 1 }); // tenista
      gsap.set("[data-heading='2']", { opacity: 0, y: 0 });
      gsap.set("[data-heading='1']", { y: 0, opacity: 1 });
      gsap.set("[data-footer='2']", { opacity: 0, y: '-50' });

      // Timeline única com todos os estados
      const cardsMobileTL = gsap.timeline({
        scrollTrigger: {
          trigger: '.cards__inner',
          start: 'top top',
          end: '+=2350',
          scrub: true, // Valor maior para melhor desempenho
          pin: true,
          pinSpacing: true,
          fastScrollEnd: false,
          preventOverlaps: true,
          id: 'cards-mobile-pin',
        },
      });

      // Dividir a animação em fases com base no progresso
      cardsMobileTL
        // Fase 1: Card 2 sobe sozinho
        .to('[data-card="2"]', { scale: 0.5, y: '-135%', opacity: 1 }, 0.1)

        // Fase 2: Só depois, card 3 sobe
        .to('[data-card="3"]', { scale: 0.5, y: '-135%', opacity: 1 }, '>')
        // Headings
        .to("[data-heading='1']", { y: '0', opacity: 0, duration: 0.01 }, '<')
        .to("[data-heading='2']", { y: '0', display: 'block', opacity: 1 }, '<')
        .to("[data-footer='1']", { opacity: 0, y: '-50' }, '<')
        .to("[data-footer='2']", { y: '-10', opacity: 1 }, '<')

        // Fase 3: Depois o card 4 sobe
        .to('[data-card="4"]', { scale: 0.5, y: '-135%', opacity: 1 }, '>');

      // Fase 4: Só então o card 1 volta ao topo
      // .to('[data-card="1"]', { scale: 0.95, opacity: 1, x: '0', y: 0 }, '>');

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (cardsMobileTL.scrollTrigger) cardsMobileTL.scrollTrigger.kill();
        gsap.set(cards, { height: 'auto' }); // Restaura altura automática
      };
    });
  }

  // ======== ANIMAÇÃO DO WIREFRAME ========
  function initWireframeAnimation() {
    // console.log('Iniciando animação do wireframe');
    const wireframe = document.querySelector('.wireframe');
    const overlay = document.querySelector('.wireframe__content-right--after');

    if (!wireframe || !overlay) {
      console.error('Elementos wireframe não encontrados para animação.');
      return;
    }

    // Uso de matchMedia para tratamento responsivo
    const mm = gsap.matchMedia();

    // Desktop animation
    mm.add('(min-width: 481px)', () => {
      // Pin do wireframe
      const wireframePin = ScrollTrigger.create({
        trigger: wireframe,
        start: 'top top',
        end: '+=500', // Distância de scroll durante o pin
        pin: true,
        pinSpacing: true,
        scrub: 2,
      });

      // Animação do clip-path
      const wireframeAnimation = gsap.fromTo(
        overlay,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: wireframe,
            start: 'top top',
            end: '+=500',
            scrub: 2,
          },
        }
      );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (wireframePin) wireframePin.kill();
        if (wireframeAnimation.scrollTrigger) wireframeAnimation.scrollTrigger.kill();
      };
    });

    // Mobile animation (sem pin para melhor experiência)
    mm.add('(max-width: 480px)', () => {
      // Animação baseada em scroll para mobile
      const wireframeMobileAnimation = gsap.fromTo(
        overlay,
        { clipPath: 'inset(57% 0 0 0)' }, // Valor inicial para mobile
        {
          clipPath: 'inset(-8% 0 0 0)', // Valor final para mobile
          duration: 1,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: wireframe,
            start: 'top center', // Inicia quando o topo do elemento atinge o centro da viewport
            end: 'bottom bottom-=100', // Termina quando o final do elemento atinge o final da viewport
            scrub: 1, // Efeito mais suave
            // Sem pin no mobile para melhor experiência
          },
        }
      );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (wireframeMobileAnimation.scrollTrigger) wireframeMobileAnimation.scrollTrigger.kill();
      };
    });
  }

  // ======= ANIMAÇÃO DO TABS NO MOBILE  ========

  // Adicione esta função ao arquivo gsap.js junto com as outras funções de inicialização

  function initTabsAnimationMobile() {
    // console.log('Inicializando animação de tabs para mobile');

    // Verificar se a seção de tabs existe
    const tabsSection = document.querySelector('.tabs');
    if (!tabsSection) {
      console.error('Seção tabs não encontrada');
      return;
    }

    // Referências aos elementos
    const tabs = document.querySelectorAll('.tabs__step');
    const tabsImage = document.querySelector('.tabs__image');

    // Usar matchMedia para aplicar diferentes comportamentos baseados no tamanho da tela
    const mm = gsap.matchMedia();

    // Configuração para Mobile (telas menores que 769px)
    mm.add('(max-width: 768px)', () => {
      // console.log('Configurando tabs com ScrollTrigger para mobile');

      // Garantir que o primeiro tab esteja ativo imediatamente
      if (window.tabsSlider) {
        // Forçar a seleção do primeiro tab antes de qualquer animação
        window.tabsSlider.switchTab(0);

        // Desabilitar o autoplay para mobile
        window.tabsSlider.stopAutoplay();
        window.tabsSlider.hasCompletedSequence = true; // Impede que o autoplay seja iniciado novamente
      }

      // Desabilitar os cliques nas tabs no mobile
      tabs.forEach((tab) => {
        tab.style.pointerEvents = 'none';
      });

      // Pin da seção tabs para mobile - DOBRADO O TEMPO DE SCROLL
      const tabsPin = ScrollTrigger.create({
        trigger: tabsSection,
        start: 'top top',
        end: '+=600', // Valor dobrado (era 300)
        pin: true,
        pinSpacing: true,
        //anticipatePin: 1,
        id: 'tabs-pin-mobile',
      });

      // Timeline para controlar as transições entre as tabs - DOBRADO O TEMPO DE SCROLL
      const tabsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: tabsSection,
          start: 'top top',
          end: '+=600', // Valor dobrado (era 300)
          scrub: 1,
          id: 'tabs-animation-mobile',
          onUpdate: function (self) {
            // Determinar qual tab deve estar ativo com base no progresso do scroll
            const progress = self.progress;

            if (progress < 0.33) {
              // Primeiro terço do scroll - tab 1
              if (window.tabsSlider && window.tabsSlider.currentTab !== 0) {
                window.tabsSlider.switchTab(0);
              }
            } else if (progress < 0.66) {
              // Segundo terço do scroll - tab 2
              if (window.tabsSlider && window.tabsSlider.currentTab !== 1) {
                window.tabsSlider.switchTab(1);
              }
            } else {
              // Último terço do scroll - tab 3
              if (window.tabsSlider && window.tabsSlider.currentTab !== 2) {
                window.tabsSlider.switchTab(2);
              }
            }
          },
        },
      });

      return () => {
        // Função de limpeza quando o matchMedia não se aplica mais
        if (tabsPin) tabsPin.kill();
        if (tabsTimeline.scrollTrigger) tabsTimeline.scrollTrigger.kill();

        // Restaurar os eventos de clique
        tabs.forEach((tab) => {
          tab.style.pointerEvents = 'auto';
        });
      };
    });

    // Configuração para Desktop (telas maiores que 768px)
    mm.add('(min-width: 769px)', () => {
      console.log('Configurando tabs para desktop - mantendo comportamento padrão');

      // Não fazemos nada no desktop, pois queremos manter o comportamento original
      // O TabsSlider já gerencia a lógica de autoplay e clique no desktop

      return () => {
        // Função de limpeza, nenhuma necessária pois não criamos nada especial para desktop
      };
    });
  }

  // ======== ANIMAÇÃO DO FOOTER ========
  function initFooterAnimation() {
    // console.log('Iniciando animação do footer');
    const footer = document.querySelector('.footer');
    const banner = document.querySelector('.footer__banner');
    const bottom = document.querySelector('.footer__bottom');

    if (!footer || !banner || !bottom) {
      console.error('Elementos do footer não encontrados para animação.');
      return;
    }

    // Definir a altura da seção antes do pin para evitar recálculos
    const footerHeight = footer.offsetHeight;
    gsap.set(footer, { height: footerHeight });

    // Animações responsivas usando matchMedia
    const mm = gsap.matchMedia();

    // Desktop animações
    mm.add('(min-width: 481px)', () => {
      // Pin e animação em uma única configuração
      const footerDesktop = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top top',
          end: '+=1000',
          scrub: 2,
          pin: true,
          pinSpacing: true,
          fastScrollEnd: false,
          preventOverlaps: true,
          id: 'footer-desktop-pin',
        },
      });

      footerDesktop
        .to(banner, {
          width: '100%',
          height: 600,
          borderRadius: 24,
          ease: 'power2.inOut',
        })
        .to('.footer__banner-overlay', { opacity: 0.5 }, '<')
        .fromTo(
          '.footer__title',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<+=0.2'
        )
        .fromTo(
          '.appstore-btn',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<'
        );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (footerDesktop.scrollTrigger) footerDesktop.scrollTrigger.kill();
      };
    });

    // Mobile animações
    mm.add('(max-width: 480px)', () => {
      // Pin e animação em uma única configuração
      const footerMobile = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top top',
          end: '+=1000',
          scrub: 2,
          pin: true,
          pinSpacing: true,
          fastScrollEnd: false,
          preventOverlaps: true,
          id: 'footer-mobile-pin',
        },
      });

      footerMobile
        .to(banner, {
          width: '100%',
          height: 760, // Altura maior para mobile
          borderRadius: 0, // Sem bordas arredondadas no mobile
          ease: 'power2.inOut',
        })
        .to('.footer__banner-overlay', { opacity: 0.5 }, '<')
        .fromTo(
          '.footer__title',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<+=0.2'
        )
        .fromTo(
          '.appstore-btn',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<'
        );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (footerMobile.scrollTrigger) footerMobile.scrollTrigger.kill();
      };
    });
  }

  // Inicialização das animações
  function initAnimations() {
    // console.log('Inicializando animações');

    // Inicializa as animações em sequência
    initHeroAnimation();
    // Pequeno delay para garantir que a hero animation está completa
    setTimeout(() => {
      initFootwearAnimation();
      initInsoleSoloAnimation();
      initCardAnimation();
      initWireframeAnimation();
      initTabsAnimationMobile();
      initFooterAnimation();
    }, 200);

    // Adiciona ao final para ajustar o padding e forçar refresh
    // setTimeout(() => {
    //   // Verifica se é dispositivo móvel
    //   if (!isMobile()) {
    //     // Força um espaço no final da página para compensar os pins apenas no desktop
    //     document.body.style.paddingBottom = '100vh';
    //   } else {
    //     // Para mobile, use um valor menor
    //     document.body.style.paddingBottom = '0vh';
    //   }

    //   // Força o Lenis a se atualizar
    //   lenis.resize();

    //   // Atualiza todos os ScrollTriggers
    //   ScrollTrigger.refresh(true);
    // }, 1000);
  }

  // Configuração de event listeners
  function setupEventListeners() {
    // Responsividade
    window.addEventListener('resize', () => {
      // Força atualização do ScrollTrigger após redimensionamento
      ScrollTrigger.refresh();
      console.log('ScrollTriggers atualizados após redimensionamento');
    });

    // Detecta carregamento completo da página
    window.addEventListener('load', () => {
      console.log('Página totalmente carregada');

      // Refresh todos os ScrollTriggers
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    });

    // Monitora eventos de ScrollTrigger
    // ScrollTrigger.addEventListener('refreshInit', () => console.log('ScrollTrigger: iniciando refresh'));
    // ScrollTrigger.addEventListener('refresh', () => console.log('ScrollTrigger: refresh concluído'));
  }

  // Inicializa
  setupEventListeners();
  initAnimations();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    lenis.resize();
    ScrollTrigger.refresh(true);
  }
});
