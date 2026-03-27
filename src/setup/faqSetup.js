export function setupFaqPage(container) {
  const handleClick = event => {
    const button = event.target.closest('.faq-q');
    if (!button || !container.contains(button)) return;

    event.preventDefault();

    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    container.querySelectorAll('.faq-item').forEach(faqItem => faqItem.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  };

  container.addEventListener('click', handleClick);

  return () => {
    container.removeEventListener('click', handleClick);
  };
}
