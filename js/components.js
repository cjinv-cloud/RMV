// components.js

// 0. AOS 초기화
AOS.init({
    duration: 800,
    delay: 200,
    once: true,
    offset: 120
});

// 1. header .lang nav.lang-list 드롭다운 메뉴
$(function () {
    // 현재 페이지의 sprite.svg 경로 찾기
    const spriteBasePath = $('header .lang .current-lang i use').attr('href').split('#')[0];
    
    $('header .lang .current-lang i').on('click', function () {
        let iconHref = $(this).find('use').attr("href");
        const currentIcon = iconHref.split('#')[1];
        
        if (currentIcon === 'fi-sr-angle-small-down') {
            $('header .lang').find('.lang-list').stop(true, true).slideDown(500);
            $(this).find('use').attr("href", spriteBasePath + "#fi-sr-angle-small-up");
        } else if (currentIcon === 'fi-sr-angle-small-up') {
            $('header .lang').find('.lang-list').stop(true, true).slideUp(500);
            $(this).find('use').attr("href", spriteBasePath + "#fi-sr-angle-small-down");
        }
    });
});


// 2. header 스크롤에 따른 숨김/표시 (드롭다운 & 업)
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    
    // 현재 페이지의 sprite.svg 경로 찾기
    const $iconUse = $('header .lang .current-lang i use');
    const spriteBasePath = $iconUse.attr('href') ? $iconUse.attr('href').split('#')[0] : 'public/sprite.svg';

    let lastY = window.pageYOffset;
    let state = 'shown';     // 'shown' | 'hidden'
    const threshold = 6;     // 미세 흔들림 무시
    const forceShowAtTop = true; // 맨 위로 돌아오면 항상 표시(원치 않으면 false)

    window.addEventListener('scroll', function () {
        const y = window.pageYOffset;
        const dy = y - lastY;

        // 미세 스크롤 무시
        if (Math.abs(dy) < threshold) { lastY = y; return; }

        // 페이지 최상단에서는 항상 표시(옵션)
        if (forceShowAtTop && y <= 0 && state !== 'shown') {
            header.classList.remove('is-hidden');
            state = 'shown';
            lastY = y;
            return;
        }

        if (dy > 0) {
            // 아래로 스크롤 시작 → 처음에만 숨김
            if (state === 'shown') {
                // 언어 선택 드롭다운이 열려있으면 닫기
                const $langList = $('header .lang').find('.lang-list');
                if ($langList.is(':visible')) {
                    $langList.stop(true, true).slideUp(300);
                    $('header .lang .current-lang i use').attr("href", spriteBasePath + "#fi-sr-angle-small-down");
                }
                header.classList.add('is-hidden');
                state = 'hidden';
            }
        } else {
            // 위로 스크롤 시작 → 처음에만 표시
            if (state === 'hidden') {
                header.classList.remove('is-hidden');
                state = 'shown';
            }
        }

        lastY = y;
    }, { passive: true });
});





