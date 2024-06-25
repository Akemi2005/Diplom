document.addEventListener('DOMContentLoaded', function () {
    updateCartItemCount();

    const iconOpen = document.getElementById('iconOpen')
    const iconOpenShop = document.getElementById('iconOpenShop')
    const iconClose = document.getElementById('iconClose')
    const menuIcons = document.getElementById('menuIcons')
    const meinMenu = document.getElementById('meinMenu')

    menuIcons.addEventListener('click', ()=> {
        iconOpenShop.classList.toggle('hide')
        iconOpen.classList.toggle('hide')
        iconClose.classList.toggle('hide')
        meinMenu.classList.toggle('hide')
    })

    window.onload = function () {
        let scrollToTopBtn = document.getElementById("scrollToTopBtn");

        window.onscroll = function () {
          if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = "block";
          } else {
            scrollToTopBtn.style.display = "none";
          }
        };
      };

    const menu = document.getElementById("window");
    const offset = menu.offsetTop;
    let lastScrollTop = 0; // Змінна для зберігання попереднього значення scrollTop
    function fixMenu() {
    const currentScrollTop = window.pageYOffset;
    // Перевіряємо, чи перевищує поточний scrollTop відступ меню
    if (currentScrollTop >= offset) {
    menu.classList.add("fixed-menu");
    document.body.style.paddingTop = menu.offsetHeight + "px";
    } else {
    menu.classList.remove("fixed-menu");
    document.body.style.paddingTop = 0;
    // Повертаємо оригінальний колір меню
    menu.style.backgroundColor = ""; // Оце очищає стиль
    }
    // Перевірка напрямку скролу
    if (currentScrollTop < lastScrollTop) {
    // Якщо скролл вгору, то знову знімаємо клас "fixed-menu" та відступ для body
    menu.classList.remove("fixed-menu");
    document.body.style.paddingTop = 0;
    // Повертаємо оригінальний колір меню
    menu.style.backgroundColor = ""; // Оце очищає стиль
    }
    lastScrollTop = currentScrollTop; // Зберігаємо поточне значення scrollTop
    }
    // Додаємо обробник події scroll для виклику функції fixMenu при скролі
    window.addEventListener("scroll", fixMenu);

    // Обробник події DOMContentLoaded, який може виконатися після завантаження DOM
    document.addEventListener("DOMContentLoaded", () => {
    const menuHeight = menu.offsetHeight; // Отримуємо висоту меню
    });

    // ВВІД ТЕЛЕФОНА
    const phoneTInput = document.getElementById('phoneT');

    phoneTInput.addEventListener('keypress', (event) => {
        // Отримуємо charCode введеного символу
        const charCode = event.charCode;
        // Перевіряємо, чи символ не є цифрою (від 48 до 57 за ASCII-кодом)
        if (charCode < 48 || charCode > 57) {
            // Якщо символ не є цифрою, блокуємо його введення
            event.preventDefault();
        }
    });

    // ГАЛЕРЕЯ
    const slides = document.querySelectorAll(".slide");
    const slideNav = document.querySelectorAll(".slide-nav p");
    let currentIndex = 0;

    // Функція, яка відображає відповідний слайд
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = "block"; // Показуємо поточний слайд
            } else {
                slide.style.display = "none"; // Ховаємо інші слайди
            }
        });
    }

    // Додаємо обробники подій для навігаційних точок
    slideNav.forEach((point, i) => {
        point.addEventListener("click", () => {
            currentIndex = i;
            showSlide(currentIndex);
        });
    });

    // Функція для перехіду до наступного слайду
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    // Функція для перехіду до попереднього слайду
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    // Додаємо обробники подій для кнопок прокрутки
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    leftArrow.addEventListener("click", prevSlide);
    rightArrow.addEventListener("click", nextSlide);

    // Показуємо перший слайд при завантаженні сторінки
    showSlide(currentIndex);

    const phoneInputSubmit = document.getElementById('phoneT');
    const submitBtn = document.getElementById('submitBtn');

    if (phoneInputSubmit) {
        submitBtn.addEventListener('click', () => {
            const phoneNumber = phoneInputSubmit.value;

            fetch('/submitPhoneNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneNumber }),
            })
                .then(response => response.json())
                .then(data => {
                    alert('The call is reserved for the number: ' + phoneNumber);
                    console.log('Success:', data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    } else {
        console.error('Element with id "phoneT" not found.');
    }
});

// Функція для оновлення кількості товарів у кошику
function updateCartItemCount() {
    const cartItemCountSpan = document.getElementById('cartItemCount');
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let currentItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartItemCountSpan.textContent = currentItemCount;
}
