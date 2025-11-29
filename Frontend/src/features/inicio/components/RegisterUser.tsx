import React, { useState, useEffect } from 'react';

type RoleType = 'alumno' | 'docente' | 'departamento' | 'secretaria';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  username: string;
  password: string;
  confirmPassword: string;
  role_type: RoleType | '';
  CUIL: string;
  legajo: string;
  departamento_id: string;
}

interface Departamento {
  id: number;
  nombre: string;
}

export default function Register() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    username: '',
    password: '',
    confirmPassword: '',
    role_type: '',
    CUIL: '',
    legajo: '',
    departamento_id: ''
  });

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/departamentos/');
      if (response.ok) {
        const data = await response.json();
        setDepartamentos(data);
      }
    } catch (err) {
      console.error('Error al cargar departamentos:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.nombre.trim()) return 'El nombre es requerido';
    if (!formData.apellido.trim()) return 'El apellido es requerido';
    if (!formData.email.trim()) return 'El email es requerido';
    if (!formData.dni.trim()) return 'El DNI es requerido';
    if (!formData.username.trim()) return 'El usuario es requerido';
    if (!formData.password) return 'La contraseña es requerida';
    if (formData.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden';
    if (!formData.role_type) return 'Debes seleccionar un tipo de usuario';

    if (formData.role_type === 'alumno') {
      if (!formData.CUIL.trim()) return 'El CUIL es requerido para alumnos';
      if (!formData.legajo.trim()) return 'El legajo es requerido para alumnos';
    } else if (formData.role_type === 'docente') {
      if (!formData.legajo.trim()) return 'El legajo es requerido para docentes';
    } else if (formData.role_type === 'departamento') {
      if (!formData.departamento_id) return 'Debes seleccionar un departamento';
    } else if (formData.role_type === 'secretaria') {
      if (!formData.legajo.trim()) return 'El legajo es requerido para secretaría';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        dni: formData.dni,
        username: formData.username,
        password: formData.password,
        role_type: formData.role_type
      };

      if (formData.role_type === 'alumno') {
        payload.CUIL = formData.CUIL;
        payload.legajo = parseInt(formData.legajo);
      } else if (formData.role_type === 'docente') {
        payload.legajo = parseInt(formData.legajo);
      } else if (formData.role_type === 'departamento') {
        payload.departamento_id = parseInt(formData.departamento_id);
      } else if (formData.role_type === 'secretaria') {
        payload.legajo = parseInt(formData.legajo);
      }

      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrarse');
      }

      setSuccess(true);

    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (!formData.role_type) return null;

    switch (formData.role_type) {
      case 'alumno':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CUIL *</label>
              <input
                type="text"
                name="CUIL"
                placeholder="20-12345678-9"
                value={formData.CUIL}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Legajo *</label>
              <input
                type="number"
                name="legajo"
                placeholder="12345"
                value={formData.legajo}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        );

      case 'docente':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legajo *</label>
            <input
              type="number"
              name="legajo"
              placeholder="12345"
              value={formData.legajo}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
        );

      case 'departamento':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departamento *</label>
            <select
              name="departamento_id"
              value={formData.departamento_id}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              <option value="">Selecciona un departamento...</option>
              {departamentos.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.nombre}
                </option>
              ))}
            </select>
          </div>
        );

      case 'secretaria':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legajo *</label>
            <input
              type="number"
              name="legajo"
              placeholder="12345"
              value={formData.legajo}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="text-center text-white mb-8">
          <h1 className="text-5xl font-bold mb-3">Crear Cuenta</h1>
          <p className="text-xl opacity-90">Completa el formulario para registrarte</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>❌ {error}</span>
              <button onClick={() => setError(null)} className="text-red-800 font-bold">✕</button>
            </div>
          )}

          <div onSubmit={handleSubmit}>
            {/* Selector de Rol */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuario *</label>
              <select
                name="role_type"
                value={formData.role_type}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base"
              >
                <option value="">Selecciona el tipo de usuario...</option>
                <option value="alumno">🎓 Alumno</option>
                <option value="docente">👨‍🏫 Docente</option>
                <option value="departamento">🏢 Departamento de Alumnos</option>
                <option value="secretaria">📋 Secretaría Académica</option>
              </select>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Datos Personales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Juan"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                placeholder="juan.perez@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">DNI *</label>
              <input
                type="text"
                name="dni"
                placeholder="12345678"
                value={formData.dni}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {formData.role_type && (
              <>
                <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Datos Específicos</h3>
                <div className="mb-6">
                  {renderRoleSpecificFields()}
                </div>
              </>
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Datos de Acceso</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
              <input
                type="text"
                name="username"
                placeholder="juan.perez"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <p className="text-sm text-gray-500 mt-1">Este será tu nombre de usuario para iniciar sesión</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Mínimo 8 caracteres</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-lg text-white font-bold text-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Registrando...
                </span>
              ) : (
                'Crear Cuenta'
              )}
            </button>

            <div className="text-center mt-4">
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                ¿Ya tienes cuenta? Inicia sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}