import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronLeft, ChevronRight, Swords, Shield, Zap, Users, Leaf, Cpu, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, GameData, NewsItem } from '../lib/db';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Состояние для динамического контента
  const [gameData, setGameData] = useState<GameData>(db.getGameData());
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Загружаем данные из нашего "бэкенда" при загрузке страницы
    setGameData(db.getGameData());
    setNews(db.getNews());

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const factions = [
    {
      name: "Зелёная Фракция",
      subtitle: "Природная",
      icon: Leaf,
      description: "Эльфы, северные люди и оборотни живут в гармонии с природой, развивая свои духовные силы. Они защищают свой цветущий мир от тех, кто угрожает его существованию.",
      color: "from-emerald-600 to-emerald-800",
      borderColor: "border-emerald-600",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-950/30",
      image: "https://placehold.co/600x400/10b981/1a1a1a?text=Green+Faction"
    },
    {
      name: "Коричневая Фракция",
      subtitle: "Технократическая",
      icon: Cpu,
      description: "Мастера технологий, сращивающие плоть и механизмы. Искренне верят в свой путь развития и готовы 'просветить' другие расы. Устойчивы к ядам благодаря имплантам.",
      color: "from-amber-700 to-amber-900",
      borderColor: "border-amber-700",
      textColor: "text-amber-400",
      bgColor: "bg-amber-950/30",
      image: "https://placehold.co/600x400/92400e/1a1a1a?text=Brown+Faction"
    },
    {
      name: "Фиолетовая Фракция",
      subtitle: "Демоническая",
      icon: Skull,
      description: "Служители тёмных сил, черпающие мощь из демонических недр. Поклоняются золоту и власти, мастерски порабощают разум врагов и накладывают смертельные проклятия.",
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-600",
      textColor: "text-purple-400",
      bgColor: "bg-purple-950/30",
      image: "https://placehold.co/600x400/7c3aed/1a1a1a?text=Purple+Faction"
    }
  ];

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

      {/* Hero Section - ЧЕРНЫЙ + БОРДОВЫЙ */}
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

          <div className="mt-12 flex justify-center items-center space-x-6 text-gray-400 text-sm uppercase tracking-wider">
            <span>Скоро:</span>
            <span className="text-amber-500 font-semibold">PC</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-amber-500" />
        </div>
      </section>

      {/* About Section - БЕЛЫЙ + ЗОЛОТОЙ */}
      <section className="bg-gradient-to-b from-white to-gray-50 text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Об игре
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mb-8"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {gameData.features.map((feature, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-6 border-4 border-amber-600">
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-8 border-amber-600 p-8 md:p-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-900">
              Уникальная экономика
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {gameData.fullDescription}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Координируйтесь с союзниками, выбирайте правильный состав отрядов и применяйте тактические маневры для достижения победы в масштабных сражениях за территории.
            </p>
          </div>
        </div>
      </section>

      {/* Factions Section (Без изменений, так как слишком сложная структура для простой админки пока) */}
      <section id="factions" className="bg-black py-24 px-4 border-t border-red-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Три великие фракции
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-red-900 mx-auto mb-8"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Выберите свою сторону в вечном противостоянии. Каждая фракция имеет уникальную философию, стиль игры и особые способности.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {factions.map((faction, index) => {
              const Icon = faction.icon;
              return (
                <div 
                  key={index}
                  className={`group cursor-pointer bg-gradient-to-br from-gray-900 to-black border-2 ${faction.borderColor} hover:shadow-2xl hover:shadow-${faction.textColor}/20 transition`}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={faction.image}
                      alt={faction.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${faction.bgColor} to-transparent opacity-80`}></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${faction.color} flex items-center justify-center mb-4 border-2 ${faction.borderColor}`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className={`text-3xl font-black ${faction.textColor} mb-1`}>
                        {faction.name}
                      </h3>
                      <p className="text-gray-400 text-sm uppercase tracking-wider">
                        {faction.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 leading-relaxed">
                      {faction.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button className="px-12 py-4 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 transition font-bold uppercase tracking-wider border border-red-700">
              Подробнее о фракциях
            </button>
          </div>
        </div>
      </section>

      {/* Worlds Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                Три мира
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Славянская мифология оживает в TRIGLAV ONLINE. Исследуйте Явь, Правь и Навь.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {worlds.map((world, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-6 border-4 border-amber-600">
                  <img 
                    src={world.image}
                    alt={world.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-3xl font-black text-white mb-1">{world.name}</h3>
                    <p className="text-amber-400 text-sm uppercase tracking-wider">{world.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {world.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Squad Classes */}
      <section id="squads" className="bg-black py-24 px-4 border-t border-red-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Классы отрядов
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-red-900 mx-auto mb-8"></div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Каждый класс отряда имеет уникальную роль в бою. Выберите свою специализацию и станьте мастером тактики.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {squadClasses.map((squad, index) => {
              const Icon = squad.icon;
              return (
                <div 
                  key={index}
                  className="group cursor-pointer bg-gradient-to-br from-gray-900 to-black border border-red-950 hover:border-amber-600 transition p-8"
                >
                  <div className="flex items-start space-x-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${squad.color} flex items-center justify-center flex-shrink-0 border-2 border-amber-500/50`}>
                      <Icon size={40} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-black mb-4 group-hover:text-amber-500 transition">
                        {squad.name}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {squad.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button className="px-12 py-4 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 transition font-bold uppercase tracking-wider border border-red-700">
              Подробнее об отрядах
            </button>
          </div>
        </div>
      </section>

      {/* News Section (DYNAMIC) */}
      <section id="news" className="bg-gradient-to-b from-gray-50 to-white text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Новости
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mt-4"></div>
            </div>
            <button
              onClick={() => handleNavClick({ preventDefault: () => {} } as any, 'news')}
              className="hidden md:block text-amber-700 hover:text-amber-600 transition uppercase tracking-wider text-sm font-semibold"
            >
              Все новости →
            </button>
          </div>

          {news.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">Новостей пока нет.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {news.map((item) => (
                <div 
                  key={item.id}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden mb-6 border-4 border-amber-600">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                  </div>
                  <p className="text-amber-700 text-sm mb-3 uppercase tracking-wider font-semibold">{item.date}</p>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-amber-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {item.preview}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery - ЧЕРНЫЙ + БОРДОВЫЙ */}
      <section className="bg-black py-24 px-4 border-t border-red-950">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Скриншоты
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-800 to-red-900 mx-auto"></div>
          </div>

          {gameData.screenshots.length > 0 && (
            <div className="relative">
              <div className="relative overflow-hidden border-4 border-amber-600 shadow-2xl shadow-amber-600/20">
                <img 
                  src={gameData.screenshots[currentImage]}
                  alt={`Screenshot ${currentImage + 1}`}
                  className="w-full h-[500px] md:h-[700px] object-cover"
                />
                
                <button 
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/70 hover:bg-amber-600 transition flex items-center justify-center border border-amber-600"
                >
                  <ChevronLeft size={28} className="text-white" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/70 hover:bg-amber-600 transition flex items-center justify-center border border-amber-600"
                >
                  <ChevronRight size={28} className="text-white" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                  {gameData.screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-1 transition-all duration-300 border border-amber-600 ${
                        currentImage === index ? 'bg-amber-600 w-12' : 'bg-white/30 w-3 hover:w-6 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - БЕЛЫЙ + ЗОЛОТОЙ */}
      <section className="bg-gradient-to-b from-white to-gray-50 text-gray-900 py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              Присоединяйтесь к битве
            </span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Регистрируйтесь сейчас и получите доступ к эксклюзивным новостям и альфа-тестированию
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold uppercase tracking-wider hover:from-amber-700 hover:to-amber-800 transition"
            >
              Зарегистрироваться
            </button>
            <button className="px-12 py-4 border-2 border-amber-600 text-amber-700 font-bold uppercase tracking-wider hover:bg-amber-50 transition">
              Перейти на форум
            </button>
          </div>
        </div>
      </section>

      {/* Footer - ЧЕРНЫЙ + ЗОЛОТОЙ */}
      <footer className="bg-black border-t border-amber-900/30 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-xl border border-amber-500/50">
                  <span className="text-black">T</span>
                </div>
                <span className="text-2xl font-black tracking-wider text-amber-100">TRIGLAV</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Стратегическая MMORPG с управлением военными отрядами. Командуй. Сражайся. Побеждай.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-amber-500 mb-4 uppercase tracking-wider text-sm">Игра</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="block hover:text-amber-500 transition">Главная</a>
                <a href="#factions" onClick={(e) => handleNavClick(e, 'factions')} className="block hover:text-amber-500 transition">Фракции</a>
                <a href="#squads" onClick={(e) => handleNavClick(e, 'squads')} className="block hover:text-amber-500 transition">Классы отрядов</a>
                <a href="#" className="block hover:text-amber-500 transition">Три мира</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-amber-500 mb-4 uppercase tracking-wider text-sm">Сообщество</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <a href="#" className="block hover:text-amber-500 transition">Форум</a>
                <a href="#" className="block hover:text-amber-500 transition">Новости</a>
                <a href="#" className="block hover:text-amber-500 transition">Discord</a>
                <a href="#" className="block hover:text-amber-500 transition">VKontakte</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-amber-500 mb-4 uppercase tracking-wider text-sm">Поддержка</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                <a href="#" className="block hover:text-amber-500 transition">Помощь</a>
                <a href="#" className="block hover:text-amber-500 transition">Правила</a>
                <a href="#" className="block hover:text-amber-500 transition">Конфиденциальность</a>
                <a href="#" className="block hover:text-amber-500 transition">Контакты</a>
              </div>
            </div>
          </div>

          <div className="border-t border-amber-900/30 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>© 2025 TRIGLAV ONLINE. Все права защищены.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-500 transition">Условия использования</a>
              <a href="#" className="hover:text-amber-500 transition">Политика конфиденциальности</a>
              <button onClick={() => navigate('/admin')} className="hover:text-amber-500 transition opacity-20 hover:opacity-100">Admin</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;