import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronLeft, ChevronRight, Swords, Shield, Zap, Users, Leaf, Cpu, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, GameData, NewsItem } from '../lib/db';

const IconMap = {
  Leaf,
  Cpu,
  Skull
};

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const [gameData, setGameData] = useState<GameData>(db.getGameData());
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    setGameData(db.getGameData());
    setNews(db.getNews());

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const squadClasses = [
    {
      name: "Пехота",
      icon: Shield,
      description: "Ближнебойные отряды с высокой защитой и способностью удерживать позиции. Специализируются на контроле территории и защите союзных отрядов.",
      color: "from-amber-600 to-amber-800"
    },
    {
      name: "Стрелки",
      icon: Swords,
      description: "Дальнобойные отряды с высоким уроном, но низкой защитой. Требуют позиционирования и защиты от союзников для эффективного действия.",
      color: "from-red-700 to-red-900"
    },
    {
      name: "Магия",
      icon: Zap,
      description: "Специализированные отряды с уникальными способностями поддержки, контроля и урона по площади. Имеют сложные механики применения заклинаний.",
      color: "from-purple-700 to-purple-900"
    },
    {
      name: "Кавалерия",
      icon: Users,
      description: "Мобильные отряды для быстрых атак и маневрирования. Специализируются на фланговых ударах и преследовании отступающего противника.",
      color: "from-blue-700 to-blue-900"
    }
  ];

  const nextImage = () => {
    if (gameData.screenshots.length === 0) return;
    setCurrentImage((prev) => (prev + 1) % gameData.screenshots.length);
  };

  const prevImage = () => {
    if (gameData.screenshots.length === 0) return;
    setCurrentImage((prev) => (prev - 1 + gameData.screenshots.length) % gameData.screenshots.length);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white" id="home">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-md border-b border-amber-900/30' : 'bg-transparent'
      }`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-xl border border-amber-500/50 shadow-lg shadow-amber-900/20">
                <span className="text-black">T</span>
              </div>
              <span className="text-2xl font-black tracking-wider hidden sm:block text-amber-100 drop-shadow-lg">TRIGLAV</span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider font-bold">
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-amber-500 transition duration-300">Главная</a>
              <a href="#factions" onClick={(e) => handleNavClick(e, 'factions')} className="hover:text-amber-500 transition duration-300">Фракции</a>
              <a href="#squads" onClick={(e) => handleNavClick(e, 'squads')} className="hover:text-amber-500 transition duration-300">Отряды</a>
              <a href="#news" onClick={(e) => handleNavClick(e, 'news')} className="hover:text-amber-500 transition duration-300">Новости</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 border border-amber-600 hover:bg-amber-600/20 transition text-sm uppercase tracking-wider font-bold text-amber-500 hover:text-white"
              >
                Войти
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition text-sm uppercase tracking-wider font-bold shadow-lg shadow-amber-900/40 text-white"
              >
                Регистрация
              </button>
            </div>

            <button 
              className="md:hidden text-amber-500 hover:text-amber-400 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-6 pb-6 border-t border-amber-900/30 pt-6 bg-black/95 absolute left-0 w-full px-4 border-b">
              <div className="flex flex-col space-y-4 text-sm uppercase tracking-wider font-bold">
                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-amber-500 transition">Главная</a>
                <a href="#factions" onClick={(e) => handleNavClick(e, 'factions')} className="hover:text-amber-500 transition">Фракции</a>
                <a href="#squads" onClick={(e) => handleNavClick(e, 'squads')} className="hover:text-amber-500 transition">Отряды</a>
                <a href="#news" onClick={(e) => handleNavClick(e, 'news')} className="hover:text-amber-500 transition">Новости</a>
                <hr className="border-amber-900/30" />
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 border border-amber-600 hover:bg-amber-600/20 transition text-center text-amber-500"
                >
                  Войти
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-center text-white"
                >
                  Регистрация
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-black"></div>
          {/* Animated Background Effect */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/20 via-transparent to-amber-950/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.08) 0%, transparent 60%)'
          }}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-20">
          <div className="mb-8 inline-block animate-fade-in-down">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-6xl md:text-7xl border-4 border-amber-500/50 shadow-2xl shadow-amber-600/20 transform rotate-45 mb-10 mt-4">
              <span className="text-black transform -rotate-45">T</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter drop-shadow-2xl">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              {gameData.name}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-amber-100 mb-6 font-light tracking-wide uppercase">
            {gameData.tagline}
          </p>

          <p className="text-2xl md:text-3xl font-bold text-white mb-10 tracking-wide max-w-3xl mx-auto">
            {gameData.slogan}
          </p>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            {gameData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 transition text-lg font-bold uppercase tracking-wider border border-red-700 shadow-xl shadow-red-900/30 transform hover:scale-105 duration-200"
            >
              Начать играть
            </button>
            <button className="w-full sm:w-auto px-12 py-5 border-2 border-amber-600 hover:bg-amber-600/10 transition text-lg font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400">
              Смотреть трейлер
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-amber-500 opacity-70" />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-24 px-4 border-t border-amber-900/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white uppercase">
              Об игре
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            {gameData.features.map((feature, index) => (
              <div key={index} className="group cursor-pointer bg-gray-950/50 p-4 border border-gray-800 hover:border-amber-900/50 transition duration-300">
                <div className="relative overflow-hidden mb-6 border-2 border-amber-900/30">
                  <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-500 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factions Section */}
      <section id="factions" className="bg-black py-24 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase text-white">
              Три великие фракции
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-red-900 mx-auto mb-8"></div>
            <p className="max-w-2xl mx-auto text-gray-400">
              Выбери свою сторону в вечном конфликте. Каждая фракция обладает уникальной философией, эстетикой и боевым стилем.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gameData.factions.map((faction) => {
              const Icon = IconMap[faction.iconName] || Shield;
              return (
                <div 
                  key={faction.id}
                  className={`group cursor-pointer bg-gray-900/80 border-2 ${faction.borderColor} hover:-translate-y-2 transition duration-300 shadow-2xl`}
                >
                  <div className="relative overflow-hidden h-80">
                    <img src={faction.image} alt={faction.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 grayscale group-hover:grayscale-0" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${faction.bgColor} to-transparent opacity-90`}></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${faction.color} flex items-center justify-center mb-4 border-2 ${faction.borderColor} shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className={`text-3xl font-black ${faction.textColor} mb-1 uppercase tracking-tighter`}>{faction.name}</h3>
                      <p className="text-white/80 text-sm uppercase tracking-widest font-bold">{faction.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-400 leading-relaxed text-sm">{faction.description}</p>
                    <button className={`mt-6 text-sm font-bold uppercase ${faction.textColor} hover:text-white transition flex items-center`}>
                      Узнать больше <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Squad Classes */}
      <section id="squads" className="bg-gradient-to-b from-gray-900 to-black py-24 px-4 border-t border-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 text-white font-black">
            <h2 className="text-4xl md:text-6xl uppercase tracking-tight">Классы отрядов</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-6"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {squadClasses.map((squad, index) => (
              <div key={index} className="bg-black border border-gray-800 p-8 hover:border-amber-900/50 transition duration-300 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${squad.color} flex-shrink-0 flex items-center justify-center border-2 border-amber-500/20 shadow-lg`}>
                  <squad.icon size={36} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 text-white uppercase">{squad.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{squad.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="bg-white text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-black mb-16 text-center uppercase tracking-tight">Новости</h2>
          
          {news.length === 0 ? (
            <div className="text-center text-gray-500 italic">Новости пока отсутствуют. Следите за обновлениями!</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {news.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="border-b-4 border-amber-600 mb-6 overflow-hidden bg-gray-100 h-64">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <p className="text-amber-700 font-bold mb-2 uppercase text-xs tracking-wider">{item.date}</p>
                  <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-amber-700 transition">{item.title}</h3>
                  <p className="text-gray-600 line-clamp-3 leading-relaxed">{item.preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Screenshots */}
      <section className="bg-black py-24 px-4 border-t border-amber-900/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-16 uppercase text-white">Галерея</h2>
          {gameData.screenshots.length > 0 ? (
            <div className="relative border-4 border-gray-900 bg-gray-900 aspect-video max-h-[700px] overflow-hidden group">
              <img 
                src={gameData.screenshots[currentImage]} 
                alt="Gameplay Screenshot" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              
              <button 
                onClick={prevImage} 
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 border border-amber-600/50 text-white hover:bg-amber-600 hover:border-amber-600 transition rounded-full opacity-0 group-hover:opacity-100 duration-300"
              >
                <ChevronLeft size={24}/>
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 border border-amber-600/50 text-white hover:bg-amber-600 hover:border-amber-600 transition rounded-full opacity-0 group-hover:opacity-100 duration-300"
              >
                <ChevronRight size={24}/>
              </button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {gameData.screenshots.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'bg-amber-500 w-6' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 border border-gray-800 border-dashed rounded-lg">
              Скриншоты скоро появятся
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-16 px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-amber-700 flex items-center justify-center font-black text-xl text-black transform rotate-45">
            <span className="transform -rotate-45">T</span>
          </div>
          <span className="text-2xl font-black text-amber-100 uppercase tracking-widest">TRIGLAV</span>
        </div>
        <div className="flex justify-center space-x-6 mb-8 text-sm uppercase tracking-wider text-gray-500">
          <a href="#" className="hover:text-amber-500 transition">Правила</a>
          <a href="#" className="hover:text-amber-500 transition">Конфиденциальность</a>
          <a href="#" className="hover:text-amber-500 transition">Поддержка</a>
          <a href="/admin" className="hover:text-red-500 transition">Админ</a>
        </div>
        <p className="text-gray-600 text-sm">© 2025 TRIGLAV ONLINE. Все права защищены. Artworks by respective owners.</p>
      </footer>
    </div>
  );
};

export default LandingPage;