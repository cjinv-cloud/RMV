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

new Chart(document.getElementById("donut"), {
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
      tooltip: { enabled: true },
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
    }
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
