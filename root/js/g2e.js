// g2e.js

// 모든 파일 접근 가능 전역 변수 //////////////////////////////////////
// 전역 상태 관리 객체 만들기 : window.AppConfig
window.AppConfig = {
  scrollThreshold: 840
};

// 헤더 배경색 변경 이벤트 처리 /////////////////////////////////////////////////
$(
  $(window).on('scroll', function () {
    let winT = $(window).scrollTop();

    if (winT > AppConfig.scrollThreshold) { // 변수 사용
      $('header h1 a img').attr('src', '../assets/logos/RMV-combination_dark.png');
      $('header').addClass('dark');
    } else {
      $('header h1 a img').attr('src', '../assets/logos/RMV-combination_light.png');
      $('header').removeClass('dark');
    }
  })
);

