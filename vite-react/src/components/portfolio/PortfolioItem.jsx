import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getThemeClasses, getTransitionClasses } from '../../utils/styles';

export const PortfolioItem = ({ item, isDarkMode }) => {
  const theme = getThemeClasses(isDarkMode);
  const transitions = getTransitionClasses();

  return (
    <div className={`h-full group rounded-lg ${theme.card} 
      ${transitions.default} hover:shadow-xl focus-within:shadow-xl
      hover:scale-[1.02] focus-within:scale-[1.02]
      ${theme.cardHover}`}
      role="listitem"
    >
      <div className="h-full block focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg">
        <div className="h-full relative overflow-hidden">
          {/* Project Number */}
          <div className={`flex items-center justify-between p-6
            ${isDarkMode ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}
            ${transitions.transform}`}
          >
            <span className="text-8xl font-bold">{item.id}</span>
          </div>
          
          <div className="h-full px-6 pb-6 flex flex-col">
            <h3 className="text-2xl font-semibold mb-4 md:min-h-[64px] transition-colors duration-300
              group-hover:text-cyan-500">{item.title}</h3>

            <div className="md:min-h-[88px]">
                <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, index) => (
                    <span 
                    key={index}
                    className={`px-3 py-1 text-sm rounded-full ${transitions.default}
                    ${theme.tag} ${theme.tagHover}
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
                    ${transitions.default} group/link
                    ${theme.button}
                    ${theme.accent} ${theme.accentHover}
                    ${transitions.scale} ${transitions.shadow}
                    focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                >
                  <span>{link.title}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`w-4 h-4 ${transitions.transform} group-hover/link:translate-x-0.5`} 
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
              <div className={`relative h-3 rounded-full overflow-hidden ${transitions.default}
                ${theme.progress}
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
  );
}; 