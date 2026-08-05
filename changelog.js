document.addEventListener('DOMContentLoaded', async () => {
    // Инжектим CSS стили для модалки и анимаций
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes bell-ring {
        0% { transform: rotate(0); }
        10% { transform: rotate(20deg); }
        20% { transform: rotate(-15deg); }
        30% { transform: rotate(10deg); }
        40% { transform: rotate(-10deg); }
        50% { transform: rotate(5deg); }
        60% { transform: rotate(0); }
        100% { transform: rotate(0); }
      }
      @keyframes pulse-wave {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(3); opacity: 0; }
      }
      .cl-bell-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 5px;
        margin-left: auto;
      }
      .cl-bell-icon {
        font-size: 22px;
        transform-origin: top center;
        filter: grayscale(100%) opacity(0.7);
        transition: all 0.3s;
      }
      .cl-bell-wrapper:hover .cl-bell-icon {
        filter: grayscale(0%) opacity(1);
      }
      .cl-is-new .cl-bell-icon {
        filter: grayscale(0%) opacity(1);
        animation: bell-ring 2.5s infinite ease-in-out;
      }
      .cl-wave {
        position: absolute;
        top: 50%; left: 50%;
        width: 16px; height: 16px;
        margin-top: -8px; margin-left: -8px;
        border-radius: 50%;
        border: 2px solid #ffb4ab;
        pointer-events: none;
        opacity: 0;
      }
      .cl-is-new .cl-wave {
        animation: pulse-wave 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
      }
      .cl-is-new .cl-wave:nth-child(2) {
        animation-delay: 0.8s;
      }
  
      /* Стили Модалки */
      .cl-modal-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
        display: flex; justify-content: center; align-items: center;
        opacity: 0; pointer-events: none; transition: opacity 0.3s;
      }
      .cl-modal-overlay.cl-show {
        opacity: 1; pointer-events: auto;
      }
      .cl-modal-content {
        background: #141313;
        border: 1px solid #57524a;
        width: 90%; max-width: 500px;
        max-height: 80vh; overflow-y: auto;
        border-radius: 4px;
        box-shadow: 0 0 30px rgba(0,0,0,0.9);
        transform: translateY(20px); transition: transform 0.3s;
        font-family: 'EB Garamond', serif;
        color: #e5e2e1;
      }
      .cl-modal-overlay.cl-show .cl-modal-content {
        transform: translateY(0);
      }
      .cl-modal-header {
        position: sticky; top: 0;
        background: rgba(20, 19, 19, 0.95);
        backdrop-filter: blur(5px);
        padding: 15px 20px;
        border-bottom: 1px solid #3d3935;
        display: flex; justify-content: space-between; align-items: center;
        z-index: 10;
      }
      .cl-modal-title {
        font-family: 'Forum', serif;
        font-size: 20px;
        color: #dac493;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .cl-modal-close {
        background: none; border: none;
        color: #8e9192; font-size: 24px; cursor: pointer;
        transition: color 0.2s;
      }
      .cl-modal-close:hover { color: #ffb4ab; }
      .cl-modal-body { padding: 20px; }
      .cl-version-block { margin-bottom: 25px; }
      .cl-version-header { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #3d3935; padding-bottom: 5px; }
      .cl-version-num { font-family: 'Special Elite', monospace; color: #dac493; font-size: 16px; }
      .cl-version-date { color: #8e9192; font-size: 14px; font-style: italic; }
      .cl-version-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #ffffff; }
      .cl-change-item { margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; font-size: 16px; line-height: 1.4; }
      .cl-change-type { font-size: 14px; white-space: nowrap; font-weight: bold; }
    `;
    document.head.appendChild(style);
  
    // Создаем колокольчик
    const bellWrapper = document.createElement('div');
    bellWrapper.className = 'cl-bell-wrapper';
    bellWrapper.innerHTML = `
      <div class="cl-wave"></div>
      <div class="cl-wave"></div>
      <div class="cl-bell-icon">🔔</div>
    `;
  
    // Инжектим колокольчик в навигацию, позиционируя его абсолютно, чтобы не сдвигать центрированные ссылки
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.position = 'relative';
      bellWrapper.style.position = 'absolute';
      bellWrapper.style.right = '-40px';
      bellWrapper.style.top = '50%';
      bellWrapper.style.transform = 'translateY(-50%)';
      nav.appendChild(bellWrapper);
    }
  
    // Создаем модалку
    const modal = document.createElement('div');
    modal.className = 'cl-modal-overlay';
    modal.innerHTML = `
      <div class="cl-modal-content">
        <div class="cl-modal-header">
          <div class="cl-modal-title">История Обновлений</div>
          <button class="cl-modal-close">&times;</button>
        </div>
        <div class="cl-modal-body" id="cl-modal-body-content">
          <!-- Контент будет загружен сюда -->
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  
    // Функции управления модалкой
    const openModal = () => modal.classList.add('cl-show');
    const closeModal = () => modal.classList.remove('cl-show');
    modal.querySelector('.cl-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  
    // Загружаем данные JSON локально (без fetch, чтобы работало через file://)
    const changelog = [
      {
        "version": "0.2.4",
        "date": "06.08.2026",
        "title": "Раздел «Графики» и визуализация данных",
        "changes": [
          { "text": "Добавил историю изменений. В правом верхнем углу появился колокольчик. По клику открывается окно со списком всех обновлений проекта." },
          { "text": "Перешел на библиотеку ApexCharts. Она гибко адаптируется под размеры экрана, плавно анимирует данные в графиках и в целом выглядит приятнее." },
          { "text": "Сделал раздел «Графики»." },
          { "text": "Добавил график «Динамика сессий», который помогает объективно оценить прогресс." },
          { "text": "Добавил диаграмму «Самочувствие», которая показывает, как физическое и моральное состояние влияет на результативность." },
          { "text": "Устранил несколько визуальных багов. Улучшил стабильность работы калькулятора." }
        ]
      },
      {
        "version": "0.2.3",
        "date": "02.08.2026",
        "title": "Детальная аналитика сессий и лодауты",
        "changes": [
          { "text": "В раздел истории добавлена иконка деталей сессии. При клике на неё открывается подробная поматчевая статистика с графиком эффективности." },
          { "text": "В окно сохранения матча добавлено отдельное поле \"Лодаут\"." },
          { "text": "Поля \"Лодаут\" и \"Комментарий\" теперь разделены в базе данных. Это закладывает фундамент для будущей статистики эффективности с конкретным оружием." }
        ]
      },
      {
        "version": "0.2.2",
        "date": "01.08.2026",
        "title": "Виджет для стрима",
        "changes": [
          { "text": "Создан специальный минималистичный виджет статистики для встраивания в OBS." }
        ]
      },
      {
        "version": "0.2.1",
        "date": "31.07.2026",
        "title": "Мобильная версия и динамические графики",
        "changes": [
          { "text": "Проведена полная адаптация под мобильные устройства: главное меню, таблица истории и панель управления теперь корректно отображаются на смартфонах." },
          { "text": "В графики добавлена динамическая линия тренда с изменяющимся цветом в зависимости от успехов." },
          { "text": "Исправлен баг синхронизации: статистика и графики теперь обновляются мгновенно после внесения данных о фрагах или смертях, без необходимости перезагружать страницу." }
        ]
      }
    ];

    try {
      if (changelog && changelog.length > 0) {
        const latestVersion = changelog[0].version;
        const seenVersion = localStorage.getItem('last_seen_changelog');
  
        // Если версия новая, включаем анимацию
        if (seenVersion !== latestVersion) {
          bellWrapper.classList.add('cl-is-new');
        }
  
        // Отрисовка логов
        const bodyContent = document.getElementById('cl-modal-body-content');
        bodyContent.innerHTML = changelog.map(log => `
          <div class="cl-version-block">
            <div class="cl-version-header">
              <span class="cl-version-num">v${log.version}</span>
              <span class="cl-version-date">${log.date}</span>
            </div>
            <div class="cl-version-title">${log.title}</div>
            ${log.changes.map(change => `
              <div class="cl-change-item">
                <span class="cl-change-text">— ${change.text}</span>
              </div>
            `).join('')}
          </div>
        `).join('');
  
        // Обработка клика по колокольчику
        bellWrapper.addEventListener('click', () => {
          bellWrapper.classList.remove('cl-is-new');
          localStorage.setItem('last_seen_changelog', latestVersion);
          openModal();
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки changelog', err);
    }
  });
