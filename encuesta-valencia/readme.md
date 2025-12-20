# 📊 Encuesta Ciudadana Valencia

Sistema de encuestas anónimas para evaluar problemáticas en los barrios de Valencia.

## 🌐 Demo en vivo

[https://tu-usuario.github.io/encuesta-valencia](https://tu-usuario.github.io/encuesta-valencia)

*(Reemplaza `tu-usuario` con tu nombre de usuario de GitHub)*

## ✨ Características

- ✅ **9 preguntas** sobre problemáticas urbanas
- ✅ **19 barrios** de Valencia incluidos
- ✅ **Control de envíos**: 1 encuesta cada 3 meses por dispositivo
- ✅ **Panel de administración** con estadísticas y gráficas
- ✅ **Exportación a CSV/Excel** para análisis
- ✅ **Cumplimiento RGPD** con consentimiento explícito
- ✅ **Responsive**: Funciona en móvil, tablet y desktop
- ✅ **Sin servidor**: Funciona con GitHub Pages

## 📋 Preguntas de la encuesta

1. Seguridad ciudadana (delincuencia, iluminación nocturna)
2. Limpieza y residuos (basuras, limpieza de calles)
3. Transporte público (frecuencia, conexiones)
4. Zonas verdes y jardines (mantenimiento, cantidad)
5. Ruido y contaminación
6. Estado de calles y aceras
7. Servicios sanitarios
8. Comercio local
9. Vivienda (acceso, precios)

## 🏘️ Barrios incluidos

Ciutat Vella, Eixample, Extramurs, Campanar, La Saïdia, El Pla del Real, L'Olivereta, Patraix, Jesús, Quatre Carreres, Poblats Marítims, Camins al Grau, Algirós, Benimaclet, Rascanya, Benicalap, Pobles del Nord, Pobles de l'Oest, Pobles del Sud

## 🔐 Acceso Administrador

Para acceder al panel de administración:

1. Haz clic en el icono ⚙️ en la esquina inferior derecha del formulario
2. Contraseña: `admin2025`

### Funcionalidades del panel admin:

- Ver estadísticas por barrio
- Exportar datos a CSV
- Activar/desactivar modo práctica
- Ver total de encuestas recibidas
- Tabla resumen con códigos de color según problemática

## 📱 Cómo usar

### Para ciudadanos:

1. Abre el enlace de la encuesta
2. Selecciona tu barrio del desplegable
3. Valora cada problemática del 0 al 10
   - **0** = Sin problemas
   - **10** = Problema muy grave
4. Acepta el consentimiento de protección de datos
5. Haz clic en "Enviar Encuesta"

### Para administradores:

1. Accede con la contraseña
2. Revisa las estadísticas
3. Exporta los datos cuando lo necesites

## 🛡️ Privacidad y RGPD

- Los datos son completamente **anónimos**
- Solo se registra: barrio, respuestas y fecha
- Se asigna un ID único al dispositivo (no identifica a la persona)
- Cumple con el **RGPD** y la **Ley Orgánica 3/2018**
- El usuario debe dar consentimiento explícito antes de enviar

## 🛠️ Tecnologías utilizadas

- **React 18** - Framework JavaScript
- **Tailwind CSS** - Estilos y diseño responsive
- **Recharts** - Gráficas y visualización de datos
- **LocalStorage** - Almacenamiento local de datos
- **GitHub Pages** - Hosting gratuito

## 🚀 Instalación y despliegue

### Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/encuesta-valencia.git
cd encuesta-valencia
```

### Abrir localmente:

Simplemente abre el archivo `index.html` en tu navegador.

### Desplegar en GitHub Pages:

1. Sube el repositorio a GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` y carpeta `/ (root)`
4. Guarda y espera 1-2 minutos
5. Tu encuesta estará disponible en: `https://tu-usuario.github.io/encuesta-valencia`

## 📊 Exportación de datos

Los datos se pueden exportar en formato CSV desde el panel de administración. El archivo incluye:

- Fecha
- Hora
- Barrio
- ID del dispositivo
- Puntuaciones de las 9 preguntas

Compatible con Excel, Google Sheets y herramientas de análisis de datos.

## ⚙️ Configuración

### Modo Práctica

Por defecto está **activado** para permitir múltiples envíos durante pruebas.

- **Modo Práctica ON**: Permite envíos ilimitados
- **Modo Práctica OFF**: Límite de 1 encuesta cada 3 meses por dispositivo

Se puede cambiar desde el panel de administración.

### Cambiar contraseña de admin

Edita el archivo `index.html` y busca:

```javascript
if (adminPassword === 'admin2025') {
```

Cambia `'admin2025'` por tu contraseña personalizada.

## 📈 Próximas mejoras planificadas

- [ ] Integración con base de datos Supabase
- [ ] Gráficas comparativas más avanzadas
- [ ] Filtros por fecha y rango temporal
- [ ] Exportación a PDF con informe automático
- [ ] Integración con WhatsApp para encuestas por chat
- [ ] Dashboard público con estadísticas en tiempo real

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún error o tienes sugerencias:

1. Abre un Issue
2. Haz un Fork del proyecto
3. Crea una rama con tu mejora
4. Envía un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👥 Autor

Proyecto educativo para la mejora ciudadana de Valencia.

## 📞 Contacto

Para dudas o sugerencias sobre el proyecto, abre un Issue en GitHub.

---

**⭐ Si te resulta útil este proyecto, dale una estrella en GitHub!**