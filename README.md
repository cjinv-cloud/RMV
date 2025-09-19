# PROJECT INFO
## 이름 : RememVers
## 종류 : website

## 📁 ROOT 폴더 구조도

```
root/
├── package.json                  # 프로젝트 설정 및 의존성
├── package-lock.json            # 의존성 잠금 파일
├── svgo.config.json             # SVG 최적화 설정
├── node_modules/                # npm 패키지들
├── css/                         # 스타일시트
│   ├── style.css                # 메인 스타일
│   ├── reset.css                # CSS 리셋
│   ├── components.css           # 컴포넌트 스타일
│   ├── responsive.css           # 반응형 스타일
│   ├── index.css                # 인덱스 전용 스타일
│   └── font/                    # 폰트 파일들
│       ├── stylesheet.css       # 폰트 스타일시트
│       ├── Pretendard-*.woff2   # Pretendard 폰트 (한글)
│       └── PretendardJP-*.woff2 # PretendardJP 폰트 (일본어)
├── js/                          # JavaScript 파일
│   ├── index.js                 # 메인 스크립트
│   └── responsive.js            # 반응형 처리
├── lib/                         # 외부 라이브러리
│   ├── jquery-3.7.1.min.js     # jQuery
│   ├── aos.js & aos.css         # AOS 애니메이션
│   ├── swiper-bundle.min.js     # Swiper 슬라이더
│   ├── jquery.waypoints.min.js  # Waypoints
│   └── gsap/                    # GSAP 라이브러리
│       ├── gsap.min.js          # GSAP 코어
│       └── ScrollTrigger.min.js # 스크롤 트리거
├── assets/                      # 리소스 파일
│   ├── icons/                   # 아이콘 파일들
│   ├── logos/                   # 로고 파일들
│   ├── images/                  # 이미지 파일들
│   └── videos/                  # 비디오 파일들
├── ko/                          # 한국어 페이지
│   └── index.html               # 한국어 메인 페이지
├── en/                          # 영어 페이지 (준비중)
└── jp/                          # 일본어 페이지 (준비중)

```

## 📋 기술 스택
### Frontend
- **HTML5** : 웹 페이지 구조 및 시맨틱 마크업
- **CSS3** : 스타일링, 반응형 디자인, CSS Grid/Flexbox
- **JavaScript (ES6+)** : 인터랙션 및 동적 기능

### 라이브러리 & 프레임워크
- **jQuery 3.7.1** : DOM 조작 및 이벤트 처리
- **GSAP** : 고급 애니메이션 및 ScrollTrigger
- **AOS (Animate On Scroll)** : 스크롤 기반 애니메이션
- **Swiper** : 터치 슬라이더 및 캐러셀
- **Waypoints** : 스크롤 위치 감지

### 폰트 & 타이포그래피
- **Pretendard** : 한국어 웹폰트
- **PretendardJP** : 일본어 웹폰트
- **Quicksand** : 영문 포인트 폰트 (Google Fonts)

### 다국어 지원
- **한국어 (ko)** : 기본 언어
- **영어 (en)** : 준비중
- **일본어 (jp)** : 준비중

## 🛠️ 개발 도구 & 빌드 시스템
- **Node.js & npm** : 패키지 관리 및 개발 환경
- **SVGO** : SVG 파일 최적화 (v4.0.0)
- **svgstore-cli** : SVG 스프라이트 생성 (v2.0.1)
- **Git** : 버전 관리