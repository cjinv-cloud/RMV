//index.js

// 모든 파일 접근 가능 전역 변수 //////////////////////////////////////
// 전역 상태 관리 객체 만들기 : window.AppConfig
window.AppConfig = {
  scrollThreshold: 840
};

// 1. 헤더 배경색 변경 이벤트 처리 /////////////////////////////////////////////////
// header h1 a img
$(
  $(window).on('scroll', function () {
    let winT = $(window).scrollTop();

    if (winT > AppConfig.scrollThreshold) { // 변수 사용
      $('header').addClass('dark');
    } else {
      $('header').removeClass('dark');
    }
  })
);

// 2. 도넛 차트 ////////////////////////////////////////////////////////////////
// 레이블 요소들 참조
const $des1 = $('.contents-container .charts .donut-col h6.des-1'); // 60% 영역 레이블
const $des2 = $('.contents-container .charts .donut-col h6.des-2'); // 40% 영역 레이블
const $donutLabels = {
  0: $des1,  // 세그먼트 0 (60%) → des-1
  1: $des2   // 세그먼트 1 (40%) → des-2
};

const pad = 12; // 화면 밖 넘침 방지용 여백
const canvasEl = document.getElementById("donut"); // ← 캔버스 엘리먼트 참조 (커서 토글용)

const chart = new Chart(canvasEl, {
  type: "doughnut",
  data: {
    datasets: [{
      data: [60, 40],
      backgroundColor: ["#fff", "rgba(255,255,255,.25)"],
      borderWidth: 0
    }]
  },
  options: {
    cutout: '50%',
    rotation: -135,
    circumference: 270,

    // Chart.js v4 서명: onHover(event, activeElements, chart)
    onHover: function (event, activeElements, chart) {
      const canvas = chart.canvas;
      const parent = canvas.parentElement; // .donut-wrap

      // 마우스 좌표 계산 (canvas 기준)
      const rect = canvas.getBoundingClientRect();
      const clientX = (event.native?.clientX ?? event.clientX);
      const clientY = (event.native?.clientY ?? event.clientY);
      
      // canvas 내에서의 상대 좌표
      let mouseX = clientX - rect.left;
      let mouseY = clientY - rect.top;
      
      // 커서 오른쪽에 레이블 위치 (오프셋 추가)
      const offsetX = 15; // 커서 오른쪽으로 15px
      const offsetY = -10; // 커서 위쪽으로 약간
      
      let left = mouseX + offsetX;
      let top = mouseY + offsetY;

      // 세그먼트 위에 호버 중인지 확인
      if (activeElements.length > 0) {
        const segmentIndex = activeElements[0].index;
        const $currentLabel = $donutLabels[segmentIndex];

        if ($currentLabel && $currentLabel.length) {
          // 레이블 크기 계산
          if ($currentLabel.is(':hidden')) {
            $currentLabel.css({ visibility: 'hidden', display: 'block' });
          }
          const labelW = $currentLabel.outerWidth();
          const labelH = $currentLabel.outerHeight();
          const parentW = parent.clientWidth;
          const parentH = parent.clientHeight;

          // 화면 밖으로 나가지 않도록 제한
          left = Math.min(Math.max(left, pad), parentW - labelW - pad);
          top = Math.min(Math.max(top, pad), parentH - labelH - pad);

          $currentLabel.css({ 
            left: left + 'px', 
            top: top + 'px',
            visibility: 'visible'
          });

          // 현재 세그먼트 레이블만 표시하고 나머지는 숨김
          Object.keys($donutLabels).forEach(key => {
            if (parseInt(key) === segmentIndex) {
              $donutLabels[key].stop(true, true).fadeIn(200);
            } else {
              $donutLabels[key].stop(true, true).fadeOut(200);
            }
          });

          // 커서 숨김
          canvasEl.style.cursor = 'none';
        }
      } else {
        // 세그먼트 밖에 있을 때 모든 레이블 숨김
        Object.values($donutLabels).forEach($label => {
          $label.stop(true, true).fadeOut(200);
        });
        canvasEl.style.cursor = 'default';
      }
    }
  }
});

// 차트 영역을 벗어났을 때 모든 레이블 숨김 및 커서 복원
canvasEl.addEventListener('mouseleave', () => {
  Object.values($donutLabels).forEach($label => {
    $label.stop(true, true).fadeOut(160);
  });
  canvasEl.style.cursor = 'default';
});




