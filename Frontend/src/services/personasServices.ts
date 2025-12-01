const API_BASE_URL = 'http://127.0.0.1:8000';

export const personaService = {
  async getPersonas(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/personas/`);
    if (!response.ok) throw new Error('Error fetching personas');
    return response.json();
  },

  async getDocentes(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/docentes/`);
    if (!response.ok) throw new Error('Error fetching docentes');
    return response.json();
  },

  async getPersonaByRol(rolId: number): Promise<any> {
    const personas = await this.getPersonas();
    return personas.find(p => p.rol_id === rolId);
  }
};