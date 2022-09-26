(function () {

    //  Переменные для изображений и текста, элемента `canvas`, сохранение длины слайда
    var sliderCanvas = document.querySelector('.pieces-slider__canvas');
    var imagesEl = [].slice.call(document.querySelectorAll('.pieces-slider__image'));
    var textEl = [].slice.call(document.querySelectorAll('.pieces-slider__text'));
    var slidesLength = imagesEl.length;

    // Определение индексов переменных и функций
    var currentIndex = 0, currentImageIndex, currentTextIndex, currentNumberIndex;

    // Обновление индексов для изображений и текста
    function updateIndexes() {
        currentImageIndex = currentIndex * 3;
        currentTextIndex = currentImageIndex + 1;
        currentNumberIndex = currentImageIndex + 2;
    }
    updateIndexes();
    var textIndexes = [];
    var numberIndexes = [];

    // Переменные
    var windowWidth = window.innerWidth;
    var piecesSlider;

    // Опции для изображений
    var imageOptions = {
        angle: 45,
        extraSpacing: { extraX: 100, extraY: 200 },
        piecesWidth: function () { return Pieces.random(50, 200); },
        ty: function () { return Pieces.random(-400, 400); }
    };

    //  Опции для текста
    var textOptions = {
        color: 'white',
        backgroundColor: '#103cad',
        fontSize: function () { return windowWidth > 720 ? 50 : 30; },
        padding: '15 20 10 20',
        angle: -45,
        piecesSpacing: 2,
        extraSpacing: { extraX: 0, extraY: 300 },
        piecesWidth: function () { return Pieces.random(50, 200); },
        ty: function () { return Pieces.random(-200, 200); },
        translate: function () {
            if (windowWidth > 1120) return { translateX: 200, translateY: 200 };
            if (windowWidth > 720) return { translateX: 0, translateY: 200 };
            return { translateX: 0, translateY: 100 };
        }
    };

    //  Опции для чисел
    var numberOptions = {
        color: 'white',
        backgroundColor: '#103cad',
        fontSize: function () { return windowWidth > 720 ? 60 : 20; },
        padding: function () { return windowWidth > 720 ? '18 35 10 38' : '18 25 10 28'; },
        angle: 0,
        piecesSpacing: 2,
        extraSpacing: { extraX: 10, extraY: 10 },
        piecesWidth: 35,
        ty: function () { return Pieces.random(-200, 200); },
        translate: function () {
            if (windowWidth > 1120) return { translateX: -340, translateY: -180 };
            if (windowWidth > 720) return { translateX: -240, translateY: -180 };
            return { translateX: -140, translateY: -100 };
        }
    };

    //  Массив элементов для рисования с использованием фрагментов
    var items = [];
    var imagesReady = 0;
    for (var i = 0; i < slidesLength; i++) {
        // Wait for all images to load before initializing the slider and event listeners
        var slideImage = new Image();
        slideImage.onload = function () {
            if (++imagesReady == slidesLength) {
                initSlider();
                initEvents();
            }
        };

        // Выбор элементов
        items.push({ type: 'image', value: imagesEl[i], options: imageOptions });
        items.push({ type: 'text', value: textEl[i].innerText, options: textOptions });
        items.push({ type: 'text', value: i + 1, options: numberOptions });
        // Сохранение индексов
        textIndexes.push(i * 3 + 1);
        numberIndexes.push(i * 3 + 2);
        // Установка image src
        slideImage.src = imagesEl[i].src;
    }

    // Инициализация
    function initSlider() {
        // Остановка анимации
        if (piecesSlider) {
            piecesSlider.stop();
        }

        // Сохранение нового Pieces экземпляра
        piecesSlider = new Pieces({
            canvas: sliderCanvas,
            items: items,
            x: 'centerAll',
            y: 'centerAll',
            piecesSpacing: 1,
            fontFamily: ["'Helvetica Neue', sans-serif"],
            animation: {
                duration: function () { return Pieces.random(1000, 2000); },
                easing: 'easeOutQuint'
            },
        });

        // Анимация всех чисел (бесконечное вращение по часовой стрелке)
        piecesSlider.animateItems({
            items: numberIndexes,
            duration: 20000,
            angle: 360,
            loop: true
        });

        // Показ элементов
        showItems();
    }

    // Инициализация прослушивателей событий
    function initEvents() {
        // Выбор предыдущего или следующего слайда с помощью кнопок
        document.querySelector('.pieces-slider__button--prev').addEventListener('click', prevItem);
        document.querySelector('.pieces-slider__button--next').addEventListener('click', nextItem);



        // Обработка события (изменение размера)
        window.addEventListener('resize', resizeStart);
    }

    // Показ текущих элементов: изображение, текст и число
    function showItems() {
        // Показ изображений pieces
        piecesSlider.showPieces({
            items: currentImageIndex, ignore: ['tx'], singly: true, update: (anim) => {
                // Остановка фрагментов анимации на 60%, запуск новой бесконечной анимации `ty` для каждого фрагмента
                if (anim.progress > 60) {
                    var piece = anim.animatables[0].target;
                    var ty = piece.ty;
                    anime.remove(piece);
                    anime({
                        targets: piece,
                        ty: piece.h_ty < 300
                            ? [{ value: ty + 10, duration: 1000 }, { value: ty - 10, duration: 2000 }, { value: ty, duration: 1000 }]
                            : [{ value: ty - 10, duration: 1000 }, { value: ty + 10, duration: 2000 }, { value: ty, duration: 1000 }],
                        duration: 2000,
                        easing: 'linear',
                        loop: true
                    });
                }
            }
        });
        // фрагменты текста или числа, использующие альтернативные `ty` значения
        piecesSlider.showPieces({ items: currentTextIndex });
        piecesSlider.showPieces({ items: currentNumberIndex, ty: function (p, i) { return p.s_ty - [-3, 3][i % 2]; } });
    }

    // Скрыть текущие элементы: изображение, текст и номер
    function hideItems() {
        piecesSlider.hidePieces({ items: [currentImageIndex, currentTextIndex, currentNumberIndex] });
    }

    // Выбор предыдущего элемента: скрыть текущие элементы, обновить индексы и показать новый текущий элемент
    function prevItem() {
        hideItems();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : slidesLength - 1;
        updateIndexes();
        showItems();
    }

    // Выбор следующего элемента: скрыть текущие элементы, обновить индексы и показать новый текущий элемент
    function nextItem() {
        hideItems();
        currentIndex = currentIndex < slidesLength - 1 ? currentIndex + 1 : 0;
        updateIndexes();
        showItems();
    }

    // Обработка событие `изменение размера`

    var initial = true, hideTimer, resizeTimer;

    // Ожидание 300 мс, прежде чем повторно инициализировать ползунок
    function resizeStart() {
        if (initial) {
            initial = false;
            if (hideTimer) clearTimeout(hideTimer);
            sliderCanvas.classList.add('pieces-slider__canvas--hidden');
        }
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeEnd, 300);
    }

    // Завершение изменения размера, повторная инициализация ползунка
    function resizeEnd() {
        initial = true;
        windowWidth = window.innerWidth;
        initSlider();
        hideTimer = setTimeout(() => {
            sliderCanvas.classList.remove('pieces-slider__canvas--hidden');
        }, 500);
    }
})();