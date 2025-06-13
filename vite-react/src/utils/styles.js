export const getThemeClasses = (isDarkMode) => ({
  background: isDarkMode ? 'bg-gray-900' : 'bg-white',
  text: isDarkMode ? 'text-white' : 'text-gray-900',
  card: isDarkMode ? 'bg-gray-800' : 'bg-gray-100',
  cardHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white',
  tag: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
  tagHover: isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300',
  border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
  accent: isDarkMode ? 'text-cyan-400' : 'text-cyan-600',
  accentHover: isDarkMode ? 'hover:text-cyan-300' : 'hover:text-cyan-700',
  button: isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
  progress: isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
});

export const getTransitionClasses = () => ({
  default: 'transition-all duration-300',
  transform: 'transition-transform duration-500',
  color: 'transition-colors duration-300',
  scale: 'hover:scale-105',
  shadow: 'hover:shadow-lg'
}); 