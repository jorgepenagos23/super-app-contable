# 📊 Super App Contable - Conciliación Fiscal & ERP

Una aplicación web moderna e intuitiva desarrollada con **Next.js 16**, **React 19** y **Tailwind CSS** para la conciliación automatizada de facturas, auditoría de compras y validación de registros entre archivos Excel/XML y sistemas ERP.

---

## 📸 Capturas de Pantalla y Vista Previa

### 1. Dashboard Principal y Métricas
Visualización general del estado financiero con tarjetas de métricas en tiempo real, tabla de facturas conciliadas vs. pendientes y sistema de pestañas de filtrado.

![Dashboard Principal](public/screenshots/dashboard.png)

### 2. Modal de Auditoría y Conciliación
Herramienta de auditoría detallada que compara datos de facturas cargadas con los registros ERP, mostrando porcentajes de coincidencia, desgloses de impuestos y acciones manuales de conciliación.

![Modal de Auditoría](public/screenshots/audit_modal.png)

---

## ✨ Características Principales

- 📁 **Carga Inteligente de Archivos**: Procesamiento rápido de hojas de cálculo de facturas y archivos de compras (Excel / CSV / XML).
- 🔄 **Motor de Conciliación Automática**: Algoritmo de emparejamiento de facturas con registros ERP por folio, monto, RFC/proveedor e impuestos.
- 📈 **Métricas y Resumen de Proveedores**: Tarjetas dinámicas con totales facturados, montos conciliados, discrepancias identificadas y desgloses por proveedor.
- 🔍 **Auditoría Detallada**: Inspección individual de facturas para analizar discrepancias y aprobar conciliaciones con un solo clic.
- 🔐 **Control de Acceso e Integraciones**: Modales dedicados para gestión de usuarios, roles de acceso y credenciales de integración API.

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18.x o superior
- npm / yarn / pnpm

### Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   Navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Biblioteca UI:** [React 19](https://react.dev/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Procesamiento de Archivos:** `xlsx`
- **Lenguaje:** TypeScript
