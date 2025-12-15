import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    setError('');

    if (!email) {
      setError('Введите email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Некорректный email');
      return;
    }

    setIsSubmitting(true);

    // Симуляция отправки
    setTimeout(() => {
      console.log('Отправка письма на:', email);
      setIsSubmitting(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Письмо отправлено!
          </h2>
          <p className="text-gray-400 mb-6">
            Инструкции по восстановлению пароля отправлены на{' '}
            <span className="text-amber-500">{email}</span>
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Проверьте папку "Спам", если письмо не пришло в течение нескольких минут.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 transition font-bold uppercase tracking-wider"
            >
              Войти
            </button>
            <button 
              onClick={() => setEmailSent(false)}
              className="px-8 py-3 border border-amber-600 hover:bg-amber-600/10 transition font-bold uppercase tracking-wider"
            >
              Отправить снова
            </button>
          </div>
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
              onClick={() => navigate('/login')}
              className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition text-sm"
            >
              <ArrowLeft size={18} />
              <span>Назад ко входу</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Восстановление пароля
            </h1>
            <p className="text-gray-400">
              Введите email, указанный при регистрации. Мы отправим вам инструкции по восстановлению пароля.
            </p>
          </div>

          {/* Form */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-amber-900/30 p-8 md:p-10">
            {/* Email */}
            <div className="mb-8">
              <label className="block text-sm font-bold mb-2 text-amber-500 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-amber-900/30'} pl-11 pr-4 py-3 text-white focus:outline-none focus:border-amber-600 transition`}
                  placeholder="your@email.com"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle size={14} className="mr-1" />
                  {error}
                </p>
              )}
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
              {isSubmitting ? 'Отправка...' : 'Отправить инструкции'}
            </button>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Вспомнили пароль?{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="text-amber-500 hover:text-amber-400 font-semibold"
                >
                  Войти
                </button>
              </p>
            </div>
          </div>

          {/* Info Block */}
          <div className="mt-8 bg-amber-950/20 border border-amber-900/30 p-6">
            <h3 className="text-amber-500 font-bold mb-2 uppercase tracking-wider text-sm">
              Важная информация
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Письмо придёт в течение 5-10 минут</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Проверьте папку "Спам" или "Промоакции"</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Ссылка для восстановления действительна 24 часа</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Если email не приходит, свяжитесь с поддержкой</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;