(function () {
    'use strict';

    var header = document.querySelector('.site_header');
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.site_nav');

    function closeMenu() {
        header.classList.remove('is_open');
        burger.setAttribute('aria-expanded', 'false');
    }

    if (burger && header) {
        burger.addEventListener('click', function () {
            var open = header.classList.toggle('is_open');
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    if (nav) {
        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) closeMenu();
        });
    }

    // Тень шапки при прокрутке
    function onScroll() {
        if (!header) return;
        header.classList.toggle('is_scrolled', window.scrollY > 10);
        if (header.classList.contains('is_open')) closeMenu();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Анимация угольков в hero (поднимаются снизу вверх)
    var embers = document.querySelector('.hero_embers');
    if (embers && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var COUNT = 28;
        for (var i = 0; i < COUNT; i++) {
            var e = document.createElement('span');
            e.className = 'ember';
            var size = 3 + Math.random() * 6;
            e.style.left = (Math.random() * 100) + '%';
            e.style.width = size + 'px';
            e.style.height = size + 'px';
            e.style.setProperty('--drift', (Math.random() * 90 - 45) + 'px');
            var dur = 4 + Math.random() * 5;
            e.style.animationDuration = dur.toFixed(2) + 's';
            e.style.animationDelay = (-Math.random() * dur).toFixed(2) + 's';
            embers.appendChild(e);
        }
    }

    // Слайдер «Наши клиенты»
    var track = document.querySelector('.clients_track');
    var prev = document.querySelector('.clients_prev');
    var next = document.querySelector('.clients_next');
    if (track && prev && next) {
        var anim = null;
        function maxScroll() { return track.scrollWidth - track.clientWidth; }
        function advanceOf() {
            var cards = track.querySelectorAll('.client_item');
            if (!cards.length) return track.clientWidth || 1;
            return cards[1] ? (cards[1].offsetLeft - cards[0].offsetLeft) : cards[0].offsetWidth;
        }
        function step() {
            var advance = advanceOf();
            var per = Math.floor(track.clientWidth * 0.8 / advance);
            return Math.max(advance, per * advance);
        }
        function animateTo(target) {
            target = Math.max(0, Math.min(target, maxScroll()));
            var start = track.scrollLeft, dist = target - start;
            if (anim) clearInterval(anim);
            if (Math.abs(dist) < 1) { track.scrollLeft = target; return; }
            var t0 = Date.now(), dur = 420;
            anim = setInterval(function () {
                var p = Math.min(1, (Date.now() - t0) / dur);
                var e = 0.5 - Math.cos(p * Math.PI) / 2;
                track.scrollLeft = start + dist * e;
                if (p >= 1) { clearInterval(anim); anim = null; }
            }, 16);
        }
        function atEnd() { return track.scrollLeft >= maxScroll() - 4; }
        function atStart() { return track.scrollLeft <= 4; }

        // Авто-прокрутка с паузой при наведении; стрелки отключают её насовсем
        var autoplay = true;
        var timer = setInterval(tick, 3000);
        function tick() { animateTo(atEnd() ? 0 : track.scrollLeft + step()); }
        function pause() { clearInterval(timer); }
        function resume() { if (!autoplay) return; clearInterval(timer); timer = setInterval(tick, 3000); }
        function disableAutoplay() { autoplay = false; clearInterval(timer); }

        prev.addEventListener('click', function () {
            disableAutoplay();
            animateTo(atStart() ? maxScroll() : track.scrollLeft - step());
        });
        next.addEventListener('click', function () {
            disableAutoplay();
            animateTo(atEnd() ? 0 : track.scrollLeft + step());
        });

        track.addEventListener('mouseenter', pause);
        track.addEventListener('mouseleave', resume);
        track.addEventListener('touchstart', pause, { passive: true });

        // При изменении ширины экрана — снова выровнять на ближайшую карточку
        var resizeTO;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTO);
            resizeTO = setTimeout(function () {
                var adv = advanceOf();
                track.scrollLeft = Math.round(track.scrollLeft / adv) * adv;
            }, 150);
        });
    }

    // Заглушка отправки статической формы (в проде — Contact Form 7)
    var form = document.querySelector('.contact_form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var submit = form.querySelector('.form_submit');
            if (submit) submit.value = 'Заявка отправлена ✓';
            form.reset();
        });
    }
})();
