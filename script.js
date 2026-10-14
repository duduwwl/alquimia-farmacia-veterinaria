const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('is-open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
  });
});

const whatsappNumber = '553538210175';
const recipeForm = document.querySelector('[data-recipe-form]');
const recipeFile = document.querySelector('#recipe-file');
const fileName = document.querySelector('[data-file-name]');
const formFeedback = document.querySelector('[data-form-feedback]');
const maxFileSize = 10 * 1024 * 1024;

const showFeedback = (message, type = 'success') => {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.dataset.type = type;
};

recipeFile?.addEventListener('change', () => {
  const file = recipeFile.files?.[0];
  if (!file) {
    if (fileName) fileName.textContent = 'Nenhum arquivo selecionado';
    return;
  }
  if (file.size > maxFileSize) {
    recipeFile.value = '';
    if (fileName) fileName.textContent = 'Nenhum arquivo selecionado';
    showFeedback('Esse arquivo passa de 10 MB. Escolha uma receita menor.', 'error');
    return;
  }
  if (fileName) fileName.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
  showFeedback('Arquivo pronto. Ao abrir o WhatsApp, anexe a receita na conversa.', 'success');
});

recipeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(recipeForm);
  const tutor = String(data.get('tutor') || '').trim();
  const pet = String(data.get('pet') || '').trim();
  const species = String(data.get('species') || '').trim();
  const details = String(data.get('details') || '').trim();
  const hasFile = Boolean(recipeFile?.files?.length);
  if (!tutor || !pet || !species) {
    showFeedback('Preencha seu nome, o nome do pet e o tipo de animal.', 'error');
    return;
  }
  const message = [
    'Olá, Alquimia! Gostaria de solicitar um orçamento para manipulação veterinária.',
    `Tutor: ${tutor}`,
    `Pet: ${pet}`,
    `Animal: ${species}`,
    details ? `Detalhes: ${details}` : '',
    hasFile ? 'Tenho uma receita selecionada e vou anexá-la nesta conversa.' : 'Vou enviar os detalhes da receita nesta conversa.'
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  showFeedback('Resumo aberto no WhatsApp. Agora anexe a foto ou PDF da receita na conversa.', 'success');
});

document.querySelectorAll('[data-product]').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product || 'produtos prontos';
    const message = `Olá, Alquimia! Gostaria de consultar a disponibilidade de ${product} para meu pet.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  });
});

const filterButtons = document.querySelectorAll('[data-filter]');
const catalogCards = document.querySelectorAll('[data-category]');
const catalogEmpty = document.querySelector('[data-catalog-empty]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    let visible = 0;
    catalogCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
      if (shouldShow) visible += 1;
    });
    if (catalogEmpty) catalogEmpty.hidden = visible > 0;
  });
});

document.querySelectorAll('[data-interactive-media]').forEach((media) => {
  const move = (event) => {
    const rect = media.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    media.style.setProperty('--move-x', x.toFixed(2));
    media.style.setProperty('--move-y', y.toFixed(2));
  };
  media.addEventListener('pointermove', move);
  media.addEventListener('pointerleave', () => {
    media.style.setProperty('--move-x', '0');
    media.style.setProperty('--move-y', '0');
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
const updateScrollState = () => document.body.classList.toggle('has-scrolled', window.scrollY > 220);
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();
