import './App.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Mousewheel, Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState, useRef } from 'react';
import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Header } from './components/layout/Header';
import { PortfolioItem } from './components/portfolio/PortfolioItem';
import { useDarkMode } from './hooks/useDarkMode';
import { portfolioItems, SKILLS, INTRODUCTION } from './constants/portfolio';
import { getThemeClasses, getTransitionClasses } from './utils/styles';

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const swiperRef = useRef(null);
  const theme = getThemeClasses(isDarkMode);
  const transitions = getTransitionClasses();

  const handleBackToStart = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(0);
    }
  };

  const handleSlideClick = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index + 1);
      setIsNavOpen(false);
    }
  };

  return (
    <div className={`h-screen ${theme.background} ${theme.text} ${transitions.color}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isNavOpen={isNavOpen}
        setIsNavOpen={setIsNavOpen}
      />

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
              ${theme.background} ${theme.accent} 
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
            ${theme.background} 
            backdrop-blur-sm shadow-lg
            ${theme.border}
            border-r overflow-y-auto`}
          >
            {/* Navigation Content */}
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <h2 className={`text-xl font-bold ${theme.accent} tracking-wide`}>Projects</h2>
              </div>
              <ul className="space-y-4 flex-1">
                {portfolioItems.map((item, index) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => handleSlideClick(index)}
                      className={`w-full text-left py-3 px-4 rounded-lg ${transitions.default}
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
                            group-hover:text-cyan-500 ${transitions.color}`}
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
              <div className={`mt-8 py-6 border-t ${theme.border}`}>
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
            <div className={`p-6 ${theme.card} ${transitions.color}`} role="region" aria-label="소개">
              <p className="text-3xl font-bold mb-6">
                {INTRODUCTION.title.map((line, index) => (
                  <span key={index}>{line}<br /></span>
                ))}
              </p>
              <p className="mb-4">
                {INTRODUCTION.skills.map((skill, index) => (
                  <span key={index}>{skill}<br /></span>
                ))}
              </p>
              <p className="mb-4">
                {INTRODUCTION.achievements.map((achievement, index) => (
                  <span key={index}>{achievement}<br /></span>
                ))}
              </p>
              <div className="mt-8">
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill, index) => (
                    <span key={index} className={`px-3 py-1 text-sm ${theme.tag} rounded-full ${transitions.color}`}>
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Portfolio Items */}
            <div className="space-y-4 p-4" role="list" aria-label="포트폴리오 목록">
              {portfolioItems.map((item) => (
                <PortfolioItem key={item.id} item={item} isDarkMode={isDarkMode} />
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
                <div className={`h-[calc(100%-48px)] my-6 ${theme.card} 
                  ${transitions.default} rounded-xl hover:shadow-2xl
                  ${theme.cardHover}`}
                >
                  <div className="p-8 h-full flex flex-col justify-center transform transition-transform duration-500 hover:scale-105">
                    <p className="text-3xl font-bold mb-6">
                      {INTRODUCTION.title.map((line, index) => (
                        <span key={index}>{line}<br /></span>
                      ))}
                    </p>
                    <p className="mb-4">
                      {INTRODUCTION.skills.map((skill, index) => (
                        <span key={index}>{skill}<br /></span>
                      ))}
                    </p>
                    <p className="mb-4">
                      {INTRODUCTION.achievements.map((achievement, index) => (
                        <span key={index}>{achievement}<br /></span>
                      ))}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      오른쪽으로 스크롤하여 프로젝트들을 확인해보세요.
                    </p>
                    <div className="mt-8">
                      <div className="flex gap-2 flex-wrap">
                        {SKILLS.map((skill, index) => (
                          <span key={index} className={`px-3 py-1 text-sm rounded-full ${transitions.default}
                            ${theme.tag} ${theme.tagHover}
                            hover:scale-110 cursor-pointer`}
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Desktop Portfolio Items */}
              {portfolioItems.map((item) => (
                <SwiperSlide key={item.id} virtualIndex={item.id}>
                  <div className="h-[calc(100%-48px)] my-6">
                    <PortfolioItem item={item} isDarkMode={isDarkMode} />
                  </div>
                </SwiperSlide>
              ))}

              {/* Back to Start Slide */}
              <SwiperSlide>
                <div className={`h-[calc(100%-48px)] my-6 flex items-center justify-center ${theme.card} 
                  ${transitions.default} rounded-xl`}
                >
                  <button
                    onClick={handleBackToStart}
                    className={`group flex items-center gap-2 px-4 py-3 rounded-lg
                      ${theme.button}
                      ${transitions.default} ${transitions.scale} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    aria-label="처음으로 돌아가기"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 ${transitions.transform} group-hover:-translate-x-1
                        ${theme.accent}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                    <span className={`text-sm font-medium ${transitions.color}
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
