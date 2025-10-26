document.addEventListener('DOMContentLoaded', function() {
  // Общие переменные и функции
  let scrollPosition = 0;
  const modalOverlay = document.querySelector('.modal-overlay');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const modalForms = document.querySelectorAll('.modal-form');
  const mainForm = document.getElementById('contactForm');
  const successMessages = document.querySelectorAll('.success-message');

  // ========== ОБЩИЕ ФУНКЦИИ ДЛЯ ВСЕХ ФОРМ ==========

  // Валидация телефона
  function validatePhone(phone) {
    const phoneRegex = /^[\d\s\+-]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  // Валидация формы
  function validateForm(form) {
    const nameInput = form.querySelector('.name, [name="name"]');
    const phoneInput = form.querySelector('.phone, [name="phone"]');
    let isValid = true;

    // Сброс предыдущих ошибок
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.style.display = 'none');
    nameInput.classList.remove('error');
    phoneInput.classList.remove('error');

    // Валидация имени
    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      const nameError = form.querySelector('.name-error, .error-message');
      if (nameError) {
        nameError.textContent = 'Будь ласка, введіть ваше ім\'я';
        nameError.style.display = 'block';
      }
      isValid = false;
    }

    // Валидация телефона
    if (!phoneInput.value.trim()) {
      phoneInput.classList.add('error');
      const phoneError = form.querySelector('.phone-error, .error-message');
      if (phoneError) {
        phoneError.textContent = 'Будь ласка, введіть ваш телефон';
        phoneError.style.display = 'block';
      }
      isValid = false;
    } else if (!validatePhone(phoneInput.value)) {
      phoneInput.classList.add('error');
      const phoneError = form.querySelector('.phone-error, .error-message');
      if (phoneError) {
        phoneError.textContent = 'Будь ласка, введіть коректний телефон';
        phoneError.style.display = 'block';
      }
      isValid = false;
    }

    // Анимация для первого ошибочного поля
    if (!isValid) {
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.style.animation = 'none';
        void firstError.offsetWidth; // Trigger reflow
        firstError.style.animation = 'shake 0.5s ease';
      }
    }

    return isValid;
  }

  // Обработка отправки формы
  async function handleFormSubmit(form, e) {
  e.preventDefault();
  if (!validateForm(form)) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner">Відправка...</span>';

  try {
    const formData = {
      name: form.querySelector('[name="name"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      message: form.querySelector('[name="message"]')?.value.trim() || '',
      origin: window.location.origin
    };

    const response = await fetch('https://workers.andreynovalskyi.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    // Улучшенная обработка ответа
    const text = await response.text();
    let result;
    
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Сервер вернул невалидный ответ");
    }

    if (!response.ok || result.error) {
      throw new Error(result.error || "Ошибка сервера");
    }
    
    // УСПЕШНАЯ ОТПРАВКА
    form.reset(); // Очищаем форму

    notifyTelegram();
    
    // Показываем сообщение (ваш код)
    showSuccessMessage(form); 
    
    // Закрываем модальное окно через 1.5 секунды
    setTimeout(() => {
      const modalOverlay = document.querySelector('.modal-overlay');
      if (modalOverlay) modalOverlay.classList.remove('active');
    }, 1500);
    
  } catch (error) {
    // ОБРАБОТКА ОШИБКИ
    console.error('Ошибка отправки:', error);
    
    // Показываем сообщение об ошибке
    showErrorMessage(error.message);
    
  } finally {
    // Восстанавливаем кнопку в любом случае
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

  // Сброс ошибок при вводе
  function setupInputValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const errorField = this.nextElementSibling;
          if (errorField && errorField.classList.contains('error-message')) {
            errorField.style.display = 'none';
          }
        }
      });
    });
  }

  // ========== ФУНКЦИИ ДЛЯ МОДАЛЬНОГО ОКНА ==========

  // Открытие модального окна
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollPosition}px`;
      document.addEventListener('keydown', handleEscapeKey);
    });
  });

  // Закрытие модального окна
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
    document.removeEventListener('keydown', handleEscapeKey);
    resetForms();
  }

  // Закрытие по ESC
  function handleEscapeKey(e) {
    if (e.key === 'Escape') closeModal();
  }

  // Сброс всех форм в модальном окне
  function resetForms() {
    modalForms.forEach(form => {
      form.reset();
      form.style.display = 'flex';
      const errorMessages = form.querySelectorAll('.error-message');
      errorMessages.forEach(msg => msg.style.display = 'none');
      const inputs = form.querySelectorAll('.modal-input, .modal-textarea');
      inputs.forEach(input => input.classList.remove('error'));
    });
    successMessages.forEach(msg => msg.style.display = 'none');
  }

  // Клик по overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Кнопки закрытия
  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // ========== ИНИЦИАЛИЗАЦИЯ ФОРМ ==========

  // Инициализация модальных форм
  modalForms.forEach(form => {
    form.addEventListener('submit', (e) => handleFormSubmit(form, e));
    setupInputValidation(form);
  });

  // Инициализация основной формы
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => handleFormSubmit(mainForm, e));
    setupInputValidation(mainForm);
    mainForm.setAttribute('novalidate', true);
  }
});

function showErrorMessage(message) {
  alert('Помилка: ' + message); // или сделайте красивее через модалку
}

function showSuccessMessage(form) {
  // Скрываем формы внутри модального окна
  form.style.display = 'none';

  // Находим соответствующий блок с сообщением об успехе рядом с этой формой
  const successMessage = form.parentElement.querySelector('.success-message');
  if (successMessage) {
    successMessage.style.display = 'block';
  } else {
    // Если нет, просто alert
    alert('Дякуємо! Ваше повідомлення відправлено.');
  }
}