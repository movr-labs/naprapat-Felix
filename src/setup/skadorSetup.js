const areaMap = {
  Nacke: 'nacke',
  Rygg: 'rygg',
  Axel: 'axel',
  'Arm & armbåge': 'arm',
  'Höft & bäcken': 'hoft',
  'Knä & ben': 'kna',
  'Fot & vad': 'fot'
};

export function setupSkadorPage(container) {
  const showArea = (button, area) => {
    container.querySelectorAll('.area-tab').forEach(tab => tab.classList.remove('active'));
    button.classList.add('active');
    container.querySelectorAll('.area-section').forEach(section => section.classList.remove('active'));
    container.querySelector(`#area-${area}`)?.classList.add('active');
    container.querySelectorAll('.condition-detail').forEach(detail => detail.classList.remove('open'));
    container.querySelectorAll('.condition-card').forEach(card => card.classList.remove('expanded'));
  };

  const toggleCard = card => {
    const detail = card.querySelector('.condition-detail');
    if (!detail) return;

    const isOpen = detail.classList.contains('open');
    container.querySelectorAll('.condition-detail').forEach(openDetail => openDetail.classList.remove('open'));
    container.querySelectorAll('.condition-card').forEach(openCard => openCard.classList.remove('expanded'));
    if (!isOpen) {
      detail.classList.add('open');
      card.classList.add('expanded');
    }
  };

  const handleClick = event => {
    const tab = event.target.closest('.area-tab');
    if (tab && container.contains(tab)) {
      event.preventDefault();
      const label = tab.textContent.replace(/\s+/g, ' ').trim();
      const area = areaMap[label];
      if (area) showArea(tab, area);
      return;
    }

    const card = event.target.closest('.condition-card');
    if (!card || !container.contains(card)) return;
    toggleCard(card);
  };

  container.addEventListener('click', handleClick);

  return () => {
    container.removeEventListener('click', handleClick);
  };
}
