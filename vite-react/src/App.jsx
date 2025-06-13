import './App.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Mousewheel, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState, useEffect, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const portfolioItems = [
  {
    id: 13,
    title: '[하나카드] PC/MO 유지보수 및 개선',
    images: [
      {
        url: '/src/assets/images/hana_subscribe.png',
        alt: '하나카드 구독 서비스 안내 화면'
      }
    ],
    tags: ['웹뷰'],
    progress: 100,
    links: [
      {
        title: '하나카드 구독 서비스',
        url: 'https://hjseo.github.io/hanacard/subscribe_smart.html'
      }
    ]
  },
  {
    id: 12,
    title: '[하나카드] PC/MO 상시 이벤트',
    images: [
      {
        url: '/src/assets/images/hana_event8531.png',
        alt: '하나카드 복권긁기 이벤트'
      },
      {
        url: '/src/assets/images/hana_event7843.png',
        alt: '하나카드 벚꽃 이벤트'
      },
      {
        url: '/src/assets/images/hana_event7945.png',
        alt: '하나카드 트래블버킷 이벤트'
      }
    ],
    tags: ['canvas', 'Math.random', '벚꽃 휘날리기', 'animation', 'Lottie.js', 'APNG'],
    progress: 100,
    links: [
      {
        title: '복권긁기 이벤트',
        url: 'https://hjseo.github.io/hanacard/event_8531.html'
      },
      {
        title: '벚꽃 이벤트',
        url: 'https://hjseo.github.io/hanacard/event_7843.html'
      },
      {
        title: '트래블버킷 이벤트',
        url: 'https://hjseo.github.io/hanacard/event_7945.html'
      }
    ]
  },
  {
    id: 11,
    title: '[삼성화재] 멤버십 이벤트',
    images: [
      {
        url: '/src/assets/images/samsungFire1.png',
        alt: '삼성화재 멤버십 메인'
      },
      {
        url: '/src/assets/images/samsungFire2.png',
        alt: '삼성화재 멤버십 메인'
      },
      {
        url: '/src/assets/images/samsungFire3.png',
        alt: '삼성화재 멤버십 상세'
      },
    ],
    tags: ['모바일웹', 'swiper.js'],
    progress: 100,
    links: [
      {
        title: '멤버십 이벤트',
        url: 'https://hjseo.github.io/samsungFire'
      }
    ]
  },
  {
    id: 10,
    title: '[팟빵] PC/MO 유지보수 및 개선',
    images: [
      {
        url: '/src/assets/images/podbbang1.png',
        alt: '팟빵 랭킹 화면면'
      },
      {
        url: '/src/assets/images/podbbang2.png',
        alt: '팟빵 오디오북 화면'
      }
    ],
    tags: ['vue.js'],
    progress: 30,
    links: [
    ]
  },
  {
    id: 9,
    title: '[알리바바 클라우드] 사이트 구축',
    images: [
      {
        url: '/src/assets/images/alibabacloud1.png',
        alt: '알리바바 클라우드 메인'
      },
      {
        url: '/src/assets/images/alibabacloud2.png',
        alt: '알리바바 클라우드 상세'
      }
    ],
    tags: ['워드프레스', '부트스트랩', '커스텀'],
    progress: 100,
    links: [
    ]
  },
  {
    id: 8,
    title: '[클라우드 시큐리티] 사이트 구축',
    images: [
      {
        url: '/src/assets/images/cloudsecurity1.png',
        alt: '클라우드 시큐리티 메인'
      },
      {
        url: '/src/assets/images/cloudsecurity2.png',
        alt: '클라우드 시큐리티 상세'
      },
      {
        url: '/src/assets/images/cloudsecurity3.png',
        alt: '클라우드 시큐리티 상세'
      }
    ],
    tags: ['fullpage기능 구현', '워드프레스', '부트스트랩', '커스텀'],
    progress: 100,
    links: [
      {
        title: '클라우드 시큐리티 사이트',
        url: 'http://www.cloudsec.kr/'
      }
    ]
  },
  {
    id: 7,
    title: '[AWS] 클라우드 행사 안내 EDM',
    images: [
      {
        url: '/src/assets/images/aws1.png',
        alt: '클라우드 행사 안내 EDM'
      }
    ],
    tags: ['이메일', '반응형웹'],
    progress: 100,
    links: [
    ]
  },
  {
    id: 6,
    title: '[경기대학교 원격교육원] 유지보수',
    images: [
      {
        url: '/src/assets/images/kgu1.png',
        alt: '경기대학교 원격교육원 안내 팝업'
      }
    ],
    tags: ['오늘 다시 안보기(쿠키)', 'PC'],
    progress: 100,
    links: [
    ]
  },
  {
    id: 5,
    title: '[메가존] 호스팅케이알(호스팅 서비스) 리뉴얼',
    images: [
      {
        url: '/src/assets/images/hostingkr1.jpg',
        alt: '호스팅케이알 메인'
      },
      {
        url: '/src/assets/images/hostingkr2.jpg',
        alt: '호스팅케이알 상세'
      }
    ],
    tags: ['web storage(html5)', 'CSS3', '반응형웹', '워드프레스', '커스텀'],
    progress: 70,
    links: [
    ]
  },
  {
    id: 4,
    title: '[본IF(본죽)] CRM 관리자 사이트 구축',
    images: [
      {
        url: '/src/assets/images/segment1.png',
        alt: '본IF Admin 캠페인 설정'
      },
      {
        url: '/src/assets/images/segment2.png',
        alt: '본IF Admin 캠페인 설정'
      }
    ],
    tags: ['Drag&Drop', 'Sortable', 'Accordion', '#jQuery 라이브러리', '동적 기능 구현', 'jstl',],
    progress: 100,
    links: [
      {
        title: 'CRM Admin',
        url: 'https://hjseo.github.io/icignalMarketing/html/userTargeting.html'
      }
    ]
  },
  {
    id: 3,
    title: '[S-Oil e-Biz] CRM 관리자 사이트 구축',
    images: [
      {
        url: '/src/assets/images/soil1.png',
        alt: 'S-Oil e-Biz Admin 사이트'
      }
    ],
    tags: ['PC', '수정보완'],
    progress: 20,
    links: [
    ]
  },
  {
    id: 2,
    title: '[옐로마켓] 서비스/관리자 사이트 리뉴얼',
    images: [
      {
        url: '/src/assets/images/yellomarket1.png',
        alt: '옐로마켓 B2C 서비스 스토어 탭'
      },
      {
        url: '/src/assets/images/yellomarket2.png',
        alt: '옐로마켓 B2C 서비스 스탬프 탭'
      }
    ],
    tags: ['canvas', '이미지마스킹', 'jquery-tmpl으로 html재사용', '반응형'],
    progress: 100,
    links: [
      {
        title: '옐로마켓 B2C 서비스',
        url: 'https://hjseo.github.io/yellomarket/ymB2C/stamp.html'
      }
    ]
  },
  {
    id: 1,
    title: '[폴라레드] 기업 홈페이지 구축',
    images: [
      {
        url: '/src/assets/images/polared1.png',
        alt: '폴라레드 메인'
      }
    ],
    tags: ['동적 기능 구현', '스크롤 네비게이션'],
    progress: 100,
    links: [
      {
        title: '폴라레드 메인',
        url: 'https://hjseo.github.io/polared/main.html'
      }
    ]
  }
];

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  const [isNavOpen, setIsNavOpen] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    // 다크모드 설정
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBackToStart = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
    }
  };

  const handleSlideClick = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      // Introduction 슬라이드가 있으므로 index + 1
      swiperRef.current.swiper.slideTo(index + 1);
      setIsNavOpen(false); // 이동 후 사이드 네비게이션 닫기
    }
  };

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm transition-colors duration-300`} role="banner">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center" role="navigation" aria-label="메인 네비게이션">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
            <a href="javascript:;" className="focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1 flex items-center gap-2">
              <img src="/src/assets/hjs-logo.png" alt="서혜정의 포트폴리오 로고" />
              <span>Portfolio</span>
            </a>
          </h1>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {/* <a href="javascript:;" className={`hover:${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1`}>PORTFOLIO</a> */}
            <a href="javascript:;" onClick={() => alert('이름: 서혜정, 생년월일: 1992.01.23 \n기억해 주세요~')} className={`hover:${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1`}>ABOUT</a>
            <a href="javascript:;" onClick={() => alert('seohj92@gmail.com \n스팸은 안 받아요~')} className={`hover:${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1`}>CONTACT</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className={`p-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg`}
              aria-expanded={isNavOpen}
              aria-controls="mobile-menu"
              aria-label="메뉴 열기/닫기"
            >
              {isNavOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isNavOpen ? 'max-h-40' : 'max-h-0'}`}>
          <div className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex flex-col gap-2`}>
            {/* <a href="javascript:;" className={`${isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'} py-2 px-4 rounded-lg transition-colors duration-300`}>PORTFOLIO</a> */}
            <a href="javascript:;" onClick={() => alert('이름: 서혜정, 생년월일: 1992.01.23 \n기억해 주세요~')} className={`${isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'} py-2 px-4 rounded-lg transition-colors duration-300`}>ABOUT</a>
            <a href="javascript:;" onClick={() => alert('seohj92@gmail.com \n스팸은 안 받아요~')} className={`${isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'} py-2 px-4 rounded-lg transition-colors duration-300`}>CONTACT</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`h-full pt-[86px]`} role="main">
        {/* Left Navigation - Desktop */}
        <nav className={`fixed transition-all duration-300 transform hidden md:block
          ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}
          left-0 top-0 h-full pt-16 z-40`}
          role="navigation"
          aria-label="사이드 네비게이션"
          id="desktop-menu"
        >
          {/* Desktop Toggle Button */}
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)}
            className={`absolute -right-12 top-0 h-full pt-16 p-3 
              ${isDarkMode ? 'bg-gray-900 text-cyan-400' : 'bg-gray-100 text-cyan-600'} 
              rounded-r-lg shadow-lg`}
          >
            {isNavOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          <div className={`min-w-[240px] max-w-[430px] w-fit h-full py-8 px-6 
            ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-100/95'} 
            backdrop-blur-sm shadow-lg
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            border-r overflow-y-auto`}
          >
            {/* Navigation Content */}
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} tracking-wide`}>Projects</h2>
              </div>
              <ul className="space-y-4 flex-1">
                {portfolioItems.map((item, index) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => handleSlideClick(index)}
                      className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300
                        ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-white/50'}
                        group`}
                    >
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className={`text-sm font-mono flex-shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {String(item.id).padStart(2, '0')}
                          </span>
                          <span className={`font-medium truncate block flex-1
                            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                            group-hover:text-cyan-500 transition-colors duration-300`}
                          >
                            {item.title}
                          </span>
                        </div>
                        <span className={`text-sm tabular-nums flex-shrink-0
                          ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                          {item.progress}%
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-8 py-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p>© 2025 Portfolio</p>
                  <p>Frontend Developer</p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 z-30 md:hidden ${isNavOpen ? 'block' : 'hidden'}`}
          onClick={() => setIsNavOpen(false)}
        ></div>

        {/* Portfolio Section */}
        <section id="portfolio" className="h-full" aria-label="포트폴리오 섹션">
          {/* Mobile Portfolio List */}
          <div className="md:hidden h-full overflow-y-auto">
            {/* Introduction */}
            <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`} role="region" aria-label="소개">
              <p className="text-3xl font-bold mb-6">8년차 웹퍼블리셔 <br />서혜정입니다. &gt;.&lt;</p>
              <p className="mb-4">
                - 기술: HTML5, CSS3, Tailwind CSS, Javascript(ES6), jQuery, React.js <br />
                - 개발 환경: VSCode, Cursor, Git, SVN <br />
                - 디자인 협업 도구: Figma, Zeplin, Photoshop
              </p>
              <p className="mb-4">
                - <span className="font-bold">[하나카드] 웹접근성 인증마크(2024년) 획득</span> <br />
                - [한국인터넷전문가협회 주최] 웹접근성 전문 교육 수료 <br />
                - 크로스브라우징(IE7까지) 등 다양한 경험 보유 <br />
                - 재사용 가능한 컴포넌트 기반 퍼블리싱 구조 설계 경험
              </p>
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    #React.js
                  </span>
                  <span className={`px-3 py-1 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    #TailwindCSS
                  </span>
                  <span className={`px-3 py-1 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    #Animation 
                  </span>
                  <span className={`px-3 py-1 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    #반응형 
                  </span>
                  <span className={`px-3 py-1 text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full transition-colors duration-300`}>
                    #웹접근성
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Portfolio Items */}
            <div className="space-y-4 p-4" role="list" aria-label="포트폴리오 목록">
              {portfolioItems.map((item) => (
                <div 
                  key={item.id}
                  className={`group rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
                    transition-all duration-300 hover:shadow-xl focus-within:shadow-xl
                    hover:scale-[1.02] focus-within:scale-[1.02]
                    ${isDarkMode ? 'hover:bg-gray-700 focus-within:bg-gray-700' : 'hover:bg-white focus-within:bg-white'}`}
                  role="listitem"
                >
                  <div className="block focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg">
                    <div className="relative overflow-hidden">
                      {/* Project Number and Year */}
                      <div className={`flex items-center justify-between p-6
                        ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}
                        transition-transform duration-500`}
                      >
                        <span className="text-8xl font-bold">{item.id}</span>
                      </div>

                      <div className="px-6 pb-6 flex flex-col">
                        <h3 className="text-xl font-semibold mb-4 transition-colors duration-300
                          group-hover:text-cyan-500">{item.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                                ${isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-200 group-hover:bg-gray-300'}
                                hover:scale-110`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {/* Image Slider */}
                        <div className="w-full aspect-video mb-6 rounded-lg overflow-hidden">
                          <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation={{
                              hideOnClick: true,
                            }}
                            pagination={{ 
                              clickable: true,
                              dynamicBullets: true,
                              dynamicMainBullets: 3,
                            }}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true
                            }}
                            loop={item.images?.length > 1}
                            className="w-full h-full rounded-lg group-hover:shadow-lg transition-shadow duration-300"
                          >
                            {item.images?.map((image, imageIndex) => (
                              <SwiperSlide key={imageIndex}>
                                <div className="w-full h-full bg-gray-200 relative">
                                  <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                        {/* Links */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.links.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                                transition-all duration-300 group/link
                                ${isDarkMode ? 
                                  'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300' : 
                                  'bg-gray-200 hover:bg-gray-300 text-cyan-600 hover:text-cyan-700'}
                                hover:scale-105 hover:shadow-lg
                                focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                            >
                              <span>{link.title}</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                />
                              </svg>
                            </a>
                          ))}
                        </div>
                        <div className="mt-auto relative">
                          <div className={`relative h-3 rounded-full overflow-hidden transition-all duration-300
                            ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'}
                            group-hover:h-4`}
                          >
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full
                                transition-all duration-700 group-hover:scale-105 shadow-lg"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className={`absolute right-0 -top-6 text-sm font-medium
                            ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            {item.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Swiper */}
          <div className={`hidden md:block h-full relative pl-12`} role="region" aria-label="포트폴리오 슬라이더">
            <Swiper
              ref={swiperRef}
              modules={[Virtual, Mousewheel, Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              virtual
              grabCursor={true}
              mousewheel={true}
              direction="horizontal"
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="h-full select-none"
              a11y={{
                prevSlideMessage: '이전 슬라이드',
                nextSlideMessage: '다음 슬라이드',
                firstSlideMessage: '첫 번째 슬라이드',
                lastSlideMessage: '마지막 슬라이드',
                paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
              }}
            >
              {/* Introduction Slide */}
              <SwiperSlide>
                <div className={`h-[calc(100%-48px)] my-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
                  transition-all duration-300 rounded-xl hover:shadow-2xl
                  ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white'}`}
                >
                  <div className="p-8 h-full flex flex-col justify-center transform transition-transform duration-500 hover:scale-105">
                    <p className="text-3xl font-bold mb-6">8년차 웹퍼블리셔 <br />서혜정입니다. &gt;.&lt;</p>
                    <p className="mb-4">
                    - 기술: HTML5, CSS3, Tailwind CSS, Javascript(ES6), jQuery, React.js <br />
                    - 개발 환경: VSCode, Cursor, Git, SVN <br />
                    - 디자인 협업 도구: Figma, Zeplin, Photoshop
                    </p>
                    <p className="mb-4">
                      - <span className="font-bold">[하나카드] 웹접근성 인증마크(2024년) 획득</span> <br />
                      - [한국인터넷전문가협회 주최] 웹접근성 전문 교육 수료 <br />
                      - 크로스브라우징(IE7까지) 등 다양한 경험 보유 <br />
                      - 재사용 가능한 컴포넌트 기반 퍼블리싱 구조 설계 경험
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      오른쪽으로 스크롤하여 프로젝트들을 확인해보세요.
                    </p>
                    <div className="mt-8">
                      <div className="flex gap-2 flex-wrap">
                        <span className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                          hover:scale-110 cursor-pointer`}
                        >
                          #React.js
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                          hover:scale-110 cursor-pointer`}
                        >
                          #TailwindCSS
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                          hover:scale-110 cursor-pointer`}
                        >
                          #Animation
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                          hover:scale-110 cursor-pointer`}
                        >
                          #반응형
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                          hover:scale-110 cursor-pointer`}
                        >
                          #웹접근성
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Desktop Portfolio Items */}
              {portfolioItems.map((item) => (
                <SwiperSlide key={item.id} virtualIndex={item.id}>
                  <div className={`h-[calc(100%-48px)] my-6 group ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
                    transition-all duration-300 rounded-xl hover:shadow-2xl
                    hover:scale-[1.02]
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white'}`}
                  >
                    <div className="block h-full">
                      <div className="relative h-full overflow-hidden">
                        {/* Project Number and Year */}
                        <div className={`flex items-center justify-between p-6
                          ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}
                          transition-transform duration-500`}
                        >
                          <span className="text-8xl font-bold">{item.id}</span>
                        </div>

                        <div className="px-6 pb-6 flex flex-col">
                          {/* Content */}
                          <div className="flex-1 flex flex-col">
                            <h3 className="text-2xl font-semibold mb-4 min-h-[64px] transition-colors duration-300
                              group-hover:text-cyan-500">{item.title}</h3>
                            
                            <div className="min-h-[88px]">
                              <div className="flex flex-wrap gap-2 mb-6">
                                {item.tags.map((tag, index) => (
                                  <span 
                                  key={index}
                                  className={`px-3 py-1 text-sm rounded-full transition-all duration-300
                                    ${isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-200 group-hover:bg-gray-300'}
                                    hover:scale-110`}
                                    >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Image Slider */}
                            <div className="w-full aspect-video mb-6 rounded-lg overflow-hidden">
                              <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                navigation={{
                                  hideOnClick: true,
                                }}
                                pagination={{ 
                                  clickable: true,
                                  dynamicBullets: true,
                                  dynamicMainBullets: 3,
                                }}
                                autoplay={{
                                  delay: 3000,
                                  disableOnInteraction: false,
                                  pauseOnMouseEnter: true
                                }}
                                loop={item.images?.length > 1}
                                className="w-full h-full rounded-lg group-hover:shadow-lg transition-shadow duration-300"
                              >
                                {item.images?.map((image, imageIndex) => (
                                  <SwiperSlide key={imageIndex}>
                                    <div className="w-full h-full bg-gray-200 relative">
                                      <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {item.links.map((link, index) => (
                                <a
                                  key={index}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                                    transition-all duration-300 group/link
                                    ${isDarkMode ? 
                                      'bg-gray-700 hover:bg-gray-600 text-cyan-400 hover:text-cyan-300' : 
                                      'bg-gray-200 hover:bg-gray-300 text-cyan-600 hover:text-cyan-700'}
                                    hover:scale-105 hover:shadow-lg
                                    focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                                >
                                  <span>{link.title}</span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                    />
                                  </svg>
                                </a>
                              ))}
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                              <div className={`relative h-3 rounded-full overflow-hidden transition-all duration-300
                                ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'}
                                group-hover:h-4`}
                              >
                                <div 
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full
                                    transition-all duration-700 group-hover:scale-105 shadow-lg"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <span className={`absolute right-0 -top-6 text-sm font-medium
                                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                              >
                                {item.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {/* Back to Start Slide */}
              <SwiperSlide>
                <div className={`h-[calc(100%-48px)] my-6 flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} 
                  transition-all duration-300 rounded-xl`}
                >
                  <button
                    onClick={handleBackToStart}
                    className={`group flex items-center gap-2 px-4 py-3 rounded-lg
                      ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                      transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    aria-label="처음으로 돌아가기"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1
                        ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <span className={`text-sm font-medium transition-colors duration-300
                      ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      처음으로
                    </span>
                  </button>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
      </main>

    </div>
  );
}

export default App
