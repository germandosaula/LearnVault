# LearnVault

![LearnVault Img](public/dashboard.png)

LearnVault es una plataforma colaborativa que permite a los usuarios almacenar, compartir y gestionar recursos educativos de manera eficiente. Diseñada para estudiantes, docentes y entusiastas del aprendizaje, LearnVault facilita la organización y el acceso a materiales de estudio en un entorno interactivo y organizado.

## 🚀 Características

- 📂 **Repositorio de Recursos**: Subida y gestión de materiales educativos.
- 🔍 **Búsqueda Avanzada**: Encuentra recursos rápidamente con filtros personalizados.
- 📅 **Planificación de Estudio**: Herramientas para organizar tu aprendizaje.
- 💬 **Interacción Comunitaria**: Comenta y valora recursos compartidos.
- 🎨 **Personalización**: Adapta la experiencia según tus preferencias.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js, Material-UI
- **Backend**: Flask, Python
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **Almacenamiento**: FireBase Storage
- **Despliegue**: Render (en proceso)

## 📦 Instalación y Configuración

### 1️⃣ Clonar el Repositorio
```bash
 git clone https://github.com/germandosaula/LearnVault.git
 cd LearnVault
```

### 2️⃣ Backend
#### Configurar Entorno Virtual
```bash
 python -m venv venv
 source venv/bin/activate  # En Windows: venv\Scripts\activate
```

#### Instalar Dependencias
```bash
 pip install
```

#### Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/learnvault
SECRET_KEY=
FRONTEND_URL=
BACKEND_URL=
```

#### Ejecutar el Servidor
```bash
 flask run
```

### 3️⃣ Frontend
#### Instalar Dependencias
```bash
 npm install
```

#### Ejecutar la Aplicación
```bash
 npm run
```

## 📬 Contacto
Si tienes preguntas o sugerencias, no dudes en contactarme:
- 📧 **Email**: german.dosaula@gmail.com
- 🐙 **GitHub**: [@germandosaula](https://github.com/germandosaula)  
- 💼 **LinkedIn**: [German Dosaula](https://linkedin.com/in/german-dosaula-ces)

---
