import { Usuario, Carrera, EstadisticasGenerales } from '../types/secretariaTypes';

// Simulamos datos para el desarrollo
const usuariosMock: Usuario[] = [
  {
    id: 1,
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@unp.edu.ar',
    rol: 'secretaria',
    activo: true,
    fechaCreacion: '2025-01-15'
  },
  {
    id: 2,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@unp.edu.ar',
    rol: 'docente',
    activo: true,
    fechaCreacion: '2025-02-20'
  }
];

const carrerasMock: Carrera[] = [
  {
    id: 1,
    nombre: 'Licenciatura en Sistemas',
    codigo: 'LSI',
    departamento: 'Departamento de Informática',
    cantidadAsignaturas: 32,
    activa: true
  },
  {
    id: 2,
    nombre: 'Quimica',
    codigo: 'IQ',
    departamento: 'Departamento de Ingeniería',
    cantidadAsignaturas: 35,
    activa: true
  }
];

export const secretariaService = {
 
  obtenerEstadisticas: async (): Promise<EstadisticasGenerales> => {
    // Simulamos la llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsuarios: 1500,
          totalAlumnos: 1200,
          totalDocentes: 250,
          totalEncuestasCompletadas: 8500,
          totalEncuestasPendientes: 1200,
          carrerasActivas: 15
        });
      }, 500);
    });
  },

  obtenerUsuarios: async (): Promise<Usuario[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(usuariosMock);
      }, 500);
    });
  },


  obtenerCarreras: async (): Promise<Carrera[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(carrerasMock);
      }, 500);
    });
  },

  crearUsuario: async (usuario: Omit<Usuario, 'id' | 'fechaCreacion'>): Promise<Usuario> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevoUsuario: Usuario = {
          ...usuario,
          id: Date.now(),
          fechaCreacion: new Date().toISOString().split('T')[0]
        };
        resolve(nuevoUsuario);
      }, 500);
    });
  },

  actualizarUsuario: async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usuarioActualizado = { ...usuariosMock[0], ...usuario, id };
        resolve(usuarioActualizado);
      }, 500);
    });
  }
};