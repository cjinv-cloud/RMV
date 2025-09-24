// index.js

/*chart.js****************************************************************************************/
//색상

// 도넛 ////////////////////////////////////////////////////////////////////////////////////////////
new Chart(document.getElementById("donut"), {
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
        rotation: -135,       // 시작각: -120°
        circumference: 270,   // 300°만 그려서 60° 빈틈
        onHover: function (event, activeElements) {
            if (activeElements.length && activeElements[0].index === 0) {
                $('.contents-container .charts .donut-col h6.des').fadeIn(200);  // 300ms 페이드인
            } else {
                $('.contents-container .charts .donut-col h6.des').fadeOut(200); // 300ms 페이드아웃
            }
        }
    }

});


// 막대 ///////////////////////
new Chart(document.getElementById("bars-1"), {
    type: "bar",
    data: {
        labels: ["불면증"],
        datasets: [{
            data: [32],                // 막대 길이만 결정. 숫자 표시는 안 함
            backgroundColor: '#fff',
            borderWidth: 0,
            borderRadius: 0,
            barThickness: 73,
        }]
    },
    options: {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false             // 차트 상단의 범례(라벨) 숨김
            }
        },
        scales: {
            x: {
                max: 100,                  // X축 최대값을 100으로 설정 (퍼센트)
                display: false,            // X축 전체 숨김
                grid: {
                    display: false         // X축 격자선 숨김
                }
            },
            y: {
                display: true,             // Y축 표시 (라벨을 보여주기 위해)
                border: {
                    display: false         // Y축 축선 숨김
                },
                grid: {
                    display: false         // Y축 격자선 숨김
                },
                ticks: {
                    display: false,        // 기본 Y축 라벨 숨김
                    color: '#fff',         // 라벨 텍스트 색상
                    font: {
                        size: 28,          // 라벨 폰트 크기
                        weight: 'bold'     // 라벨 폰트 굵기
                    }
                }
            }
        },
        responsive: false,             // 반응형 비활성화
        maintainAspectRatio: false,    // 비율 고정 해제

    },
    plugins: [{
        id: 'dataLabels',                  // 커스텀 플러그인 ID
        afterDatasetsDraw: function (chart) {
            const ctx = chart.ctx;         // 캔버스 컨텍스트 가져오기

            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);

                meta.data.forEach((bar, index) => {
                    const data = dataset.data[index];

                    // 퍼센트 텍스트 스타일 설정
                    ctx.fillStyle = '#fff';        // 텍스트 색상 흰색
                    ctx.font = 'bold 28px Pretendard';  // 폰트 설정
                    ctx.textAlign = 'right';       // 텍스트 정렬을 오른쪽으로 변경
                    ctx.textBaseline = 'middle';   // 수직 정렬

                    // 차트 영역의 맨 오른쪽에서 20px 떨어진 위치에 퍼센트 표시
                    const x = chart.chartArea.right - 20;  // 차트 영역 오른쪽에서 20px 떨어진 위치
                    const y = bar.y;                       // 막대의 중앙 높이

                    ctx.fillText(data + '%', x, y); // 퍼센트 텍스트 그리기
                });
            });
        }
    }]
});

