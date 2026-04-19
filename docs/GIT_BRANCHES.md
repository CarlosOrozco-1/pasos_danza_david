# 🔀 Git Branching Strategy - Pasos de Danza

## Estructura de Ramas

```
main (master) - Producción en vivo
│
├── pro - Rama de Producción (estable)
│   └── Tags: v1.0, v1.1, etc
│
└── desa - Rama de Desarrollo (cambios nuevos)
    └── Aquí se agregan features antes de producción
```

---

## 📋 Guía de Uso

### 1. Ver ramas locales
```bash
git branch
```

### 2. Ver todas las ramas (local + remoto)
```bash
git branch -a
```

### 3. Crear ramas locales desde main
```bash
# Rama de desarrollo
git checkout -b desa

# Rama de producción
git checkout -b pro
```

### 4. Cambiar entre ramas
```bash
# Ir a desarrollo
git checkout desa

# Ir a producción
git checkout pro
```

---

## 🔄 Flujo de Trabajo

### Desarrollo (desa)
```
1. git checkout desa
2. Realizar cambios (nuevas features)
3. git add .
4. git commit -m "Agregar feature X"
5. git push origin desa
```

### Producción (pro)
```
1. Cuando desa está estable:
   git checkout pro
   git merge desa
   git push origin pro

2. Crear versión:
   git tag -a v1.0 -m "Versión 1.0"
   git push origin v1.0
```

---

## 📝 Convenciones de Commits

### Desarrollo
```
git commit -m "feat: agregar edición de pasos"
git commit -m "fix: arreglar tamaño modal"
git commit -m "docs: actualizar README"
```

### Producción
```
git commit -m "Release v1.0: Features iniciales"
git tag v1.0
```

---

## 🎯 Estado Actual del Proyecto

- **main/master**: Rama inicial (no tocas)
- **desa**: ← **TÚ ESTÁS AQUÍ** (cambios nuevos)
- **pro**: Para releases estables

---

## Comandos Rápidos

```bash
# Crear ramas en remoto
git push -u origin desa
git push -u origin pro

# Actualizar rama local desde remoto
git fetch origin
git pull origin desa

# Ver diferencias entre ramas
git diff desa pro
```

---

## 🚨 Importante

**NUNCA** hagas cambios directamente en:
- ❌ `main` o `master`
- ❌ `pro` (solo para releases)

**SIEMPRE** trabaja en:
- ✅ `desa` (desarrollo diario)
- ✅ Crea branches locales para features si es needed

---

## Próximas Acciones

1. [ ] Crear rama `desa` localmente
2. [ ] Crear rama `pro` localmente
3. [ ] Hacer push a GitHub
4. [ ] Configurar protecciones de ramas en GitHub (opcional)

---

**¿Necesitas ayuda con Git?** Avísame el comando exacto que quieras ejecutar.
