<p align="center">
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp8B9HmOQMJSOdFpBzC0YJXoXjHlS-QizdZg&s" alt="Pawwi Logo" width="120"/>
</p>

<h1 align="center">Pawwi</h1>
<p align="center"><i>Cuidadores confiables de mascotas en tu zona 🐶🐱</i></p>

<p align="center">
  🌐 <a href="https://pawwi.co">Página oficial</a> | 
  🚀 <a href="https://pawwilead.github.io/pawwi/">Versión en GitHub Pages</a>
</p>

---

## 📌 Sobre el proyecto

Este es el código fuente de la aplicación web de **Pawwi**, desarrollada con [Angular](https://angular.io/).  
Aquí se encuentran las vistas principales del sitio y el despliegue en **GitHub Pages**.

---

## 🖥️ Requisitos del PC para editar el sitio

Para trabajar en este proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) **v18 o superior**
- [npm](https://www.npmjs.com/) (se instala junto con Node.js)
- [Angular CLI](https://angular.io/cli) **v16+**
- Un editor de código (recomendado: [Visual Studio Code](https://code.visualstudio.com/))

# -----------------------------
# Script para publicar Angular a GitHub Pages
# -----------------------------

# 1️⃣ Borrar build anterior
Write-Host "🔹 Eliminando build anterior..."
Remove-Item -Recurse -Force dist\pawwi

# 2️⃣ Generar build de producción
Write-Host "🔹 Generando build de producción..."
ng build --configuration production --base-href "/pawwi/"

# 3️⃣ Publicar a GitHub Pages
Write-Host "🔹 Publicando a GitHub Pages..."
npx angular-cli-ghpages --dir=dist/pawwi

Write-Host "✅ Despliegue completo. Verifica en https://pawwilead.github.io/pawwi/"
