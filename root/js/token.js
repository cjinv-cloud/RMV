// token.js

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


// 도넛 차트 /////////////////////////////////////////////////
// 데이터
// 플러그인 등록
Chart.register(ChartDataLabels);

// 데이터
const data = [40, 20, 12, 10, 8, 10];
const colors = ["#80CAFF","#85E0A3","#FFD966","#FFAFA3","#FFC470","#D9B8FF"];

// 레이블 요소들 참조
const $donutNotes = {
  0: $('.donut-note-1'),
  1: $('.donut-note-2'),
  2: $('.donut-note-3'),
  3: $('.donut-note-4'),
  4: $('.donut-note-5'),
  5: $('.donut-note-6')
};

const canvasEl = document.getElementById("donut");
const pad = 12; // 화면 밖 넘침 방지용 여백

// 차트 인스턴스를 저장할 변수
let tokenChart = new Chart(canvasEl, {
  type: "doughnut",
  data: {
    datasets: [{
      data,
      backgroundColor: colors,
      borderWidth: 1
    }]
  },
  options: {
    cutout: '40%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }, // 기본 툴팁 비활성화
      datalabels: {
        // 각 조각 중앙에 배치
        anchor: 'center',
        align: 'center',
        clamp: true,
        color: '#fff',                 // 밝은 배경에서 잘 보이는 색
        // 작은 조각은 표시 생략(예: 5% 미만)
        display: (ctx) => {
          const sum = ctx.chart.data.datasets[0].data
            .reduce((a, b) => a + b, 0);
          const val = ctx.dataset.data[ctx.dataIndex];
          return (val / sum) * 100 >= 5;
        },
        // 퍼센트 포맷
        formatter: (value, ctx) => {
          const arr = ctx.chart.data.datasets[0].data;
          const sum = arr.reduce((a, b) => a + b, 0);
          const pct = (value / sum) * 100;
          return `${Math.round(pct)}%`;
        },
        // 폰트/스타일
        font: {
          family: '"Pretendard"',
          weight: '700',
          size: 24,
        },
        // 조각 색에 따라 글자색 자동 가독성 (선택)
        // color 콜백을 쓰면 조각 배경색 기준으로 밝기 판별 가능
        // color: (ctx) => getReadableTextColor(colors[ctx.dataIndex])
      }
    },
    // 호버 이벤트 추가
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
        const $currentLabel = $donutNotes[segmentIndex];

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
          Object.keys($donutNotes).forEach(key => {
            if (parseInt(key) === segmentIndex) {
              $donutNotes[key].stop(true, true).fadeIn(200);
            } else {
              $donutNotes[key].stop(true, true).fadeOut(200);
            }
          });

          // 커서 숨김
          canvasEl.style.cursor = 'none';
        }
      } else {
        // 세그먼트 밖에 있을 때 모든 레이블 숨김
        Object.values($donutNotes).forEach($label => {
          $label.stop(true, true).fadeOut(200);
        });
        canvasEl.style.cursor = 'default';
      }
    }
  }
});

// 차트 영역을 벗어났을 때 모든 레이블 숨김 및 커서 복원
canvasEl.addEventListener('mouseleave', () => {
  Object.values($donutNotes).forEach($label => {
    $label.stop(true, true).fadeOut(160);
  });
  canvasEl.style.cursor = 'default';
});


// ──────────────────────────────────────────────────────────────────────
// 도넛 차트 애니메이션 실행 (화면 진입 시)
// ──────────────────────────────────────────────────────────────────────
$(function () {
  var $donutCol = $('.token-economy .contents .donut-col');
  
  if (!$donutCol.length) return;
  
  var donutPlayed = false;
  
  // ──────────────────────────────────────────────────────────────────────
  // .donut-col이 화면에 들어오면 도넛 재생성하여 애니메이션 실행
  // ──────────────────────────────────────────────────────────────────────
  function playDonutOnce() {
    if (donutPlayed) return;
    donutPlayed = true;
    
    try { if (typeof tokenChart !== 'undefined' && tokenChart) tokenChart.destroy(); } catch (e) { }
    
    var ctx = document.getElementById("donut").getContext('2d');
    tokenChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        cutout: '40%',
        animation: { duration: 1000, easing: 'easeOutCubic' },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            anchor: 'center',
            align: 'center',
            clamp: true,
            color: '#fff',
            display: (ctx) => {
              const sum = ctx.chart.data.datasets[0].data
                .reduce((a, b) => a + b, 0);
              const val = ctx.dataset.data[ctx.dataIndex];
              return (val / sum) * 100 >= 5;
            },
            formatter: (value, ctx) => {
              const arr = ctx.chart.data.datasets[0].data;
              const sum = arr.reduce((a, b) => a + b, 0);
              const pct = (value / sum) * 100;
              return `${Math.round(pct)}%`;
            },
            font: {
              family: '"Pretendard"',
              weight: '700',
              size: 24,
            }
          }
        },
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
          const offsetX = 15;
          const offsetY = -10;
          
          let left = mouseX + offsetX;
          let top = mouseY + offsetY;

          // 세그먼트 위에 호버 중인지 확인
          if (activeElements.length > 0) {
            const segmentIndex = activeElements[0].index;
            const $currentLabel = $donutNotes[segmentIndex];

            if ($currentLabel && $currentLabel.length) {
              if ($currentLabel.is(':hidden')) {
                $currentLabel.css({ visibility: 'hidden', display: 'block' });
              }
              const labelW = $currentLabel.outerWidth();
              const labelH = $currentLabel.outerHeight();
              const parentW = parent.clientWidth;
              const parentH = parent.clientHeight;

              left = Math.min(Math.max(left, pad), parentW - labelW - pad);
              top = Math.min(Math.max(top, pad), parentH - labelH - pad);

              $currentLabel.css({ 
                left: left + 'px', 
                top: top + 'px',
                visibility: 'visible'
              });

              Object.keys($donutNotes).forEach(key => {
                if (parseInt(key) === segmentIndex) {
                  $donutNotes[key].stop(true, true).fadeIn(200);
                } else {
                  $donutNotes[key].stop(true, true).fadeOut(200);
                }
              });

              canvas.style.cursor = 'none';
            }
          } else {
            Object.values($donutNotes).forEach($label => {
              $label.stop(true, true).fadeOut(200);
            });
            canvas.style.cursor = 'default';
          }
        }
      }
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
  // IntersectionObserver (도넛 관찰)
  // ──────────────────────────────────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    var ioDonut = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { 
          playDonutOnce(); 
          ioDonut.unobserve(entry.target); 
        }
      });
    }, { root: null, rootMargin: '0px 0px -20% 0px', threshold: 0 });
    
    if ($donutCol.length) ioDonut.observe($donutCol.get(0));
    
    // 새로고침 시 이미 화면 안인 경우
    if ($donutCol.length && isInView($donutCol, 0.2)) playDonutOnce();
    
  } else {
    // 폴백: 스크롤/리사이즈 체크
    var ticking = false;
    function onScrollCheck() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          if ($donutCol.length && isInView($donutCol, 0.2)) playDonutOnce();
          ticking = false;
        });
      }
    }
    $(window).on('scroll resize', onScrollCheck);
    onScrollCheck();
  }
});

// (선택) 조각 배경색 기준으로 글자색 자동 선택하고 싶다면:
// function getReadableTextColor(hex) {
//   const c = hex.replace('#', '');
//   const r = parseInt(c.substr(0,2),16);
//   const g = parseInt(c.substr(2,2),16);
//   const b = parseInt(c.substr(4,2),16);
//   const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
//   return luminance > 0.6 ? '#111' : '#fff';
// }
