# VetSync

Sistema de gestión de citas y telemedicina veterinaria. Prototipo funcional de interfaz hecho con Vue 3.

Tres vistas, que se cambian con el selector de arriba a la derecha:

- **Cliente** (dueño de la mascota): ve sus citas y vacunas, agenda y reprograma citas, adjunta fotos, entra a la sala de espera y a la videoconsulta.
- **Veterinario**: agenda por día y por semana, confirma o rechaza citas, inicia la consulta, escribe la nota clínica y consulta el historial de los pacientes.
- **Recepción** (administración de la clínica): define días y horarios de cada veterinario, los marca como disponibles o no, agrega veterinarios y gestiona la agenda general.

## Cómo correrlo

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # genera dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

Requiere Node 18 o superior.

## Estructura

```
src/
  main.js                 arranque, Pinia y guardado en localStorage
  App.vue                 cabecera, pestañas y pantalla activa
  stores/
    clinic.js             datos y reglas de negocio (citas, horarios, notas clínicas)
    ui.js                 rol activo, pantalla, cita abierta, avisos
  lib/                    constantes, fechas, formato, vacunas, imágenes, datos de ejemplo
  styles/                 tokens de color y tipografía, estilos globales
  components/
    client/               ClientHome, BookingForm, MyPets
    vet/                  VetAgenda, WeekCalendar, PatientsView
    admin/                StaffView, AllAppointments
    consult/              ConsultRoom, WaitingRoom, VideoStage, ChatPanel, AttachmentsPanel, ClinicalNote
    shared/               AppHeader, TabBar, StatusPill, ThumbGrid, ImagePicker, ImageZoom, ToastHost
```

La lógica que decide qué horas se pueden agendar (`slotsFor` en `stores/clinic.js`) considera tres cosas: que el veterinario esté disponible, que ese día y hora estén dentro de su horario, y que no haya otra cita en ese espacio.

## Qué es real y qué está simulado

| Parte | Estado |
| --- | --- |
| Agendar, reprogramar, cancelar, confirmar | Funciona con reglas reales de disponibilidad |
| Nota clínica e historial | Funciona; la nota se guarda en el historial del paciente |
| Horarios por veterinario | Funciona; cambia las horas que ve el cliente |
| Fotos adjuntas | Funciona con imágenes reducidas a 900 px, guardadas en el navegador |
| Datos | Se guardan solo en este navegador (`localStorage`). No hay servidor |
| Sesión y roles | Simulados con el selector de rol. No hay inicio de sesión |
| Videollamada | Simulada. La sala muestra controles y un cronómetro, sin cámara real |
| Sala de espera | El botón "Simular" reemplaza el aviso que enviaría el servidor |

## Siguientes pasos

1. Backend con Supabase: autenticación, tablas y políticas de seguridad por rol.
2. Subir las imágenes a un almacenamiento de archivos en lugar de guardarlas en el navegador.
3. Videollamada real con WebRTC (por ejemplo LiveKit o Daily).
4. Enrutador (`vue-router`) para que cada pantalla tenga su propia URL.
5. Pruebas automáticas de los flujos de agenda.
