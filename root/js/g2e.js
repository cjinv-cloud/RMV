// g2e.js

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
      $('header h1 a img').attr('src', '../assets/logos/RMV-combination_dark.png');
      $('header').addClass('dark');
    } else {
      $('header h1 a img').attr('src', '../assets/logos/RMV-combination_light.png');
      $('header').removeClass('dark');
    }
  })
);

// 2. 라인 애니메이션 시작 (화면에 보일 때)
// article.community .keyword-contents::before
$(window).on('scroll', function () {
  const $keywordContents = $('article.community .keyword-contents');

  if ($keywordContents.length && !$keywordContents.hasClass('animate')) {
    const elementTop = $keywordContents.offset().top;
    const elementBottom = elementTop + $keywordContents.outerHeight();
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();

    // 요소가 화면에 보이면 animate 클래스 추가
    if (elementTop < viewportBottom && elementBottom > viewportTop) {
      $keywordContents.addClass('animate');
    }
  }
});

// 3. a태그 기능 막기
$(function () {
  $('article.walk-mode .left-contents ul.button-wrap li div.btn_name-icon-v1 a, article.community .keyword-contents ul.wrapper li div.btn_name-icon-v2 a').on('click', function (e) {
    e.preventDefault();
  });
});

// 4. 무한루프
// article.stat .contents
// g2e-infinite-down-no-gap.js
(function () {
  const container = document.querySelector('article.stat .contents');
  if (!container) return;

  const wrapper = container.querySelector(':scope > .ul-wrapper');
  if (!wrapper) return;

  // 1) 최소 3벌 보장: [U0][U1][U2]
  const ensureTriple = () => {
    let lists = Array.from(wrapper.querySelectorAll(':scope > ul'));
    if (lists.length === 0) return [];

    // 1개면 복제 2번, 2개면 복제 1번
    while (lists.length < 3) {
      wrapper.appendChild(lists[lists.length - 1].cloneNode(true));
      lists = Array.from(wrapper.querySelectorAll(':scope > ul'));
    }
    return lists;
  };

  // 2) 이미지 로딩 대기 (높이 정확 측정용)
  const waitImages = (root) => new Promise((resolve) => {
    const imgs = root.querySelectorAll('img');
    let left = imgs.length;
    if (!left) return resolve();
    imgs.forEach((img) => {
      if (img.complete) {
        if (--left === 0) resolve();
      } else {
        img.addEventListener('load', () => { if (--left === 0) resolve(); });
        img.addEventListener('error', () => { if (--left === 0) resolve(); });
      }
    });
  });

  // 3) 한 세그먼트 높이(첫 번째 UL 높이 + 첫 UL의 margin-bottom)
  const getSegmentHeight = (ulEl) => {
    const rect = ulEl.getBoundingClientRect();
    const cs = getComputedStyle(ulEl);
    const mb = parseFloat(cs.marginBottom) || 0;
    return rect.height + mb;
  };

  // 상태값
  let y = 0;                  // wrapper의 translateY(px) — 항상 [-H, 0] 범위 유지
  let speed = 30;             // px/sec (아래 방향)
  let last = 0;
  let paused = false;
  let H = 0;                  // 세그먼트 높이
  let lists = ensureTriple(); // 최소 3벌 확보

  const apply = () => {
    wrapper.style.transform = `translateY(${y}px)`;
    wrapper.style.willChange = 'transform';
  };

  // 순환 재배치: 한 세그먼트 내려가면 [U0][U1][U2] -> [U2][U0][U1]로 회전
  const rotateDown = () => {
    // 맨 앞(현재 화면 위에 있던) UL을 맨 뒤로 보내는 게 아니라,
    // 아래로 내려가는 방향에서는 "맨 뒤 UL을 앞으로 옮기는" 방식이 자연스럽습니다.
    // 하지만 우리는 y를 -H~0에 묶어두므로, y가 0을 넘기 전에 정규화로 처리:
    // y가 0 이상이 되면 y -= H 하고, DOM은 그대로 두어도 시각적으로 연속이지만
    // 더 매끄럽게 하려면 DOM을 회전시켜 wrapper의 총 높이 변화를 방지.
    // 여기서는 y 정규화에 더해, 실제 DOM도 재배치해 안정성 보강:
    const lastUl = wrapper.lastElementChild;
    wrapper.insertBefore(lastUl, wrapper.firstElementChild); // [U2][U0][U1]
    y -= H; // 재배치 만큼 보정(시각 위치 불변)
  };

  const onResize = () => {
    // 진행치(0~H) 보존하면서 H 재산정
    const progress = (y + H) % H; // y는 [-H,0]이므로 (+H)%H로 0~H-ε
    H = getSegmentHeight(lists[0]);
    // 시작을 -H + 진행치로 재설정 (여전히 [-H,0] 범위)
    y = -H + progress;
    apply();
  };

  // 호버 일시정지
  container.addEventListener('mouseenter', () => (paused = true));
  container.addEventListener('mouseleave', () => (paused = false));

  const tick = (now) => {
    if (!last) last = now;
    const dt = (now - last) / 1000;
    last = now;

    if (!paused && H > 0) {
      y += speed * dt; // 아래로 이동
      if (y >= 0) {
        // 한 세그먼트를 모두 내려왔음 → 회전 + 보정
        rotateDown();
      }
      apply();
    }
    requestAnimationFrame(tick);
  };

  (async function init() {
    await waitImages(wrapper);
    lists = ensureTriple();

    // 세그먼트 높이 계산
    H = getSegmentHeight(lists[0]);

    // 시작 위치를 -H로 설정 → 위쪽에 항상 한 세트가 대기하여 "윗 빈공간" 없음
    y = -H;
    apply();

    // 리사이즈 대응(디바운스)
    let rid;
    window.addEventListener('resize', () => {
      clearTimeout(rid);
      rid = setTimeout(() => {
        // 리스트 참조 갱신(반응형으로 DOM이 바뀌는 경우 대비)
        lists = Array.from(wrapper.querySelectorAll(':scope > ul'));
        onResize();
      }, 120);
    });

    requestAnimationFrame(tick);
  })();
})();