new Chart(document.getElementById("bars-2"), {
    type: "bar",
    data: {
        labels: ["우울증 지수"],
        datasets: [{
            data: [52],                // 막대 길이만 결정. 숫자 표시는 안 함
            backgroundColor: '#fff',
            borderWidth: 0,
            borderRadius: 0,
            barThickness: 73,
        }]
    },
    options: {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false             // 차트 상단의 범례(라벨) 숨김
            }
        },
        scales: {
            x: {
                max: 100,                  // X축 최대값을 100으로 설정 (퍼센트)
                display: false,            // X축 전체 숨김
                grid: {
                    display: false         // X축 격자선 숨김
                }
            },
            y: {
                display: true,             // Y축 표시 (라벨을 보여주기 위해)
                border: {
                    display: false         // Y축 축선 숨김
                },
                grid: {
                    display: false         // Y축 격자선 숨김
                },
                ticks: {
                    display: false,        // 기본 Y축 라벨 숨김
                    color: '#fff',         // 라벨 텍스트 색상
                    font: {
                        size: 28,          // 라벨 폰트 크기
                        weight: 'bold'     // 라벨 폰트 굵기
                    }
                }
            }
        },
        responsive: false,             // 반응형 비활성화
        maintainAspectRatio: false,    // 비율 고정 해제

    },
    plugins: [{
        id: 'dataLabels',                  // 커스텀 플러그인 ID
        afterDatasetsDraw: function (chart) {
            const ctx = chart.ctx;         // 캔버스 컨텍스트 가져오기

            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);

                meta.data.forEach((bar, index) => {
                    const data = dataset.data[index];

                    // 퍼센트 텍스트 스타일 설정
                    ctx.fillStyle = '#fff';        // 텍스트 색상 흰색
                    ctx.font = 'bold 28px Pretendard';  // 폰트 설정
                    ctx.textAlign = 'right';       // 텍스트 정렬을 오른쪽으로 변경
                    ctx.textBaseline = 'middle';   // 수직 정렬

                    // 차트 영역의 맨 오른쪽에서 20px 떨어진 위치에 퍼센트 표시
                    const x = chart.chartArea.right - 20;  // 차트 영역 오른쪽에서 20px 떨어진 위치
                    const y = bar.y;                       // 막대의 중앙 높이

                    ctx.fillText(data + '%', x, y); // 퍼센트 텍스트 그리기
                });
            });
        }
    }]
});

new Chart(document.getElementById("bars-3"), {
    type: "bar",
    data: {
        labels: ["범불안장애"],
        datasets: [{
            data: [66],                // 막대 길이만 결정. 숫자 표시는 안 함
            backgroundColor: '#fff',
            borderWidth: 0,
            borderRadius: 0,
            barThickness: 73,
        }]
    },
    options: {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false             // 차트 상단의 범례(라벨) 숨김
            }
        },
        scales: {
            x: {
                max: 100,                  // X축 최대값을 100으로 설정 (퍼센트)
                display: false,            // X축 전체 숨김
                grid: {
                    display: false         // X축 격자선 숨김
                }
            },
            y: {
                display: true,             // Y축 표시 (라벨을 보여주기 위해)
                border: {
                    display: false         // Y축 축선 숨김
                },
                grid: {
                    display: false         // Y축 격자선 숨김
                },
                ticks: {
                    display: false,        // 기본 Y축 라벨 숨김
                    color: '#fff',         // 라벨 텍스트 색상
                    font: {
                        size: 28,          // 라벨 폰트 크기
                        weight: 'bold'     // 라벨 폰트 굵기
                    }
                }
            }
        },
        responsive: false,             // 반응형 비활성화
        maintainAspectRatio: false,    // 비율 고정 해제

    },
    plugins: [{
        id: 'dataLabels',                  // 커스텀 플러그인 ID
        afterDatasetsDraw: function (chart) {
            const ctx = chart.ctx;         // 캔버스 컨텍스트 가져오기

            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);

                meta.data.forEach((bar, index) => {
                    const data = dataset.data[index];

                    // 퍼센트 텍스트 스타일 설정
                    ctx.fillStyle = '#fff';        // 텍스트 색상 흰색
                    ctx.font = 'bold 28px Pretendard';  // 폰트 설정
                    ctx.textAlign = 'right';       // 텍스트 정렬을 오른쪽으로 변경
                    ctx.textBaseline = 'middle';   // 수직 정렬

                    // 차트 영역의 맨 오른쪽에서 20px 떨어진 위치에 퍼센트 표시
                    const x = chart.chartArea.right - 20;  // 차트 영역 오른쪽에서 20px 떨어진 위치
                    const y = bar.y;                       // 막대의 중앙 높이

                    ctx.fillText(data + '%', x, y); // 퍼센트 텍스트 그리기
                });
            });
        }
    }]
});

