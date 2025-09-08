// responsive.js
// [ 1 ] 전역 변수 ////////////////////////////////////////////////////////////
// 1. 전역 변수: 화면 너비 및 브레이크포인트
// 1-1. 화면 너비 관련 변수
let currentWidth = window.innerWidth;
let maxWTab, maxWMobile;

// 1-2. 브레이크포인트 값 초기화
const initBreakpoints = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    maxWDesktop = parseInt(rootStyles.getPropertyValue('--maxW-desktop')) || '1559px';
    maxWTab = parseInt(rootStyles.getPropertyValue('--maxW-tab')) || '1439px';
    maxWMobile = parseInt(rootStyles.getPropertyValue('--maxW-mobile')) || '839px';
};

// 1-3. 페이지 로드 시 브레이크포인트 초기화
initBreakpoints();


///////////////////////////////////////////////////////////////////////////////
// [ 2 ] 전역 함수 ////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// [ 3 ] 모든 반응형 로직을 화면 너비에 따라 처리하는 단일 함수////////////////
const handleResponsiveChange = () => {
    // 현재 화면 너비 업데이트
    currentWidth = window.innerWidth;
    
    if (currentWidth <= maxWMobile) {
        // 모바일 (max-width: 839px)
        console.log("모바일 화면입니다.");

        // 모바일 실행 1. 모바일 범위 진입 감지 및 실행 상태 초기화
        if (!isCurrentlyInMobileRange) {
            console.log("모바일 범위 진입 - 상태 초기화");
            // 모바일 범위에 새로 진입했을 때 실행 상태 초기화
            aosRoadmapMobileExecuted = false;
            aosRoadmapMobileAnimationComplete = false;
            isCurrentlyInMobileRange = true;
        }

        // 모바일 실행 2. 헤더 변경
        updateScrollThreshold(320); //main 높이(360px) - 40px(적당한 값)

        // 모바일 실행 3. 버튼 이미지 변경
        $(function () {
            $('article.about .btn-wrapper .swiper-button-prev img').attr('src', 'images/btn-prev-mobile.svg');
            $('article.about .btn-wrapper .swiper-button-next img').attr('src', 'images/btn-next-mobile.svg');
        });

        // 모바일 실행 4. GSAP 애니메이션 제거
        if (window.AppConfig.killRoadmapAnimation) {
            window.AppConfig.killRoadmapAnimation();
            console.log("모바일: GSAP 애니메이션 제거");
        }

        // 모바일 실행 5. aosRoadmap(탭용) 제거 및 원상복구
        $(window).off('scroll.roadmap'); // 탭용 스크롤 이벤트 제거

        // aosRoadmap 완료 클래스 제거 (모바일에서는 aosRoadmap 사용 안함)
        $('body').removeClass('aosRoadmap-animation-complete');
        $('.road-map .content-wrap ul .box').removeClass('animation-complete');

        // aosRoadmap()에서 변경된 요소들 정리
        $(function(){
            cleanupTabletRoadmapChanges();
        });

        // 모바일 실행 6. 현재 lang이 ES일 때 태그 내부 텍스트 변경
        $(function () {
            let currentLang = $('#current-lang').text();
            if (currentLang === 'ES') {
                // 3-1. article.structure .content-wrap .wrapper .des-box p 태그 내부 텍스트 변경
                $('article.structure .content-wrap .wrapper').eq(3).find('.des-box p').text('La fundación actúa como entidad legal de la DAO, garantizando una gobernanza eficiente y la ejecución de contratos inteligentes.');
                // 3-2. article.road-map .content-wrap ul .box h3 태그 내부 텍스트 변경 (<br> 태그 삭제 버전) 
                $('article.road-map .content-wrap ul .box').eq(0).find('h3').html('Corto Plazo (1-3 meses)');
                $('article.road-map .content-wrap ul .box').eq(1).find('h3').html('Mediano Plazo (3-9 meses)');
                $('article.road-map .content-wrap ul .box').eq(2).find('h3').html('Largo Plazo (9-18 meses)');
            }
        });
        // 모바일 실행 7. .btn-wrapper 자식에 pagination 태그 추가
        $(function () {
            // 기존 페이지네이션이 없을 때만 추가 (중복 방지)
            if ($('article.about .btn-wrapper .swiper-pagination-fraction').length === 0) {
                $('article.about .btn-wrapper').
                    append('<div class="swiper-pagination swiper-pagination-fraction swiper-pagination-horizontal"><span class="swiper-pagination-current">1</span> / <span class="swiper-pagination-total">7</span></div>');
            }

            // 페이지네이션 업데이트 함수 정의 (중복 등록 방지)
            if (!window.AppConfig.updatePagination) {
                window.AppConfig.updatePagination = function () {
                    const currentSlide = this.activeIndex + 1;
                    $('.swiper-pagination-current').text(currentSlide);
                };
            }
        });
        //////////////////////////////////////////////////////////////////

        // 모바일 실행 8. article.about에 inner 클래스 추가
        $(function () {
            $('article.about').addClass('inner');
        });

        // 모바일 실행 9. article.structure에 inner 클래스 추가
        $(function () {
            $('article.structure').addClass('inner');
        });

        // 모바일 실행 10. aosRoadmapMobile() ( aosRoadmap() 모바일 버전 )
        if (!aosRoadmapMobileExecuted && !aosRoadmapMobileAnimationComplete) {
            aosRoadmapMobileExecuted = true;
            aosRoadmapMobile(); // 전역함수 호출
        }


    } else if (currentWidth <= maxWTab) {
        // 탭 (max-width: 1439px)
        console.log("탭 화면입니다.");

        // 탭 실행 1. 탭 범위 진입 감지 및 실행 상태 초기화
        if (!isCurrentlyInTabRange) {
            console.log("탭 범위 진입 - 상태 초기화");
            // 탭 범위에 새로 진입했을 때 실행 상태 초기화
            aosRoadmapExecuted = false;
            aosRoadmapAnimationComplete = false;
            isCurrentlyInTabRange = true;
        }

        // 모바일 범위에서 벗어남 감지
        if (isCurrentlyInMobileRange) {
            console.log("모바일 범위 벗어남");
            isCurrentlyInMobileRange = false;
        }

        // 탭 실행 2. 헤더 변경
        updateScrollThreshold(760);

        // 탭 실행 3. 버튼 이미지 변경
        $(function () {
            $('article.about .btn-wrapper .swiper-button-prev img').attr('src', 'images/btn-prev-tablet.svg');
            $('article.about .btn-wrapper .swiper-button-next img').attr('src', 'images/btn-next-tablet.svg');
        });
        // 탭 실행 4. GSAP 애니메이션 제거
        if (window.AppConfig.killRoadmapAnimation) {
            window.AppConfig.killRoadmapAnimation();
            console.log("모바일~태블릿: GSAP 애니메이션 제거");
          }

        // 탭 실행 5. aosRoadmapMobile() 제거 및 원상복구 (aosRoadmap 실행 전 정리)
        $(window).off('scroll.roadmapMobile'); // 모바일용 스크롤 이벤트 제거

        // aosRoadmapMobile 완료 상태 정리 (클래스 제거 방식)
        aosRoadmapMobileExecuted = false;
        aosRoadmapMobileAnimationComplete = false;
        // 클래스 제거로 모든 aosRoadmapMobile 스타일 무력화 (CSS 무력화보다 효율적)
        $('body').removeClass('aosRoadmapMobile-animation-complete');
        $('.road-map .content-wrap ul .box').removeClass('mobile-animation-complete');

        // aosRoadmapMobile()에서 변경된 모든 요소들을 원상복구
        $(function resetMobileRoadmapChanges() {
            // 3-1-1. .title-box에 원래 AOS 속성 복원
            $('article.road-map .title-box')
                .attr({
                    'data-aos': 'fade-up',
                    'data-aos-duration': '800'
                })
                .removeClass('aos-init aos-animate');

            // 3-1-2. article.road-map에서 모바일용 AOS 속성 제거
            $('article.road-map')
                .removeAttr('data-aos')
                .removeAttr('data-aos-duration')
                .removeAttr('data-aos-delay');

            // 3-1-3. .box 요소들의 모바일 스타일 제거 (배경, 애니메이션 등)
            const $boxes = $('.road-map .content-wrap ul .box');
            $boxes.each(function (index) {
                $(this)
                    .removeAttr('style') // 인라인 스타일 제거 (배경 이미지 포함)
                    .clearQueue() // jQuery 애니메이션 큐 제거
                    .stop(true, true) // 진행 중인 애니메이션 중지
                    .find('h3').removeAttr('style').clearQueue().stop(true, true).end()
                    .find('p').removeAttr('style').clearQueue().stop(true, true);
            });

            // 3-1-4. AOS 재초기화
            AOS.refreshHard();
        });

        // 탭 실행 6. aosRoadmap() : article.road-map data-aos 변경 및 .road-map이 사용자 스크롤 범위에 들어왔을 때 처리
        // 이미 실행되었거나 애니메이션이 완료된 경우 실행하지 않음
        if (!aosRoadmapExecuted && !aosRoadmapAnimationComplete) {
            aosRoadmapExecuted = true; // 실행 플래그 설정
            aosRoadmap(); // 전역함수 호출
        } // aosRoadmap 실행 조건문 종료

        // 탭 실행 7. header click이벤트
        $(function headerClickEvent() {
            $('header .btn-wrapper').on('click.headerEvent', function () {
                $('header .btn-wrapper').slideDown(500);
            });
        });

        // 탭 실행 8. 현재 lang이 ES일 때 태그 내부 텍스트 변경한 것들 복원
        $(function () {
            let currentLang = $('#current-lang').text();
            if (currentLang === 'ES') {
                // 6-1. article.structure .content-wrap .wrapper .des-box p 태그 내부 텍스트 복원
                $('article.structure .content-wrap .wrapper').eq(3).find('.des-box p').text('La fundación puede servir como la entidad legal de una DAO (Organización Autónoma Descentralizada), desempeñando un papel clave en la gobernanza y la ejecución de contratos inteligentes.');
                // 6-2. article.road-map .content-wrap ul .box h3 태그 내부 텍스트 변경 (<br> 태그 복원 버전) 
                $('article.road-map .content-wrap ul .box').eq(0).find('h3').html('Corto Plazo<br>(1-3 meses)');
                $('article.road-map .content-wrap ul .box').eq(1).find('h3').html('Mediano Plazo<br>(3-9 meses)');
                $('article.road-map .content-wrap ul .box').eq(2).find('h3').html('Largo Plazo<br>(9-18 meses)');
            }
        });

        // 탭 실행 9. .btn-wrapper 자식에 태그 제거 및 Swiper 이벤트 제거
        $(function () {
            // 페이지네이션 HTML 제거
            $('article.about .btn-wrapper').
                find('.swiper-pagination-fraction').remove();

            // 특정 이벤트 리스너만 제거 (다른 기능에 영향 없음)
            if (window.AppConfig && window.AppConfig.aboutSwiper && typeof window.AppConfig.aboutSwiper.off === 'function' && window.AppConfig.updatePagination) {
                window.AppConfig.aboutSwiper.off('slideChange', window.AppConfig.updatePagination);
                // 함수 참조도 제거
                delete window.AppConfig.updatePagination;
            }
        });

        // 탭 실행 10. article.about에 inner 클래스 제거
        $(function () {
            $('article.about').removeClass('inner');
        });


        // 탭 실행 12. article.structure에 inner 클래스 제거
        $(function () {
            $('article.structure').removeClass('inner');
        });


    } else if (currentWidth <= maxWDesktop) {
        // 데스크톱 (max-width: 1560px)
        console.log("데스크톱 화면입니다.");

        // 탭/모바일 범위에서 벗어남 감지
        if (isCurrentlyInTabRange) {
            console.log("탭 범위 벗어남");
            isCurrentlyInTabRange = false;
        }
        if (isCurrentlyInMobileRange) {
            console.log("모바일 범위 벗어남");
            isCurrentlyInMobileRange = false;
        }
        // 데스크톱 실행 1. 헤더 변경
        updateScrollThreshold(760);
        // 데스크톱 실행 2. 버튼 이미지 변경
        $(function () {
            $('article.about .btn-wrapper .swiper-button-prev img').attr('src', 'images/btn-prev-desktop.svg');
            $('article.about .btn-wrapper .swiper-button-next img').attr('src', 'images/btn-next-desktop.svg');
        });
        // 데스크톱 실행 3. 7.GSAP 애니메이션 재생성
        if (window.AppConfig.initRoadmapAnimation) {
            window.AppConfig.initRoadmapAnimation();
            console.log("desktop 이상: GSAP 애니메이션 재생성");
        }

        // 데스크톱 실행 4. aosRoadmap(), aosRoadmapMobile(), headerClickEvent() 제거
        // 기존에 등록된 aosRoadmap 이벤트들을 제거
        $(window).off('scroll.roadmap'); // 탭용 스크롤 이벤트 제거
        $(window).off('scroll.roadmapMobile'); // 모바일용 스크롤 이벤트 제거
        $('header .btn-wrapper').off('click.headerEvent'); // 헤더 클릭 이벤트 제거

        // aosRoadmap 실행 플래그 초기화 (데스크톱에서는 GSAP 사용)
        aosRoadmapExecuted = false;
        aosRoadmapAnimationComplete = false;

        // aosRoadmapMobile 실행 플래그 초기화
        aosRoadmapMobileExecuted = false;
        aosRoadmapMobileAnimationComplete = false;

        // aosRoadmap 완료 클래스 제거
        $('body').removeClass('aosRoadmap-animation-complete');
        $('.road-map .content-wrap ul .box').removeClass('animation-complete');

        // aosRoadmapMobile 완료 클래스 제거 (클래스 제거 방식으로 스타일 무력화)
        $('body').removeClass('aosRoadmapMobile-animation-complete');
        $('.road-map .content-wrap ul .box').removeClass('mobile-animation-complete');

        // aosRoadmap() 및 aosRoadmapMobile()에서 변경된 요소들 정리
        $(function cleanupTabletMobileRoadmapChanges() {
            // aosRoadmap()에서 변경된 AOS 속성 정리
            // .title-box에 원래 AOS 속성 복원
            $('article.road-map .title-box')
                .attr({
                    'data-aos': 'fade-up',
                    'data-aos-duration': '800'
                })
                .removeClass('aos-init aos-animate');

            // article.road-map에서 탭용 AOS 속성 제거 (data-aos-delay: 200 포함)
            $('article.road-map')
                .removeAttr('data-aos')
                .removeAttr('data-aos-duration')
                .removeAttr('data-aos-delay');

            // .box 요소들의 모든 변경사항 정리
            const $boxes = $('.road-map .content-wrap ul .box');
            $boxes.each(function () {
                $(this)
                    .removeAttr('style') // 인라인 스타일 제거 (배경 이미지 포함)
                    .clearQueue() // jQuery 애니메이션 큐 제거
                    .stop(true, true) // 진행 중인 애니메이션 중지
                    .find('h3').removeAttr('style').clearQueue().stop(true, true).end()
                    .find('p').removeAttr('style').clearQueue().stop(true, true);
            });

            // AOS 재초기화
            AOS.refreshHard();
        });

        // 데스크톱 실행 5. road-map 원래 상태로 복원
        $(function resetRoadmapToOriginal() {
            // .title-box에 원래 AOS 속성 복원
            $('article.road-map .title-box')
                .attr({
                    'data-aos': 'fade-up',
                    'data-aos-duration': '800'
                })
                .removeClass('aos-init aos-animate');

            // article.road-map에서 AOS 속성 제거
            $('article.road-map')
                .removeAttr('data-aos')
                .removeAttr('data-aos-duration')
                .removeAttr('data-aos-delay');

            // .box 요소들 원래 상태로 복원
            const $boxes = $('.road-map .content-wrap ul .box');
            $boxes.each(function (index) {
                $(this)
                    .removeAttr('style') // 인라인 스타일 제거
                    .find('h3').removeAttr('style').end()
                    .find('p').removeAttr('style');
            });

            // AOS 재초기화
            AOS.refreshHard();
        });

        // 데스크톱 실행 6. 현재 lang이 ES일 때 태그 내부 텍스트 변경한 것들 복원
        $(function () {
            let currentLang = $('#current-lang').text();
            if (currentLang === 'ES') {
                // 6-1. article.structure .content-wrap .wrapper .des-box p 태그 내부 텍스트 복원
                $('article.structure .content-wrap .wrapper').eq(3).find('.des-box p').text('La fundación puede servir como la entidad legal de una DAO (Organización Autónoma Descentralizada), desempeñando un papel clave en la gobernanza y la ejecución de contratos inteligentes.');
                // 6-2. article.road-map .content-wrap ul .box h3 태그 내부 텍스트 변경 (<br> 태그 복원 버전) 
                $('article.road-map .content-wrap ul .box').eq(0).find('h3').html('Corto Plazo<br>(1-3 meses)');
                $('article.road-map .content-wrap ul .box').eq(1).find('h3').html('Mediano Plazo<br>(3-9 meses)');
                $('article.road-map .content-wrap ul .box').eq(2).find('h3').html('Largo Plazo<br>(9-18 meses)');
            }
        });

        // 데스크톱 실행 7. pagination 제거
        $(function () {
            $('article.about .btn-wrapper').find('.swiper-pagination-fraction').remove();
        });

        // 데스크톱 실행 8. article.about에서 inner 클래스 제거
        $(function () {
            $('article.about').removeClass('inner');
        });

        // 데스크톱 실행 9. article.structure에서 inner 클래스 제거
        $(function () {
            $('article.structure').removeClass('inner');
        });



    } else {
        // pc : 와이드 데스크톱 (1560px 이상 ~ pc 1920px 이상 ~)
        console.log("와이드 데스크톱 화면입니다.");

        // 탭/모바일 범위에서 벗어남 감지
        if (isCurrentlyInTabRange) {
            console.log("탭 범위 벗어남");
            isCurrentlyInTabRange = false;
        }
        if (isCurrentlyInMobileRange) {
            console.log("모바일 범위 벗어남");
            isCurrentlyInMobileRange = false;
        }
        // pc 실행 1. 헤더 변경
        updateScrollThreshold(760);
        // pc 실행 2. 버튼 이미지 변경
        $('article.about .btn-wrapper .swiper-button-prev img').attr('src', 'images/btn-prev-pc.svg');
        $('article.about .btn-wrapper .swiper-button-next img').attr('src', 'images/btn-next-pc.svg');
        // pc 실행 3. 7.GSAP 애니메이션 재생성
        if (window.AppConfig.initRoadmapAnimation) {
            window.AppConfig.initRoadmapAnimation();
            console.log("PC 이상: GSAP 애니메이션 재생성");
          }

        // pc 실행 4. aosRoadmap(), aosRoadmapMobile(), headerClickEvent() 제거
        // 기존에 등록된 aosRoadmap 이벤트들을 제거
        $(window).off('scroll.roadmap'); // 탭용 스크롤 이벤트 제거
        $(window).off('scroll.roadmapMobile'); // 모바일용 스크롤 이벤트 제거
        $('header .btn-wrapper').off('click.headerEvent'); // 헤더 클릭 이벤트 제거

        // aosRoadmap 실행 플래그 초기화 (PC에서는 GSAP 사용)
        aosRoadmapExecuted = false;
        aosRoadmapAnimationComplete = false;

        // aosRoadmapMobile 실행 플래그 초기화
        aosRoadmapMobileExecuted = false;
        aosRoadmapMobileAnimationComplete = false;

        // aosRoadmap 완료 클래스 제거
        $('body').removeClass('aosRoadmap-animation-complete');
        $('.road-map .content-wrap ul .box').removeClass('animation-complete');

        // aosRoadmapMobile 완료 클래스 제거 (클래스 제거 방식으로 스타일 무력화)
        $('body').removeClass('aosRoadmapMobile-animation-complete');
        $('.road-map .content-wrap ul .box').removeClass('mobile-animation-complete');

        // aosRoadmap() 및 aosRoadmapMobile()에서 변경된 요소들 정리
        $(function cleanupTabletMobileRoadmapChanges() {
            // aosRoadmap()에서 변경된 AOS 속성 정리
            // .title-box에 원래 AOS 속성 복원
            $('article.road-map .title-box')
                .attr({
                    'data-aos': 'fade-up',
                    'data-aos-duration': '800'
                })
                .removeClass('aos-init aos-animate');

            // article.road-map에서 탭용 AOS 속성 제거 (data-aos-delay: 200 포함)
            $('article.road-map')
                .removeAttr('data-aos')
                .removeAttr('data-aos-duration')
                .removeAttr('data-aos-delay');

            // .box 요소들의 모든 변경사항 정리
            const $boxes = $('.road-map .content-wrap ul .box');
            $boxes.each(function () {
                $(this)
                    .removeAttr('style') // 인라인 스타일 제거 (배경 이미지 포함)
                    .clearQueue() // jQuery 애니메이션 큐 제거
                    .stop(true, true) // 진행 중인 애니메이션 중지
                    .find('h3').removeAttr('style').clearQueue().stop(true, true).end()
                    .find('p').removeAttr('style').clearQueue().stop(true, true);
            });

            // AOS 재초기화
            AOS.refreshHard();
        });

        // pc 실행 5. road-map 원래 상태로 복원
        $(function resetRoadmapToOriginal() {
            // .title-box에 원래 AOS 속성 복원
            $('article.road-map .title-box')
                .attr({
                    'data-aos': 'fade-up',
                    'data-aos-duration': '800'
                })
                .removeClass('aos-init aos-animate');

            // article.road-map에서 AOS 속성 제거
            $('article.road-map')
                .removeAttr('data-aos')
                .removeAttr('data-aos-duration')
                .removeAttr('data-aos-delay');

            // .box 요소들 원래 상태로 복원
            const $boxes = $('.road-map .content-wrap ul .box');
            $boxes.each(function (index) {
                $(this)
                    .removeAttr('style') // 인라인 스타일 제거
                    .find('h3').removeAttr('style').end()
                    .find('p').removeAttr('style');
            });

            // AOS 재초기화
            AOS.refreshHard();
        });

        // pc 실행 6. 현재 lang이 ES일 때 태그 내부 텍스트 변경한 것들 복원
        $(function () {
            let currentLang = $('#current-lang').text();
            if (currentLang === 'ES') {
                // 6-1. article.structure .content-wrap .wrapper .des-box p 태그 내부 텍스트 복원
                $('article.structure .content-wrap .wrapper').eq(3).find('.des-box p').text('La fundación puede servir como la entidad legal de una DAO (Organización Autónoma Descentralizada), desempeñando un papel clave en la gobernanza y la ejecución de contratos inteligentes.');
                // 6-2. article.road-map .content-wrap ul .box h3 태그 내부 텍스트 변경 (<br> 태그 복원 버전) 
                $('article.road-map .content-wrap ul .box').eq(0).find('h3').html('Corto Plazo<br>(1-3 meses)');
                $('article.road-map .content-wrap ul .box').eq(1).find('h3').html('Mediano Plazo<br>(3-9 meses)');
                $('article.road-map .content-wrap ul .box').eq(2).find('h3').html('Largo Plazo<br>(9-18 meses)');
            }
        });

        // pc 실행 7. pagination 제거
        $(function () {
            $('article.about .btn-wrapper').find('.swiper-pagination-fraction').remove();
        });

        // pc 실행 8. article.about에서 inner 클래스 제거
        $(function () {
            $('article.about').removeClass('inner');
        });

        // pc 실행 9. article.structure에서 inner 클래스 제거
        $(function () {
            $('article.structure').removeClass('inner');
        });



    }
};

// 순수 자바스크립트의 DOMContentLoaded 이벤트 리스너를 사용합니다.
// (jQuery의 $(document).ready()와 유사한 역할)
window.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 시 초기 화면 크기를 확인합니다.
    handleResponsiveChange();
});

// 창 크기가 변경될 때마다 이벤트를 처리하는 표준 'resize' 이벤트를 사용합니다.
window.addEventListener('resize', handleResponsiveChange);

