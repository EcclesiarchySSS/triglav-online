import React, { useEffect, useState } from 'react';
import { User, LogOut, Settings, Download, Shield, Trophy, Activity, History, Plus, Swords, UserPlus, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, User as UserType, GameData, Character } from '../lib/db';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [serverStatus, setServerStatus] = useState<GameData['serverStatus']>('maintenance');
  
  // Character Creation Modal State
  const [showCharModal, setShowCharModal] = useState(false);
  const [charName, setCharName] = useState('');
  const [charClass, setCharClass] = useState<Character['class']>('warrior');

  useEffect(() => {
    // 1. Load User
    const storedUser = localStorage.getItem('triglav_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }

    // 2. Load Server Status
    const gameData = db.getGameData();
    setServerStatus(gameData.serverStatus || 'maintenance');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('triglav_user');
    navigate('/');
  };

  const handleCreateCharacter = () => {
    if (!charName || !user) return;

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: charName,
      class: charClass,
      level: 1,
      created: new Date().toISOString()
    };

    // Update Local State
    const updatedUser = { ...user, characters: [...(user.characters || []), newCharacter] };
    setUser(updatedUser);
    
    // Update DB
    db.updateUser(user.email, { characters: updatedUser.characters });
    
    // Reset Modal
    setShowCharModal(false);
    setCharName('');
    alert(`Персонаж ${charName} успешно создан!`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'text-green-500';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'online': return 'Online';
      case 'maintenance': return 'Тех. работы';
      default: return 'Offline';
    }
  };

  if (!user) return <div className="text-white text-center pt-20">Загрузка профиля...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-lg border border-amber-500/50">
                <span className="text-black">T</span>
              </div>
              <span className="text-xl font-black tracking-wider text-amber-100 hidden sm:block">TRIGLAV</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-amber-500">
                <User size={18} />
                <span className="font-bold tracking-wide">{user.nickname}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition text-sm ml-4"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 border border-amber-900/30 p-6 rounded-sm">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-600">
                <User size={48} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-center text-white mb-1">{user.nickname}</h2>
              <p className="text-gray-500 text-center text-sm mb-4">
                {user.role === 'admin' ? 'Администратор' : 'Рекрут'}
              </p>
              
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 bg-amber-900/20 text-amber-500 border-l-2 border-amber-500">
                  <Activity size={18} />
                  <span>Обзор</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white transition">
                  <Settings size={18} />
                  <span>Настройки</span>
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin/dashboard')} className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 transition">
                    <Shield size={18} />
                    <span>Админка</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-black border border-amber-900/30 p-6 rounded-sm">
              <h3 className="text-amber-500 font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                <Server size={16} /> Статус сервера
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Средиземье</span>
                <span className={`${getStatusColor(serverStatus)} flex items-center text-sm font-bold`}>
                  <span className={`w-2 h-2 ${getStatusColor(serverStatus).replace('text-', 'bg-')} rounded-full mr-2`}></span>
                  {getStatusText(serverStatus)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Арена</span>
                 <span className={`${getStatusColor(serverStatus)} flex items-center text-sm font-bold`}>
                  <span className={`w-2 h-2 ${getStatusColor(serverStatus).replace('text-', 'bg-')} rounded-full mr-2`}></span>
                  {getStatusText(serverStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Dashboard Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Characters List (NEW!) */}
            <div className="bg-gray-900 border border-amber-900/30 p-6 rounded-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Swords className="mr-2 text-amber-500" size={20} />
                  Мои персонажи
                </h3>
                <button 
                  onClick={() => setShowCharModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-bold uppercase tracking-wider flex items-center"
                >
                  <Plus size={16} className="mr-1" /> Создать
                </button>
              </div>

              {(!user.characters || user.characters.length === 0) ? (
                 <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-lg bg-black/20">
                    <UserPlus size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg">У вас пока нет персонажей.</p>
                    <p className="text-sm">Создайте первого героя, чтобы начать путешествие!</p>
                 </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {user.characters.map((char) => (
                    <div key={char.id} className="bg-black/40 border border-gray-800 p-4 rounded flex items-center justify-between hover:border-amber-600 transition group cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded bg-gradient-to-br ${
                          char.class === 'mage' ? 'from-purple-900 to-black' : 
                          char.class === 'archer' ? 'from-green-900 to-black' :
                          'from-red-900 to-black'
                        } flex items-center justify-center border border-gray-700`}>
                          <span className="font-bold text-xs uppercase">{char.class.substring(0, 2)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-white group-hover:text-amber-500 transition">{char.name}</h4>
                          <p className="text-xs text-gray-500 uppercase">Уровень {char.level} • {char.class}</p>
                        </div>
                      </div>
                      <button className="text-gray-600 hover:text-white transition">
                        <Settings size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-amber-900/30 p-6 rounded-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Статус доступа</h3>
                    <p className="text-gray-500 text-sm">Ваша заявка на тестирование</p>
                  </div>
                  <Shield className="text-amber-600" size={24} />
                </div>
                <div className="inline-block px-3 py-1 bg-yellow-900/30 text-yellow-500 text-sm font-semibold rounded-full border border-yellow-700/50">
                  На рассмотрении
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Мы уведомим вас по email {user.email}, когда доступ будет открыт.
                </p>
              </div>

              <div className="bg-gray-900 border border-amber-900/30 p-6 rounded-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Игровой клиент</h3>
                    <p className="text-gray-500 text-sm">Версия 0.0.1 (Alpha)</p>
                  </div>
                  <Download className="text-gray-600" size={24} />
                </div>
                
                {serverStatus === 'online' ? (
                   <button onClick={() => alert("Скачивание началось...")} className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-sm transition shadow-lg shadow-amber-900/20">
                    Скачать клиент
                  </button>
                ) : (
                  <button disabled className="w-full py-2 bg-gray-800 text-gray-500 font-bold uppercase tracking-wider text-sm cursor-not-allowed border border-gray-700">
                    Сервер недоступен
                  </button>
                )}
               
                <p className="mt-4 text-sm text-gray-400">
                  Клиент доступен только при активном статусе сервера.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE CHARACTER MODAL */}
      {showCharModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-amber-900/50 max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowCharModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <LogOut size={24} className="rotate-45" /> {/* Using LogOut as X icon for simplicity */}
            </button>
            
            <h2 className="text-2xl font-black text-amber-500 uppercase mb-6 text-center">Создание героя</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Имя персонажа</label>
                <input 
                  type="text" 
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  className="w-full bg-black border border-gray-700 text-white px-4 py-3 focus:border-amber-500 focus:outline-none"
                  placeholder="Введите имя..."
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Класс</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCharClass('warrior')}
                    className={`p-3 border text-sm font-bold uppercase transition ${charClass === 'warrior' ? 'bg-amber-900/50 border-amber-500 text-white' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'}`}
                  >
                    Воин
                  </button>
                   <button 
                    onClick={() => setCharClass('archer')}
                    className={`p-3 border text-sm font-bold uppercase transition ${charClass === 'archer' ? 'bg-amber-900/50 border-amber-500 text-white' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'}`}
                  >
                    Лучник
                  </button>
                   <button 
                    onClick={() => setCharClass('mage')}
                    className={`p-3 border text-sm font-bold uppercase transition ${charClass === 'mage' ? 'bg-amber-900/50 border-amber-500 text-white' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'}`}
                  >
                    Маг
                  </button>
                   <button 
                    onClick={() => setCharClass('cavalry')}
                    className={`p-3 border text-sm font-bold uppercase transition ${charClass === 'cavalry' ? 'bg-amber-900/50 border-amber-500 text-white' : 'bg-black border-gray-800 text-gray-500 hover:border-gray-600'}`}
                  >
                    Всадник
                  </button>
                </div>
              </div>

              <button 
                onClick={handleCreateCharacter}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 uppercase tracking-wider"
              >
                Начать путь
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;