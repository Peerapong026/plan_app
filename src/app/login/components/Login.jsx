'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import Image from 'next/image';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
// import LogoSF from '../../../public/SFLogo.png';
import Container from '../components/Container'; // แก้ path ให้ถูกถ้าจำเป็น

function LoginPage() {
  const [id_name, setid_name] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!id_name || !password) {
    setErrorMessage('กรุณากรอกอีเมลและรหัสผ่าน');
    setShowErrorPopup(true);
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
    }

    // เก็บข้อมูล user
    localStorage.setItem('user', JSON.stringify(data));

    // ✅ Redirect ตาม role
    if (data.role === 'admin') {
      router.push('/dashboard');
    } else if (data.role === 'member') {
      router.push('/plan_calendar');
    } else {
      throw new Error('ไม่พบสิทธิ์ของผู้ใช้');
    }

  } catch (err) {
    setErrorMessage(err.message || 'เกิดข้อผิดพลาด');
    setShowErrorPopup(true);
  } finally {
    setLoading(false);
  }
};

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 px-4">
        <div className="w-full max-w-md bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-10">
          <div className="flex justify-center mb-6">
            {/* <Image src={LogoSF} width={180} alt="Logo" /> */}
          </div>

          <h3 className="text-center text-3xl font-bold text-indigo-700 mb-8">เข้าสู่ระบบ</h3>

          <form onSubmit={handleLogin}>
            <div className="relative mb-5">
              <FaUser className="absolute left-3 top-3.5 text-indigo-500" />
              <input
                type="id_name"
                value={id_name}
                onChange={(e) => setid_name(e.target.value)}
                placeholder="Username"
                className="w-full py-2 pl-10 pr-4 rounded-xl bg-white/80 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-800 placeholder-indigo-400 shadow-sm"
              />
            </div>

            <div className="relative mb-6">
              <FaLock className="absolute left-3 top-3.5 text-indigo-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                className="w-full py-2 pl-10 pr-10 rounded-xl bg-white/80 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-800 placeholder-indigo-400 shadow-sm"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-indigo-500 hover:text-indigo-700 text-lg"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-full font-semibold shadow-md transition-all duration-300 ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="text-center text-sm text-indigo-600 mt-6">
            © 2025 Strikeforce Thailand
          </p>
        </div>
      </div>

      {/* Popup แสดงข้อผิดพลาด */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-96 bg-white p-8 rounded-xl shadow-lg animate__animated animate__shakeX">
            <h3 className="text-center text-2xl font-bold text-red-700 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-center text-red-600">{errorMessage}</p>
            <div className="flex justify-center mt-6">
              <button
                onClick={closeErrorPopup}
                className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default LoginPage;
