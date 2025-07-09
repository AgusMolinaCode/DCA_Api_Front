# DCA Crypto - Frontend

Aplicación web completa para gestionar estrategias de Dollar Cost Averaging (DCA) en criptomonedas. Permite a los usuarios realizar seguimiento detallado de sus inversiones, analizar el rendimiento con datos ATH y consultar con un asistente AI inteligente sobre su portfolio.

## 🚀 Características Principales

### 💰 Gestión de Inversiones DCA
- **CRUD Completo**: Crear, leer, actualizar y eliminar registros de compras cripto
- **Seguimiento en Tiempo Real**: Monitoreo del valor actual vs inversión inicial
- **Múltiples Criptomonedas**: Soporte para diversas cryptos populares

### 📈 Análisis ATH (All-Time High)
- **Cálculo de Potencial**: Visualiza cuánto valdría tu portfolio si cada crypto estuviera en su ATH
- **Comparativas**: Análisis del rendimiento actual vs máximos históricos
- **Métricas Avanzadas**: ROI, porcentajes de ganancia y proyecciones

### 🎯 Bolsas de Inversión
- **Metas Personalizadas**: Crea objetivos de inversión específicos
- **Planificación**: Organiza tus compras para alcanzar metas financieras
- **Seguimiento de Progreso**: Visualiza el avance hacia tus objetivos

### 🤖 Chat AI con DeepSeek
- **Asistente Inteligente**: Chat integrado con contexto completo de tu portfolio
- **Consultas Especializadas**: Pregunta sobre estrategias DCA, análisis de riesgo y optimización
- **Respuestas Contextuales**: El AI conoce tus inversiones actuales para dar consejos personalizados
- **Disponible 24/7**: Resuelve dudas sobre tu estrategia de inversión en cualquier momento

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI**: Componentes responsivos y modernos
- **Fuente**: Geist (Vercel)

### Backend & Base de Datos
- **Backend**: Go (Golang)
- **Base de Datos**: PostgreSQL
- **Deploy**: Railway Platform
- **API**: RESTful endpoints

### Inteligencia Artificial
- **Modelo**: DeepSeek AI
- **Integración**: Chat contextual con datos del portfolio
- **Funcionalidad**: Asesoramiento financiero personalizado

## 🏃‍♂️ Instalación y Uso

### Prerrequisitos

- Node.js 18+
- npm/yarn/pnpm/bun
- Acceso al backend desplegado en Railway

### Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/AgusMolinaCode/DCA_Api_Front.git
cd DCA_Api_Front
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Panel principal de usuario
│   ├── portfolio/         # Gestión de portfolio
│   ├── chat/             # Chat AI con DeepSeek
│   ├── goals/            # Bolsas de inversión
│   └── ath/              # Análisis ATH
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base UI
│   ├── crypto/           # Componentes específicos de crypto
│   ├── chat/             # Componentes del chat AI
│   └── charts/           # Gráficos y visualizaciones
├── lib/                  # Utilidades y configuraciones
│   ├── api/              # Clientes API
│   ├── utils/            # Funciones helper
│   └── types/            # Definiciones TypeScript
├── hooks/                # Custom React hooks
└── public/               # Assets estáticos
```

## 🎯 Funcionalidades Detalladas

### 💼 Dashboard Principal
- Resumen general del portfolio
- Gráficos de rendimiento
- Métricas clave (ROI, valor total, ganancias/pérdidas)

### 📊 Gestión de Criptomonedas
- Agregar nuevas compras DCA
- Editar registros existentes
- Eliminar inversiones
- Historial completo de transacciones

### 🎪 Chat AI Inteligente
- **Contexto Completo**: El AI conoce todas tus inversiones actuales
- **Consultas Naturales**: "¿Cuál es mi mejor crypto?" o "¿Debería comprar más Bitcoin?"
- **Análisis Personalizados**: Sugerencias basadas en tu portfolio específico
- **Estrategias DCA**: Consejos sobre frecuencia y montos de compra

### 🏆 Análisis ATH
- Cálculo automático de valores en ATH
- Visualización del potencial no realizado
- Comparativas históricas

## 🚀 Deploy

La aplicación está optimizada para deployment en:
- **Vercel** (recomendado para frontend)
- **Netlify**
- **Railway** (para full-stack)

### Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AgusMolinaCode/DCA_Api_Front)

## 🔐 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=tu_backend_railway_url
NEXT_PUBLIC_DEEPSEEK_API_KEY=tu_deepseek_key
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 🏗️ Roadmap

- [ ] Integración con más exchanges
- [ ] Alertas de precios personalizadas
- [ ] Análisis técnico avanzado
- [ ] Exportación de reportes PDF
- [ ] App móvil React Native

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Agustín Molina**
- GitHub: [@AgusMolinaCode](https://github.com/AgusMolinaCode)
- LinkedIn: [Agustín Molina]([https://linkedin.com/in/agustin-molina-dev](https://www.linkedin.com/in/agustin-molina-994635138/))


---

⭐ ¡Dale una estrella si te gusta el proyecto!