// 3. 도넛차트, 막대차트 조정////////////////////////////////////////////////
// .about-us .contents-container .inner .charts
$(function () {
  var $charts = $('.about-us .contents-container .inner .charts');
  var $donutCol = $charts.find('.donut-col');
  var $barsCol = $charts.find('.bars-col');

  if (!$charts.length) return;

  var donutPlayed = false;
  var barsPlayed = false;

  // ──────────────────────────────────────────────────────────────────────
  // 구현 1) .donut-col이 화면에 들어오면 도넛 재생성하여 애니메이션 실행
  // ──────────────────────────────────────────────────────────────────────
  function playDonutOnce() {
    if (donutPlayed) return;
    donutPlayed = true;

    try { if (typeof chart !== 'undefined' && chart) chart.destroy(); } catch (e) { }

    var ctx = document.getElementById("donut").getContext('2d');
    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [60, 40],
          backgroundColor: ["#fff", "rgba(255,255,255,.25)"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '50%',
        rotation: -135,
        circumference: 270,
        animation: { duration: 1000, easing: 'easeOutCubic' },
        onHover: function (event, activeElements, chartInstance) {
          const canvas = chartInstance.canvas;
          const parent = canvas.parentElement; // .donut-wrap

          // 마우스 좌표 계산 (canvas 기준)
          const rect = canvas.getBoundingClientRect();
          const clientX = (event.native?.clientX ?? event.clientX);
          const clientY = (event.native?.clientY ?? event.clientY);
          
          // canvas 내에서의 상대 좌표
          let mouseX = clientX - rect.left;
          let mouseY = clientY - rect.top;
          
          // 커서 오른쪽에 레이블 위치 (오프셋 추가)
          const offsetX = 15; // 커서 오른쪽으로 15px
          const offsetY = -10; // 커서 위쪽으로 약간
          
          let left = mouseX + offsetX;
          let top = mouseY + offsetY;

          const pad = 12;

          // 세그먼트 위에 호버 중인지 확인
          if (activeElements.length > 0) {
            const segmentIndex = activeElements[0].index;
            const $currentLabel = $donutLabels[segmentIndex];

            if ($currentLabel && $currentLabel.length) {
              // 레이블 크기 계산
              if ($currentLabel.is(':hidden')) {
                $currentLabel.css({ visibility: 'hidden', display: 'block' });
              }
              const labelW = $currentLabel.outerWidth();
              const labelH = $currentLabel.outerHeight();
              const parentW = parent.clientWidth;
              const parentH = parent.clientHeight;

              // 화면 밖으로 나가지 않도록 제한
              left = Math.min(Math.max(left, pad), parentW - labelW - pad);
              top = Math.min(Math.max(top, pad), parentH - labelH - pad);

              $currentLabel.css({ 
                left: left + 'px', 
                top: top + 'px',
                visibility: 'visible'
              });

              // 현재 세그먼트 레이블만 표시하고 나머지는 숨김
              Object.keys($donutLabels).forEach(key => {
                if (parseInt(key) === segmentIndex) {
                  $donutLabels[key].stop(true, true).fadeIn(200);
                } else {
                  $donutLabels[key].stop(true, true).fadeOut(200);
                }
              });

              // 커서 숨김
              canvas.style.cursor = 'none';
            }
          } else {
            // 세그먼트 밖에 있을 때 모든 레이블 숨김
            Object.values($donutLabels).forEach($label => {
              $label.stop(true, true).fadeOut(200);
            });
            canvas.style.cursor = 'default';
          }
        }
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // 구현 2) .bars-col이 화면에 들어오면, 각 li의 h4 > .white-bar 를
  //        0% → 해당 li의 p.per(예: "32%")까지 퍼센트로 애니메이션
  // ──────────────────────────────────────────────────────────────────────
  function playBarsOnce() {
    if (barsPlayed) return;
    barsPlayed = true;

    var $items = $barsCol.find('.wrapper .bar-box');

    // 안전 초기화 (CSS에서도 width:0이지만 한번 더 명시)
    $items.find('h4 .white-bar').css('width', 0);

    function parsePercent($li) {
      var txt = $li.find('p.per').text();
      var m = txt.match(/(\d+(?:\.\d+)?)\s*%/);
      return m ? (m[1] + '%') : '100%';
    }

    $items.each(function (i) {
      var $li = $(this);
      var $bar = $li.find('h4 .white-bar');
      var goal = parsePercent($li); // 예: '32%'

      // 약간의 스태거(선택)
      $bar.stop(true).delay(i * 80).animate({ width: goal }, 900, 'swing');
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // 뷰포트 진입 판정 (폴백용)
  // ──────────────────────────────────────────────────────────────────────
  function isInView($el, offsetRatio) {
    var offset = (offsetRatio || 0) * $(window).height();
    var winTop = $(window).scrollTop();
    var winBottom = winTop + $(window).height();
    var elTop = $el.offset().top;
    var elBottom = elTop + $el.outerHeight();
    return (elTop < winBottom - offset) && (elBottom > winTop + offset);
  }

  // ──────────────────────────────────────────────────────────────────────
  // IntersectionObserver (도넛/바 각각 관찰)
  // ──────────────────────────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    var ioDonut = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { playDonutOnce(); ioDonut.unobserve(entry.target); }
      });
    }, { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0 });

    var ioBars = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { playBarsOnce(); ioBars.unobserve(entry.target); }
      });
    }, { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0 });

    if ($donutCol.length) ioDonut.observe($donutCol.get(0));
    if ($barsCol.length) ioBars.observe($barsCol.get(0));

    // 새로고침 시 이미 화면 안인 경우
    if ($donutCol.length && isInView($donutCol, 0.2)) playDonutOnce();
    if ($barsCol.length && isInView($barsCol, 0.2)) playBarsOnce();

  } else {
    // 폴백: 스크롤/리사이즈 체크
    var ticking = false;
    function onScrollCheck() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          if ($donutCol.length && isInView($donutCol, 0.2)) playDonutOnce();
          if ($barsCol.length && isInView($barsCol, 0.2)) playBarsOnce();
          ticking = false;
        });
      }
    }
    $(window).on('scroll resize', onScrollCheck);
    onScrollCheck();
  }
});

