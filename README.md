# Reporte Académico para una Facultad

<img height="100" alt="ReporteAcademico" width="100%" src="README/marquee.svg" />

<div>

## Stack 🛠️
<br>
<img align="left" src="README/icon/python.png" />
<img align="left" src="README/icon/fastAPI.png" width="32" height="32"/>
<img align="left" src="README/icon/SQLite.png" width="32" height="32"/>
<img align="left" src= "README/icon/react.png" widht="32" height="32"/>
<img align="left" src="README/icon/javascript.png" widht="32" height="32"/>
<img align="left" src= "README/icon/Tailwind CSS.png" widht="32" height="32"/>
<img align="left" src= "README/icon/Bootstrap.png" widht="32" height="32"/>
<img align="left" src="README/icon/CSS3.png" width="32" height="32"/>

<br>
</div>
<br>

## Indice
- [Introducción](#introducción)
- [Autores](#autores)
- [Elementos](#elementos)
- [Ayuda](#ayuda)
- [Instalación](#instalación)

### Introducción 📄
<p align="justify">
El proyecto se enmarca en el desarrollo de un sistema de reportes académicos para la Facultad de Ingeniería, con el objetivo de permitir la visualización de indicadores de
gestión, a partir de la administración de diferentes instrumentos de relevamiento, como encuestas para estudiantes e informes de cátedra. 

</p>

### Autores 👨‍💻 
 - [![Static Badge](https://img.shields.io/badge/Lautaro_Lagos-black?logo=GitHub)](https://github.com/FunnLagos2k)
 - [![Static Badge](https://img.shields.io/badge/Lautaro_Moraga-black?logo=GitHub)](https://github.com/Moraga1201)
 - [![Static Badge](https://img.shields.io/badge/Juan_Riquelme-black?logo=GitHub)](https://github.com/Juanownn)
 - [![Static Badge](https://img.shields.io/badge/Agustin_Pacheco-black?logo=GitHub)](https://github.com/aguspacheco)

## Elementos 📋
- Python 3.13.7  
- Node v22.19.0
- FastAPI 0.116.1  
- Sqlite
- React 18.x
- Bootstrap 5.x

## Ayuda 📚
<a> 🐍 https://www.python.org/downloads/ </a>
<a> ⚡ https://fastapi.tiangolo.com/ </a>
<a> 🅱️ https://react-bootstrap.netlify.app/docs/getting-started/introduction/ </a>
<a> ⚛️ https://es.react.dev/ </a>

## Instalción ⚙️
## Backend 🚀
### ![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)
~~~
#Clonar el repositorio:
git clone https://github.com/UNPSJB/RA-grupo-1.git

#Crear el entorno virtual:
python -m venv <venv>

#Activar el entorno virtual:
source <venv>/Scripts/activate

#Instalar las dependencias
pip install -r requirements.txt

#Acceder al proyecto
cd RA-grupo-1\Backend\

#Ejecutarlo 
uvicorn src.main:app --reload
~~~

### ![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
~~~
#Clonar el repositorio:
git clone https://github.com/UNPSJB/RA-grupo-1.git

#Instalar el entorno virtual:
sudo apt install python-venv (esto puede variar segun la distribucion) 

#Crear el entorno virtual:
python -m venv venv 

#Activar el entorno virtual:
source ./venv/bin/activate

#Instalar las dependencias
pip install -r requirements.txt
~~~

Una vez corriendo el proyecto dirigirse a la siguiente url: `http://127.0.0.1:8000/docs` 

# Frontend 🚀
~~~
#Si ya tienes el proyecto configurado, y estas parado sobre la carpeta Frontend, simplemente ejecuta:
npm install

#Esto instalará todas las dependencias y podrás iniciar el servidor con:
npm run dev
~~~