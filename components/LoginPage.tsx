import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrNickname: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrNickname) {
      newErrors.emailOrNickname = 'Введите email или никнейм';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Симуляция входа
    setTimeout(() => {
      // --- ПРОВЕРКА НА АДМИНА ---
      if (formData.emailOrNickname === 'admin' && formData.password === 'admin') {
        localStorage.setItem('triglav_admin_auth', 'true');
        // Создаем профиль админа, чтобы работала навигация в шапке
        localStorage.setItem('triglav_user', JSON.stringify({
          nickname: 'Administrator',
          email: 'admin@triglav.online',
          country: 'System'
        }));
        
        setIsSubmitting(false);
        navigate('/admin/dashboard');
        return;
      }
      // ---------------------------

      console.log('Вход:', formData);
      
      // Для MVP сохраняем фейковые данные в localStorage, чтобы Профиль мог их считать
      localStorage.setItem('triglav_user', JSON.stringify({
        nickname: formData.emailOrNickname.includes('@') ? formData.emailOrNickname.split('@')[0] : formData.emailOrNickname,
        email: formData.emailOrNickname.includes('@') ? formData.emailOrNickname : 'user@example.com',
        country: 'Unknown'
      }));

      setIsSubmitting(false);
      setLoginSuccess(true);
      
      // Автоматический редирект через небольшую паузу
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Добро пожаловать!
          </h2>
          <p className="text-gray-400 mb-6">
            Вы успешно вошли в систему. Перенаправление в личный кабинет...
          </p>
          <button 
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition font-bold uppercase tracking-wider"
          >
            Перейти в профиль
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-amber-900/30 bg-black/50 backdrop-blur-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center font-black text-lg border border-amber-500/50">
                <span className="text-black">T</span>
              </div>
              <span className="text-xl font-black tracking-wider text-amber-100">TRIGLAV</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition text-sm"
            >
              <ArrowLeft size={18} />
              <span>На главную</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Вход
            </h1>
            <p className="text-gray-400">
              Войдите в свой аккаунт TRIGLAV ONLINE
            </p>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 p-8 md:p-10">
            {/* Email or Nickname */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Email или Никнейм
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  name="emailOrNickname"
                  value={formData.emailOrNickname}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-black/50 border ${errors.emailOrNickname ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="your@email.com или YourNickname"
                />
              </div>
              {errors.emailOrNickname && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.emailOrNickname}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-black/50 border ${errors.password ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-11 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 bg-black/50 border border-amber-900/30 checked:bg-amber-600 focus:outline-none"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition">
                  Запомнить меня
                </span>
              </label>
              <button 
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-amber-500 hover:text-amber-400 transition"
              >
                Забыли пароль?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 font-bold uppercase tracking-wider transition ${
                isSubmitting
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
              }`}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Нет аккаунта?{' '}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-amber-500 hover:text-amber-400 font-semibold"
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>
          </div>

          {/* Social Login (Optional) */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-500 uppercase tracking-wider">
                  Или войдите через
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={() => alert('VK авторизация (в разработке)')}
                className="flex items-center justify-center space-x-2 py-3 border border-blue-600 hover:bg-blue-600/10 transition font-semibold"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-sm"></div>
                <span>VKontakte</span>
              </button>
              <button 
                onClick={() => alert('Discord авторизация (в разработке)')}
                className="flex items-center justify-center space-x-2 py-3 border border-indigo-600 hover:bg-indigo-600/10 transition font-semibold"
              >
                <div className="w-5 h-5 bg-indigo-600 rounded-sm"></div>
                <span>Discord</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;