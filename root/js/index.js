//index.js

const $label = $('.contents-container .charts .donut-col h6.des'); // 커서 레이블 참조
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
            const parent = canvas.parentElement;

            // --- (생략) 좌표 계산/클램프 로직 그대로 사용 ---
            const clientX = (event.native?.clientX ?? event.clientX);
            const clientY = (event.native?.clientY ?? event.clientY);
            const pageX = clientX + window.scrollX;
            const pageY = clientY + window.scrollY;
            const parentRect = parent.getBoundingClientRect();
            const parentLeft = parentRect.left + window.scrollX;
            const parentTop = parentRect.top + window.scrollY;
            let left = pageX - parentLeft;
            let top = pageY - parentTop;

            if ($label.is(':hidden')) {
                $label.css({ visibility: 'hidden', display: 'block' });
            }
            const labelW = $label.outerWidth();
            const labelH = $label.outerHeight();
            const parentW = parent.clientWidth;
            const parentH = parent.clientHeight;

            left = Math.min(Math.max(left, pad), parentW - labelW - pad);
            top = Math.min(Math.max(top, pad), parentH - pad);

            $label.css({ left: left + 'px', top: top + 'px' });

            if ($label.css('visibility') === 'hidden') {
                $label.css({ visibility: '', display: 'none' });
            }

            // ─────────────────────────────────────────────
            // 핵심 추가 ①: 세그먼트(인덱스 0) 위에서 커서 숨기기
            // ─────────────────────────────────────────────
            const overTargetSlice = activeElements.length && activeElements[0].index === 0;

            if (overTargetSlice) {
                $label.stop(true, true).fadeIn(200);
                canvasEl.style.cursor = 'none';     // ← 커서 숨김
            } else {
                $label.stop(true, true).fadeOut(200);
                canvasEl.style.cursor = 'default';  // ← 커서 복원
            }
        }
    }
});

// ─────────────────────────────────────────────
// 핵심 추가 ②: 차트 영역을 벗어났을 때(mouseleave) 커서/레이블 원복
//  - onHover는 영역을 완전히 벗어나면 호출되지 않을 수 있으므로 보완
// ─────────────────────────────────────────────
canvasEl.addEventListener('mouseleave', () => {
    $label.stop(true, true).fadeOut(160);  // 레이블 숨김
    canvasEl.style.cursor = 'default';     // 커서 복원
});
