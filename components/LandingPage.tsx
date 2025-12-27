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

  const worlds = [
    {
      name: "Средиземье",
      subtitle: "Мир Яви",
      description: "Физический мир, где разворачивается основное действие. Континент разделён между тремя великими фракциями.",
      image: "https://placehold.co/400x300/1a1a1a/amber?text=Yav"
    },
    {
      name: "Правь",
      subtitle: "Верхний мир",
      description: "Мир света и духовности, обитель высших сил и божественных существ.",
      image: "https://placehold.co/400x300/1a1a1a/amber?text=Prav"
    },
    {
      name: "Навь",
      subtitle: "Нижний мир",
      description: "Мир теней и испытаний, где обитают тёмные силы и древние духи.",
      image: "https://placehold.co/400x300/1a1a1a/amber?text=Nav"
    }
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % gameData.screenshots.length);
  };

  const prevImage = () => {
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
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-xl border border-amber-500/50">
                <span className="text-black">T</span>
              </div>
              <span className="text-2xl font-black tracking-wider hidden sm:block text-amber-100">TRIGLAV</span>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-wider">
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-amber-500 transition">Главная</a>
              <a href="#factions" onClick={(e) => handleNavClick(e, 'factions')} className="hover:text-amber-500 transition">Фракции</a>
              <a href="#squads" onClick={(e) => handleNavClick(e, 'squads')} className="hover:text-amber-500 transition">Отряды</a>
              <a href="#news" onClick={(e) => handleNavClick(e, 'news')} className="hover:text-amber-500 transition">Новости</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 border border-amber-600 hover:bg-amber-600/20 transition text-sm uppercase tracking-wider"
              >
                Войти
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition text-sm uppercase tracking-wider font-semibold"
              >
                Регистрация
              </button>
            </div>

            <button 
              className="md:hidden text-amber-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-6 pb-6 border-t border-amber-900/30 pt-6">
              <div className="flex flex-col space-y-4 text-sm uppercase tracking-wider">
                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="hover:text-amber-500 transition">Главная</a>
                <a href="#factions" onClick={(e) => handleNavClick(e, 'factions')} className="hover:text-amber-500 transition">Фракции</a>
                <a href="#squads" onClick={(e) => handleNavClick(e, 'squads')} className="hover:text-amber-500 transition">Отряды</a>
                <a href="#news" onClick={(e) => handleNavClick(e, 'news')} className="hover:text-amber-500 transition">Новости</a>
                <hr className="border-amber-900/30" />
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 border border-amber-600 hover:bg-amber-600/20 transition text-center"
                >
                  Войти
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-center font-semibold"
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
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-b from-black via-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-red-950/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.1) 0%, transparent 50%)'
          }}></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-20">
          <div className="mb-8 inline-block animate-fade-in-down">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-7xl border-4 border-amber-500/50 shadow-2xl shadow-amber-600/20">
              <span className="text-black">T</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              {gameData.name}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-amber-100 mb-4 font-light tracking-wide uppercase">
            {gameData.tagline}
          </p>

          <p className="text-2xl md:text-3xl font-bold text-white mb-12 tracking-wide">
            {gameData.slogan}
          </p>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            {gameData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 transition text-lg font-bold uppercase tracking-wider border border-red-700 shadow-lg shadow-red-900/50"
            >
              Начать играть
            </button>
            <button className="w-full sm:w-auto px-12 py-5 border-2 border-amber-600 hover:bg-amber-600/10 transition text-lg font-bold uppercase tracking-wider">
              Смотреть трейлер
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-amber-500" />
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight text-gray-900">
              Об игре
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {gameData.features.map((feature, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-6 border-4 border-amber-600">
                  <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Factions Section (Dynamic) */}
      <section id="factions" className="bg-black py-24 px-4 border-t border-red-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Три великие фракции
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-red-900 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {gameData.factions.map((faction) => {
              const Icon = IconMap[faction.iconName] || Shield;
              return (
                <div 
                  key={faction.id}
                  className={`group cursor-pointer bg-gradient-to-br from-gray-900 to-black border-2 ${faction.borderColor} transition`}
                >
                  <div className="relative overflow-hidden">
                    <img src={faction.image} alt={faction.name} className="w-full h-64 object-cover group-hover:scale-110 transition duration-500" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${faction.bgColor} to-transparent opacity-80`}></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${faction.color} flex items-center justify-center mb-4 border-2 ${faction.borderColor}`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className={`text-3xl font-black ${faction.textColor} mb-1`}>{faction.name}</h3>
                      <p className="text-gray-400 text-sm uppercase tracking-wider">{faction.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 leading-relaxed">{faction.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Squad Classes */}
      <section id="squads" className="bg-black py-24 px-4 border-t border-red-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 text-white font-black">
            <h2 className="text-5xl md:text-6xl">Классы отрядов</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {squadClasses.map((squad, index) => (
              <div key={index} className="bg-gray-900 p-8 border border-amber-900/30">
                <div className="flex items-start space-x-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${squad.color} flex items-center justify-center border-2 border-amber-500/50`}>
                    <squad.icon size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-4">{squad.name}</h3>
                    <p className="text-gray-400">{squad.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="bg-white text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-black mb-16 text-center">Новости</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div key={item.id} className="group">
                <div className="border-4 border-amber-600 mb-6 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-64 object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <p className="text-amber-700 font-bold mb-2 uppercase">{item.date}</p>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-700">{item.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="bg-black py-24 px-4 border-t border-amber-900/30">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-black text-center mb-16">Скриншоты</h2>
          {gameData.screenshots.length > 0 && (
            <div className="relative border-4 border-amber-600">
              <img src={gameData.screenshots[currentImage]} alt="Gallery" className="w-full h-[600px] object-cover" />
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 p-4 border border-amber-600 text-white"><ChevronLeft/></button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 p-4 border border-amber-600 text-white"><ChevronRight/></button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-amber-900/30 py-16 px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-amber-600 flex items-center justify-center font-black text-xl text-black">T</div>
          <span className="text-2xl font-black text-amber-100 uppercase tracking-widest">TRIGLAV</span>
        </div>
        <p className="text-gray-500">© 2025 TRIGLAV ONLINE. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
