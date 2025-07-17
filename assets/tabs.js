class TabsSlider {
  constructor() {
    this.tabs = document.querySelectorAll('.tabs__step');
    this.image = document.querySelector('.tabs__image');
    this.currentTab = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 3500; // 3.5 segundos
    this.hasCompletedSequence = false;

    // Verifica se estamos em um dispositivo desktop (> 768px)
    this.isDesktop = window.innerWidth > 768;

    // Torna a instância acessível globalmente (para interação com o GSAP)
    window.tabsSlider = this;

    // Inicializa apenas se estiver em desktop
    if (this.isDesktop) {
      this.init();
    }

    // Adiciona listener de redimensionamento para responder às mudanças de tamanho da tela
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth > 768;

    // Se mudou de mobile para desktop, inicializa
    if (!wasDesktop && this.isDesktop) {
      this.init();

      // Restaurar eventos de clique para desktop
      this.tabs.forEach((tab) => {
        tab.style.pointerEvents = 'auto';
      });
    }

    // Se mudou de desktop para mobile, limpa autoplay
    if (wasDesktop && !this.isDesktop) {
      this.stopAutoplay();

      // No mobile, vamos desabilitar eventos de clique pois serão controlados pelo ScrollTrigger
      this.tabs.forEach((tab) => {
        tab.style.pointerEvents = 'none';
      });
    }
  }

  init() {
    console.log('Inicializando TabsSlider para desktop');

    // Adiciona listeners de clique
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        // Apenas processa cliques no desktop
        if (this.isDesktop) {
          this.stopAutoplay();
          this.switchTab(index);
        }
      });
    });

    // Criar um observador de interseção
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasCompletedSequence && this.isDesktop) {
            this.startAutoplay();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Começar a observar a seção
    const tabsSection = document.querySelector('.tabs');
    if (tabsSection) {
      observer.observe(tabsSection);
    }
  }

  switchTab(index) {
    // Remove active class de todas as tabs
    this.tabs.forEach((tab) => tab.classList.remove('active'));

    // Adiciona active class na tab selecionada
    this.tabs[index].classList.add('active');

    // Atualiza a imagem
    const imageFile = this.tabs[index].dataset.image;
    this.image.src = this.image.src.replace(/[^/]*$/, imageFile);
    this.currentTab = index;
  }

  startAutoplay() {
    // Apenas inicia autoplay em desktop
    if (!this.isDesktop) return;

    let count = 0;
    this.switchTab(count); // Garante que começa do primeiro

    this.autoplayInterval = setInterval(() => {
      count++;
      if (count >= this.tabs.length) {
        // Se chegou na última tab, para o autoplay
        this.stopAutoplay();
        this.hasCompletedSequence = true;
        return;
      }
      this.switchTab(count);
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new TabsSlider();
});
