import { getThemeClasses, getTransitionClasses } from '../../utils/styles';

export const Header = ({ isDarkMode, toggleDarkMode, isNavOpen, setIsNavOpen }) => {
  const theme = getThemeClasses(isDarkMode);
  const transitions = getTransitionClasses();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm ${transitions.color}`} role="banner">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center" role="navigation" aria-label="메인 네비게이션">
        <h1 className={`text-2xl font-bold ${theme.accent}`}>
          <a href="javascript:;" className="focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1 flex items-center gap-2">
            <img src="/react-project/images/hjs-logo.png" alt="서혜정의 포트폴리오 로고" />
            <span>Portfolio</span>
          </a>
        </h1>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} ${transitions.color} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
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
          <a href="javascript:;" onClick={() => alert('이름: 서혜정, 생년월일: 1992.01.23 \n기억해 주세요~')} className={`hover:${theme.accent} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1`}>ABOUT</a>
          <a href="javascript:;" onClick={() => alert('seohj92@gmail.com \n스팸은 안 받아요~')} className={`hover:${theme.accent} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg px-2 py-1`}>CONTACT</a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} ${transitions.color} focus:outline-none focus:ring-2 focus:ring-cyan-500`}
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
            className={`p-2 ${theme.accent} focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg`}
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
      <div className={`md:hidden overflow-hidden ${transitions.default} ${isNavOpen ? 'max-h-40' : 'max-h-0'}`}>
        <div className={`px-4 py-2 ${theme.card} flex flex-col gap-2`}>
          <a href="javascript:;" onClick={() => alert('이름: 서혜정, 생년월일: 1992.01.23 \n기억해 주세요~')} className={`${isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'} py-2 px-4 rounded-lg ${transitions.color}`}>ABOUT</a>
          <a href="javascript:;" onClick={() => alert('seohj92@gmail.com \n스팸은 안 받아요~')} className={`${isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'} py-2 px-4 rounded-lg ${transitions.color}`}>CONTACT</a>
        </div>
      </div>
    </header>
  );
}; 