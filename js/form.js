'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var form = document.querySelector('.review-form');
  var markParent = form.querySelector('.review-form-group-mark');
  var name = form.querySelector('#review-name');
  var text = form.querySelector('#review-text');

  var hintParent = form.querySelector('.review-fields');
  var nameHint = hintParent.querySelector('.review-fields-name');
  var textHint = hintParent.querySelector('.review-fields-text');

  var submit = form.querySelector('.review-submit');

  // Открываем форму
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');

    // Вставляем в поле "имя" значение из cookie
    name.value = docCookies.getItem('review-name');

    // Достаём значение "оценки" из cookie
    // Находим радио-баттон с совпадающим значением
    // И добавляем ему атрибут checked
    var markFromCookie = docCookies.getItem('review-mark');
    var marks = markParent.querySelectorAll('[name=review-mark');

    for (var i = 0; i < marks.length; i++) {
      if (marks[i].value === markFromCookie) {
        marks[i].setAttribute('checked', '');
      }
    }

    validateForm();
  };

  // Закрываем форму
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  // Событие - изменение поля "оценка"
  markParent.onchange = validateForm;

  // Событие - изменение поля "имя"
  name.onkeyup = validateForm;

  // Событие - изменение поля "отзыв"
  text.onkeyup = validateForm;

  // Событие - отправка формы
  form.onsubmit = function(evt) {
    evt.preventDefault();

    var mark = form.querySelector('[name=review-mark]:checked');

    var myBirthDay = +new Date(2015, 1, 2);
    var dateToExpire = +Date.now() + (+Date.now() - myBirthDay);
    var formattedDateToExpire = new Date(dateToExpire).toUTCString();

    document.cookie = 'review-mark=' + mark.value + ';expires=' + formattedDateToExpire;
    document.cookie = 'review-name=' + name.value + ';expires=' + formattedDateToExpire;

    form.submit();
  };

  // Ф-ция валидации формы
  function validateForm() {
    // Проверка полей с ОЦЕНКОЙ и ОТЗЫВОМ
    // Находим выбранную оценку
    var mark = form.querySelector('[name=review-mark]:checked');
    // Если оценка ниже 3, поле с отзывом становится
    // обязательным
    if (Number(mark.value) < 3) {
      text.setAttribute('required', '');
      // Прячем или показываем подсказку
      // в зависимости от заполненности поля
      if (text.value === '') {
        textHint.classList.remove('invisible');
        hintParent.classList.remove('invisible');
        submit.setAttribute('disabled', '');
      } else {
        textHint.classList.add('invisible');
        // Если поле "имя" валидно, то
        // прячем весь блок с подсказками и активируем кнопку
        if (nameHint.classList.contains('invisible')) {
          hintParent.classList.add('invisible');
          submit.removeAttribute('disabled');
        } else {
          // Если не валидно, возвращаем подсказки
          // и дизейблим кнопку
          hintParent.classList.remove('invisible');
          submit.setAttribute('disabled', '');
        }
      }
    // Если оценка 3 или выше, то отзыв необязателен
    } else {
      text.removeAttribute('required');
      textHint.classList.add('invisible');
    }

    // Проверка поля с ИМЕНЕМ
    if (name.value === '') {
      nameHint.classList.remove('invisible');
      hintParent.classList.remove('invisible');
      submit.setAttribute('disabled', '');
    } else {
      nameHint.classList.add('invisible');
      // Если поле "отзыв" валидно, то
      // прячем весь блок с подсказками
      if (textHint.classList.contains('invisible')) {
        hintParent.classList.add('invisible');
        submit.removeAttribute('disabled');
      } else {
        hintParent.classList.remove('invisible');
        submit.setAttribute('disabled', '');
      }
    }
  }

})();
