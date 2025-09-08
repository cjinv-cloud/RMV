// index.js

// 모든 파일 접근 가능 전역 변수 //////////////////////////////////////
// 전역 상태 관리 객체 만들기 : window.AppConfig
window.AppConfig = {
  // 4. 헤더 배경색 변경 이벤트 처리 변수
  scrollThreshold: 760, // main 높이(810px) - 50px(적당한 값)

  roadmapTl: null,          // GSAP 타임라인 저장

};


// 제이쿼리 호출 ///////////////////////////////////////////////////////////////////
$(document).ready(function () {
  // 1. 언어 변경 버튼 hover 이벤트 처리리////////////////////////////////////////////
  $('header .btn-wrapper .lang-btn-wrap').hover(function () {
    $(this).find('.lang-list').stop(true, true).slideDown(300);
  }, function () {
    $(this).find('.lang-list').stop(true, true).slideUp(300);
  });

  ////////////////////////////////////////////////////////////////////////////////////


  // 2. 언어 버튼 클릭 시 언어 변경 이벤트 처리 ////////////////////////////////////
  let currentLang;
  $('header .btn-wrapper .lang-btn-wrap .lang-list li').on('click', function (e) {
    e.preventDefault();

    //클릭된 버튼의 data-lang 속성값을 가져온다.
    currentLang = $(this).attr('data-lang');

    /* console.log('언어 변경:', currentLang); //현재 속성값 확인 콘솔 */

    // 모든 섹션 및 푸터 언어 영역을 숨기고, 선택된 언어 섹션만 표시
    //// 모든 섹션과 푸터의 언어 영역을 숨깁니다.
    $('article.lang-area, footer .lang-area').hide();
    //// 선택된 언어의 섹션과 푸터 언어 영역만 표시합니다.
    $(`article[data-lang="${currentLang}"], footer .lang-area[data-lang="${currentLang}"]`).show();


    // 현재 언어 표시 업데이트
    $('#current-lang').text(
      currentLang === 'ko' ? 'KO' :
        currentLang === 'en' ? 'US' : 'JP'
    );
  });
  ////////////////////////////////////////////////////////////////////////////////////


  // 3. 초기 언어 설정 (스페인어) //////////////////////////////////////////////////
  $('article.lang-area[data-lang="es"], footer .lang-area[data-lang="es"]').show();
  $('article.lang-area[data-lang="en"], footer .lang-area[data-lang="en"]').hide();
  $('article.lang-area[data-lang="jp"], footer .lang-area[data-lang="jp"]').hide();
  $('#current-lang').text('ES');
  /* console.log('다국어 시스템 초기화 완료!'); */



  // 4. 헤더 배경색 변경 이벤트 처리 /////////////////////////////////////////////////
  $(window).on('scroll', function () {
    let winT = $(window).scrollTop();

    if (winT > AppConfig.scrollThreshold) { // 변수 사용
      $('header .logo-wrapper h1 a img').attr('src', 'images/logo_dark.png');
      $('header').addClass('scroll-header');
    } else {
      $('header .logo-wrapper h1 a img').attr('src', 'images/logo_light.png');
      $('header').removeClass('scroll-header');
    }
  });

  // 5. article.about의 swiper //////////////////////////////////////////////////////
  // swiper 초기화 (AppConfig 네임스페이스 사용으로 충돌 방지)
  window.AppConfig.aboutSwiper = new Swiper('.swiper', {
    // Optional parameters
    loop: false, // 루프 비활성화
    
    // Fade 효과 적용
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // 슬라이드 속도 조절
    speed: 500,
    
    // 페이지네이션 업데이트 기능
    on: {
      slideChange: function () {
        const currentSlide = this.activeIndex + 1;
        $('.swiper-pagination-current').text(currentSlide);
      },
      init: function() {
        $('.swiper-pagination-total').text(this.slides.length);
        $('.swiper-pagination-current').text('1');
      }
    }
  });


  // 6. AOS 초기화 ///////////////////////////////////////////////////////////////////
  AOS.init({
    once: true,
    mirror: false
  });

  // 7. GSAP : .road-map .content-wrap ul .box 요소 애니메이션 ///////////////////////
  /*
   * 로드맵 섹션의 박스 애니메이션을 위한 함수들
   * 함수 구조
   * 1. 반응형 대응: 화면 크기에 따라 애니메이션 실행/중지를 제어하기 위함
   * 2. 메모리 관리: 불필요한 애니메이션 인스턴스를 정리하여 성능 최적화
   * 3. 재사용성: 애니메이션 초기화와 제거를 독립적인 함수로 분리하여 유지보수성 향상
   * 4. 상태 관리: 전역 객체(AppConfig)를 통해 타임라인 상태를 중앙에서 관리
   * 
   * CSS에서 .box 요소들은 기본적으로 transform: translateY(100%)로 화면 밖에 숨겨져 있고,
   * GSAP 애니메이션을 통해 y: 0으로 이동하면서 순차적으로 나타나는 효과를 구현
   */

  gsap.registerPlugin(ScrollTrigger);

  // 타임라인 생성 함수
  window.AppConfig.initRoadmapAnimation = function() {
    // 기존 타임라인 제거
    if (window.AppConfig.roadmapTl) {
      window.AppConfig.roadmapTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.AppConfig.roadmapTl = null;
    }


    // 새 타임라인 생성
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".road-map .content-wrap ul",
        start: "top bottom",
        once: true,    // 한 번만 실행
        refresh: false // 리프레시 시 재실행 방지
      }
    });



    tl.from(".road-map .content-wrap ul", { duration: 0.3 })
      .to(".road-map .content-wrap ul .box", {
        y: 0,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.5
      })
      .call(() => {
        // 모든 애니메이션이 완료된 후 실행
        console.log("🎬 GSAP roadmap 애니메이션 시작됨");
        
        // stagger 애니메이션의 총 시간 계산 (duration + stagger * (요소 개수 - 1))
        const totalDuration = 1.5 + (0.5 * 2); // 1.5초 + (0.5초 * 2개) = 2.5초
        
        setTimeout(() => {
          // 애니메이션 완료 후 CSS 상태를 영구적으로 고정
          gsap.set(".road-map .content-wrap ul .box", {
            clearProps: "transform", // GSAP transform 제거
            css: { transform: "translateY(0)" } // CSS로 최종 상태 고정
          });
          // body에 완료 클래스 추가 (실제 애니메이션 완료 후)
          document.body.classList.add('roadmap-animation-complete');
          console.log("✅ GSAP roadmap 애니메이션 완료: roadmap-animation-complete 클래스 추가");
        }, totalDuration * 1000); // 밀리초로 변환
      });

    window.AppConfig.roadmapTl = tl;
  };

  // 타임라인 제거 + 원래 상태로 리셋
  window.AppConfig.killRoadmapAnimation = function() {
    if (window.AppConfig.roadmapTl) {
      window.AppConfig.roadmapTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.AppConfig.roadmapTl = null;
    }

    gsap.set(".road-map .content-wrap ul .box", { clearProps: "all" });
  };

  // 최초 실행 (화면이 1440px 이상인 경우만 애니메이션 실행)
  if (window.innerWidth >= 1440) { // 1440px 이상에서만 실행
    if (!window.AppConfig.roadmapTl) {
      window.AppConfig.initRoadmapAnimation();
    }
  } else {
    if (window.AppConfig.roadmapTl) {
      window.AppConfig.killRoadmapAnimation();
    }
  }



});








