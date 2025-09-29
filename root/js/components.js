// components.js
// 1. header .lang 드롭다운 메뉴
$('header .lang').hover(function () {
    $(this).find('.lang-list').stop(true, true).slideDown(500);
}, function () {
    $(this).find('.lang-list').stop(true, true).slideUp(500);
});