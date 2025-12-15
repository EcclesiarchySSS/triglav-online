import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Activity, LogOut, Settings, Save, Trash2, Plus, LayoutDashboard, Image as ImageIcon, Upload, Server, AlertTriangle, RefreshCw } from 'lucide-react';
import { db, GameData, NewsItem, User, FeatureItem } from '../../lib/db';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'news' | 'users' | 'settings'>('overview');
  
  // Data State
  const [gameData, setGameData] = useState<GameData>(db.getGameData());
  const [news, setNews] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newNewsItem, setNewNewsItem] = useState({ title: '', preview: '', date: '', image: '' });
  
  // New Feature State
  const [newFeature, setNewFeature] = useState<FeatureItem>({ title: '', description: '', image: '' });

  useEffect(() => {
    // Check auth
    if (!localStorage.getItem('triglav_admin_auth')) {
      navigate('/admin');
      return;
    }

    // Load data
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
    alert('Контент на главной странице обновлен!');
  };

  const handleResetDatabase = () => {
    if (confirm('ВНИМАНИЕ: Это сбросит все новости, скриншоты и настройки текста к начальным значениям. Вы уверены?')) {
      db.resetToDefaults();
      refreshData();
      alert('База данных успешно сброшена к исходному состоянию.');
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

  const handleAddScreenshot = (base64: string) => {
    const updatedScreenshots = [...gameData.screenshots, base64];
    setGameData({ ...gameData, screenshots: updatedScreenshots });
  };

  const handleDeleteScreenshot = (index: number) => {
    const updatedScreenshots = gameData.screenshots.filter((_, i) => i !== index);
    setGameData({ ...gameData, screenshots: updatedScreenshots });
  };

  const handleUpdateFeature = (index: number, field: keyof FeatureItem, value: string) => {
    const updatedFeatures = [...gameData.features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setGameData({ ...gameData, features: updatedFeatures });
  };

  const updateServerStatus = (status: 'online' | 'offline' | 'maintenance') => {
    const newData = { ...gameData, serverStatus: status };
    setGameData(newData);
    db.updateGameData(newData);
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
           <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-sm border border-amber-500/50 rounded">
            <span className="text-black">T</span>
          </div>
          <span className="font-bold tracking-wider">ADMIN PANEL</span>
        </div>
        
        <nav className="mt-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${activeTab === 'overview' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>Обзор</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${activeTab === 'content' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <FileText size={20} />
            <span>Контент</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('news')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${activeTab === 'news' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Activity size={20} />
            <span>Новости</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${activeTab === 'users' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Users size={20} />
            <span>Пользователи</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition ${activeTab === 'settings' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Settings size={20} />
            <span>Настройки</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white transition"
          >
            <LogOut size={20} />
            <span>Выход</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Обзор системы</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 uppercase text-xs font-bold">Статус сервера</h3>
                  <Server className={`${
                    gameData.serverStatus === 'online' ? 'text-green-500' : 
                    gameData.serverStatus === 'maintenance' ? 'text-yellow-500' : 'text-red-500'
                  }`} size={24} />
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => updateServerStatus('online')}
                    className={`px-3 py-1 text-xs font-bold rounded ${gameData.serverStatus === 'online' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-500'}`}
                  >
                    ONLINE
                  </button>
                  <button 
                    onClick={() => updateServerStatus('maintenance')}
                    className={`px-3 py-1 text-xs font-bold rounded ${gameData.serverStatus === 'maintenance' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-gray-100 text-gray-500'}`}
                  >
                    WORK
                  </button>
                  <button 
                    onClick={() => updateServerStatus('offline')}
                    className={`px-3 py-1 text-xs font-bold rounded ${gameData.serverStatus === 'offline' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-500'}`}
                  >
                    OFFLINE
                  </button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 uppercase text-xs font-bold">Всего пользователей</h3>
                  <Users className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-black text-gray-800">{users.length}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-500 uppercase text-xs font-bold">Активные новости</h3>
                  <Activity className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-black text-gray-800">{news.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Редактирование главной</h2>
              <button 
                onClick={handleSaveContent}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded flex items-center space-x-2 shadow-lg sticky top-8 z-10"
              >
                <Save size={18} />
                <span>Сохранить все изменения</span>
              </button>
            </div>

            {/* Basic Text Info */}
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200 space-y-6 max-w-4xl">
              <h3 className="text-lg font-bold border-b pb-2 text-gray-700">Основная информация</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Название игры (H1)</label>
                  <input 
                    type="text" 
                    value={gameData.name}
                    onChange={(e) => setGameData({...gameData, name: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">Верхний подзаголовок</label>
                  <input 
                    type="text" 
                    value={gameData.tagline}
                    onChange={(e) => setGameData({...gameData, tagline: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Главный слоган</label>
                <input 
                  type="text" 
                  value={gameData.slogan}
                  onChange={(e) => setGameData({...gameData, slogan: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Краткое описание (Hero)</label>
                <textarea 
                  value={gameData.description}
                  onChange={(e) => setGameData({...gameData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:border-amber-500 focus:outline-none h-24"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">Полное описание (About)</label>
                <textarea 
                  value={gameData.fullDescription}
                  onChange={(e) => setGameData({...gameData, fullDescription: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded focus:border-amber-500 focus:outline-none h-24"
                />
              </div>
            </div>

            {/* Features (About Section) */}
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200 space-y-6 max-w-4xl">
              <h3 className="text-lg font-bold border-b pb-2 text-gray-700">Блоки "Об игре" (Features)</h3>
              {gameData.features.map((feature, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded bg-gray-50 flex gap-4">
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-200 relative group overflow-hidden border border-gray-300">
                    <img src={feature.image} alt="Feature" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                      <Upload className="text-white" size={24} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, (base64) => handleUpdateFeature(index, 'image', base64))}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={feature.title}
                      onChange={(e) => handleUpdateFeature(index, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded font-bold"
                    />
                    <textarea 
                      value={feature.description}
                      onChange={(e) => handleUpdateFeature(index, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm h-20"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Screenshots Gallery */}
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200 space-y-6 max-w-4xl">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-lg font-bold text-gray-700">Галерея скриншотов</h3>
                <label className="cursor-pointer bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black flex items-center gap-2">
                  <Plus size={16} /> Добавить фото
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleImageUpload(e, handleAddScreenshot)}
                  />
                </label>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gameData.screenshots.map((src, index) => (
                  <div key={index} className="relative group aspect-video bg-gray-100 border border-gray-300 rounded overflow-hidden">
                    <img src={src} alt="Screenshot" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteScreenshot(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === 'news' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Управление новостями</h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-fit sticky top-8">
                <h3 className="text-lg font-bold mb-4">Добавить новость</h3>
                <form onSubmit={handleAddNews} className="space-y-4">
                  
                  {/* Image Upload */}
                  <div className="relative w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition group overflow-hidden">
                    {newNewsItem.image ? (
                      <img src={newNewsItem.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon className="text-gray-400 mb-2" size={32} />
                        <span className="text-gray-500 text-sm">Нажмите для загрузки фото</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleImageUpload(e, (base64) => setNewNewsItem({ ...newNewsItem, image: base64 }))}
                    />
                    {newNewsItem.image && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white text-sm font-bold">Изменить фото</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Заголовок</label>
                    <input 
                      required
                      type="text" 
                      value={newNewsItem.title}
                      onChange={(e) => setNewNewsItem({...newNewsItem, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Дата</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. 15 декабря 2025"
                      value={newNewsItem.date}
                      onChange={(e) => setNewNewsItem({...newNewsItem, date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Текст превью</label>
                    <textarea 
                      required
                      value={newNewsItem.preview}
                      onChange={(e) => setNewNewsItem({...newNewsItem, preview: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded h-24"
                    />
                  </div>
                  <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded font-bold hover:bg-amber-700 flex items-center justify-center">
                    <Plus size={18} className="mr-2" /> Добавить
                  </button>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                {news.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex gap-4">
                    <div className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-amber-600 uppercase">{item.date}</span>
                        <button 
                          onClick={() => handleDeleteNews(item.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.preview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Список пользователей</h2>
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Никнейм</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Роль</th>
                    <th className="px-6 py-4">Персонажи</th>
                    <th className="px-6 py-4">Дата регистрации</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-400 text-sm">{i + 1}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{u.nickname}</td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 text-sm font-semibold">
                         {u.characters?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(u.registeredAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Пользователей пока нет.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Настройки системы</h2>
            
            <div className="bg-white p-8 rounded-lg shadow border border-gray-200 max-w-2xl">
              <div className="flex items-start space-x-4 mb-6">
                 <div className="p-3 bg-red-100 rounded-full">
                   <AlertTriangle className="text-red-600" size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-800">Сброс данных (Wipe)</h3>
                   <p className="text-gray-600 mt-1">
                     Используйте эту функцию, чтобы сбросить все изменения в новостях и контенте до начальных настроек.
                     Полезно, если вы хотите "очистить" сайт перед демонстрацией инвесторам.
                   </p>
                 </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <button 
                  onClick={handleResetDatabase}
                  className="w-full py-4 border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold uppercase tracking-wider rounded flex items-center justify-center space-x-2 transition"
                >
                  <RefreshCw size={20} />
                  <span>Выполнить полный сброс</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;