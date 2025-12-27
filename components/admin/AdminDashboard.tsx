import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Activity, LogOut, Settings, Save, Trash2, Plus, LayoutDashboard, Image as ImageIcon, Upload, Server, AlertTriangle, RefreshCw, Palette } from 'lucide-react';
import { db, GameData, NewsItem, User, Faction } from '../../lib/db';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'news' | 'users' | 'settings'>('overview');
  
  const [gameData, setGameData] = useState<GameData>(db.getGameData());
  const [news, setNews] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [newNewsItem, setNewNewsItem] = useState({ title: '', preview: '', date: '', image: '' });

  useEffect(() => {
    if (!localStorage.getItem('triglav_admin_auth')) {
      navigate('/admin');
      return;
    }
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setGameData(db.getGameData());
    setNews(db.getNews());
    setUsers(db.getUsers());
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('triglav_admin_auth');
    navigate('/admin');
  };

  const handleSaveContent = () => {
    db.updateGameData(gameData);
    alert('Контент успешно обновлен!');
    refreshData();
  };

  const handleResetDatabase = () => {
    if (confirm('ВНИМАНИЕ: Сбросить все данные сайта до заводских? Это удалит все ваши изменения фракций и новости.')) {
      db.resetToDefaults();
      refreshData();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsItem.title || !newNewsItem.date) return;
    db.addNews({
      title: newNewsItem.title,
      preview: newNewsItem.preview,
      date: newNewsItem.date,
      image: newNewsItem.image || "https://placehold.co/600x400/1a1a1a/amber?text=News"
    });
    setNewNewsItem({ title: '', preview: '', date: '', image: '' });
    refreshData();
  };

  const handleDeleteNews = (id: number) => {
    if (confirm('Удалить эту новость?')) {
      db.deleteNews(id);
      refreshData();
    }
  };

  const handleUpdateFaction = (index: number, field: keyof Faction, value: string) => {
    const updatedFactions = [...gameData.factions];
    updatedFactions[index] = { ...updatedFactions[index], [field]: value };
    setGameData({ ...gameData, factions: updatedFactions });
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500 font-black">ЗАГРУЗКА...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 border-r border-gray-800 relative">
        <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-amber-600 flex items-center justify-center font-black text-black rounded">T</div>
          <span className="font-bold tracking-widest uppercase text-sm">Панель Управления</span>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Обзор' },
            { id: 'content', icon: FileText, label: 'Контент' },
            { id: 'news', icon: Activity, label: 'Новости' },
            { id: 'users', icon: Users, label: 'Люди' },
            { id: 'settings', icon: Settings, label: 'Настройки' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition font-bold uppercase text-[10px] tracking-widest ${activeTab === tab.id ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800 bg-gray-900">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-red-500 transition text-xs font-bold uppercase">
            <LogOut size={16} />
            <span>Выход</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Статистика сайта</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-amber-500">
                <p className="text-xs font-black text-gray-400 uppercase">Статус Сервера</p>
                <div className="flex items-center mt-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${gameData.serverStatus === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="font-black text-xl uppercase tracking-tighter">{gameData.serverStatus}</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase">Всего Игроков</p>
                <p className="text-3xl font-black text-gray-800 mt-2 tracking-tighter">{users.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase">Новостей</p>
                <p className="text-3xl font-black text-gray-800 mt-2 tracking-tighter">{news.length}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-black uppercase text-gray-400 text-xs mb-4">Быстрое управление сервером</h3>
              <div className="flex gap-4">
                {(['online', 'offline', 'maintenance'] as const).map(status => (
                  <button 
                    key={status}
                    onClick={() => {
                      const newData = { ...gameData, serverStatus: status };
                      setGameData(newData);
                      db.updateGameData(newData);
                    }}
                    className={`px-6 py-2 rounded font-bold uppercase text-[10px] tracking-widest border transition ${gameData.serverStatus === status ? 'bg-amber-600 border-amber-600 text-white shadow-lg' : 'border-gray-200 text-gray-400 hover:border-amber-500'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-8 max-w-5xl">
            <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Редактор Фракций</h2>
              <button onClick={handleSaveContent} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded font-black uppercase tracking-widest flex items-center space-x-2 shadow-lg transition active:scale-95">
                <Save size={18} />
                <span>Сохранить изменения</span>
              </button>
            </div>

            <div className="space-y-12">
              {gameData.factions.map((faction, idx) => (
                <div key={faction.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                   <div className="flex items-center space-x-3 border-b pb-4">
                    <Palette className="text-amber-600" size={24} />
                    <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Настройка: {faction.name}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Image Column */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 block">Фото фракции (600x400)</label>
                      <div className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-4 border-white shadow-md">
                        <img src={faction.image} alt="Faction" className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition text-white">
                          <Upload size={24} className="mb-2" />
                          <span className="text-[10px] font-bold uppercase">Заменить фото</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (b64) => handleUpdateFaction(idx, 'image', b64))} />
                        </label>
                      </div>
                    </div>

                    {/* Controls Column */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Название фракции</label>
                        <input type="text" value={faction.name} onChange={(e) => handleUpdateFaction(idx, 'name', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-gray-800 focus:border-amber-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Градиент (Tailwind)</label>
                        <input type="text" value={faction.color} onChange={(e) => handleUpdateFaction(idx, 'color', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" placeholder="from-emerald-600 to-emerald-800" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Фон плашки</label>
                        <input type="text" value={faction.bgColor} onChange={(e) => handleUpdateFaction(idx, 'bgColor', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" placeholder="bg-emerald-950/30" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Описание фракции</label>
                        <textarea value={faction.description} onChange={(e) => handleUpdateFaction(idx, 'description', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-24 text-sm text-gray-600 outline-none focus:border-amber-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Screenshots Gallery Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Галерея скриншотов</h3>
                <label className="cursor-pointer bg-gray-900 text-white px-4 py-2 rounded text-[10px] font-black uppercase hover:bg-black transition flex items-center">
                  <Plus size={14} className="mr-2" /> Добавить
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (b64) => setGameData({...gameData, screenshots: [...gameData.screenshots, b64]}))} />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gameData.screenshots.map((src, i) => (
                  <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                    <img src={src} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setGameData({...gameData, screenshots: gameData.screenshots.filter((_, idx) => idx !== i)})} 
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-8 max-w-5xl">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Новости</h2>
            
            {/* Form */}
            <form onSubmit={handleAddNews} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-sm font-black uppercase text-gray-400 border-b pb-2">Добавить новость</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Заголовок</label>
                    <input type="text" value={newNewsItem.title} onChange={(e) => setNewNewsItem({...newNewsItem, title: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-amber-500 font-bold" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Дата</label>
                    <input type="text" value={newNewsItem.date} onChange={(e) => setNewNewsItem({...newNewsItem, date: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-amber-500" placeholder="15 Декабря 2025" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Текст превью</label>
                  <textarea value={newNewsItem.preview} onChange={(e) => setNewNewsItem({...newNewsItem, preview: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg h-[108px] outline-none focus:border-amber-500 text-sm" required />
                </div>
              </div>
              <div className="flex items-center space-x-4 pt-4 border-t">
                <label className="flex-1 cursor-pointer bg-gray-50 border-2 border-dashed border-gray-200 p-3 rounded-lg text-center hover:bg-gray-100 transition group relative overflow-hidden">
                  <span className="text-xs text-gray-500 font-bold uppercase">{newNewsItem.image ? 'Изображение загружено' : 'Загрузить обложку (600x400)'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (b64) => setNewNewsItem({...newNewsItem, image: b64}))} />
                  {newNewsItem.image && <img src={newNewsItem.image} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" />}
                </label>
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-10 py-3 rounded font-black uppercase tracking-widest transition shadow-lg active:scale-95">Опубликовать</button>
              </div>
            </form>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400">Фото</th>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400">Информация</th>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {news.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 w-24">
                        <img src={item.image} className="w-20 h-12 object-cover rounded shadow-sm" />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800 leading-tight">{item.title}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{item.date}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteNews(item.id)} className="text-red-400 hover:text-red-600 transition p-2">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {news.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-gray-400 font-bold italic">Новостей пока нет</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-8 max-w-5xl">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Пользователи</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400">Игрок</th>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400">Email</th>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400">Роль</th>
                    <th className="p-4 text-[10px] font-black uppercase text-gray-400">Регистрация</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-800">{u.nickname}</td>
                      <td className="p-4 text-sm text-gray-500 font-medium">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{u.role}</span>
                      </td>
                      <td className="p-4 text-[10px] text-gray-400 font-bold uppercase">{new Date(u.registeredAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-gray-400 font-bold italic">В базе данных нет пользователей</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-8">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Система</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-red-50">
              <div className="flex items-center space-x-3 text-red-600 mb-6">
                <AlertTriangle size={32} />
                <h3 className="text-xl font-black uppercase">Опасная зона</h3>
              </div>
              <p className="text-gray-500 mb-8 font-bold text-sm leading-relaxed">Полный сброс базы данных сайта. Все изменения фракций, загруженные фото и новости будут удалены безвозвратно.</p>
              <button onClick={handleResetDatabase} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest transition flex items-center justify-center space-x-3 shadow-lg active:scale-[0.98]">
                <RefreshCw size={20} />
                <span>Сбросить данные к заводским</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
