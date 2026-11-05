# Evaluación Parcial N° 2: Desarrollo de Pruebas Unitarias y Análisis de Seguridad II
**Asignatura:** Ciclo de Vida del Software I (AUY1102)  
**Institución:** Duoc UC  
**Ponderación:** 40%  
**Equipo de Trabajo:** Grupo 4  
**Integrantes:** Simón Lagos (`simlagos`) y Compañero de Equipo  
**Repositorio Oficial:** [https://github.com/grupo-4duoc/AUY1102-Pipeline](https://github.com/grupo-4duoc/AUY1102-Pipeline)  
**Fecha:** Noviembre 2026  

---

## 1. Introducción y Contexto del Caso

La empresa **"Integration Solutions"** se encuentra implementando una transformación digital integral con el objetivo de optimizar sus prácticas de ingeniería de software. Históricamente, la organización dependía de flujos manuales de despliegue y pruebas esporádicas, lo que resultaba en ciclos de entrega lentos, alta tasa de regresiones en producción y una considerable acumulación de deuda técnica.

Como solución estratégica, se definió la adopción de **GitHub** como plataforma centralizada de colaboración y automatización CI/CD, incorporando:
1. Aseguramiento de calidad funcional mediante **pruebas unitarias automatizadas** y métricas de **cobertura de código**.
2. **Análisis estático de seguridad (SAST)** y calidad continua mediante **SonarCloud**.
3. **Escaneo de vulnerabilidades en dependencias y código** a través de **Snyk** y **npm audit**.
4. **Protección de secretos y gestión de dependencias** mediante **GitHub Advanced Security** y Dependabot.
5. Colaboración formal en equipo mediante **política de ramas (branching)**, **Pull Requests cruzados** y **revisión de código entre pares (Peer Review)**.

---

## 2. Marco Teórico y Conceptual (Indicador IE3.1.1)

### 2.1. Pruebas Unitarias (Unit Testing)
Las pruebas unitarias corresponden al nivel base de la pirámide de testing (Martin Fowler). Tienen como propósito aislar y validar el comportamiento de la unidad lógica más pequeña y atómica del sistema (funciones, clases, métodos) sin interactuar con dependencias externas como bases de datos, APIs de terceros o sistemas de archivos.
* **Aislamiento:** Se logra mediante el uso de dobles de prueba (*mocks*, *stubs*, *spies* y *mother objects*).
* **Beneficio:** Brindan retroalimentación instantánea al desarrollador, reduciendo drásticamente el costo de corrección de defectos según el principio *Shift-Left*.

### 2.2. Calidad del Código: Análisis Estático vs. Análisis Dinámico
* **Análisis Estático de Código (SAST):** Inspecciona el código fuente sin ejecutarlo. Permite detectar de forma temprana violaciones a estándares de codificación (linting), errores de tipado (TypeScript), malas prácticas de arquitectura (SOLID) y patrones de vulnerabilidad de seguridad (OWASP/CWE). Herramientas aplicadas: *ESLint, SonarCloud, Snyk Code, CodeQL*.
* **Análisis Dinámico de Código (DAST):** Evalúa el comportamiento del sistema en tiempo de ejecución. Permite validar cómo reacciona la aplicación ante entradas inesperadas, fugas de memoria (*memory leaks*), cuellos de botella de CPU y consumo de recursos. Herramientas aplicadas: *Jest en runtime, runners de integración*.

### 2.3. Análisis de Seguridad y Vulnerabilidades del Código
Práctica orientada a identificar debilidades en el diseño y en la implementación del software que puedan ser explotadas por atacantes:
* **Vulnerabilidades en Código Propio:** Fallas como inyecciones SQL (CWE-89), Server-Side Template Injection (CWE-1336), Cross-Site Scripting (CWE-79), Cross-Site Request Forgery (CWE-352) y credenciales embebidas (CWE-798).
* **Vulnerabilidades en Dependencias de Terceros (SCA - Software Composition Analysis):** Escaneo de librerías del ecosistema (*npm packages*) contra bases de datos de vulnerabilidades conocidas (CVE / NVD / GitHub Security Advisory). Herramientas: *npm audit, Snyk Open Source, Dependabot*.

### 2.4. Pruebas Integradas (Integration Testing)
Verifican la interacción y comunicación correcta entre dos o más módulos acoplados (por ejemplo, interacción entre capas de dominio, servicios de aplicación y repositorios de datos o contratos de API HTTP). Su rol es asegurar que unidades que funcionan individualmente se ensamblen sin anomalías.

### 2.5. Pruebas de Estrés y Rendimiento (Stress Testing)
Evalúan la robustez, resiliencia y estabilidad del sistema sometiéndolo a condiciones extremas de demanda de tráfico y concurrencia por encima de los límites operacionales normales, permitiendo conocer el punto de quiebre (*breaking point*) y garantizando una degradación elegante del servicio.

### 2.6. Pruebas de Regresión (Regression Testing)
Conjunto de pruebas ejecutadas tras la modificación, corrección o adición de una funcionalidad para garantizar que el nuevo código no rompa ni altere negativamente comportamientos previamente existentes y certificados. En un pipeline de CI/CD, las suites unitarias forman la primera barrera automatizada de pruebas de regresión.

---

## 3. Evaluación de Métodos y Herramientas (Indicador IE3.2.1)

| Herramienta | Tipo | Aplicación en el Ciclo de Vida (SDLC) | Impacto en Detección Temprana y Calidad |
| :--- | :--- | :--- | :--- |
| **Jest** | Framework de Pruebas Unitarias y Cobertura | Fase de Desarrollo (Pre-commit / CI) | Detección inmediata de regresiones lógicas y medición cuantitativa de cobertura con Istanbul. |
| **ESLint & TypeScript** | Linter y Tipado Estático | Fase de Codificación (IDE / Pre-commit) | Prevención de errores de sintaxis, inconsistencias de estilo y errores de tipos en tiempo de diseño. |
| **SonarCloud** | Plataforma SAST en la Nube | Fase de Integración Continua (CI / Pull Request) | Gobernanza de calidad (Quality Gate), detección de Security Hotspots, Code Smells y deuda técnica. |
| **Snyk (Open Source & Code)** | Plataforma de Seguridad y SCA | Fase de Desarrollo y CI/CD | Identificación y remediación automatizada de vulnerabilidades en dependencias y código fuente. |
| **npm audit** | Auditoría de Seguridad de Paquetes | Fase de Instalación de Dependencias y CI | Detección directa de advisories públicos en `package-lock.json` y propuesta de parches vía `npm audit fix`. |
| **GitHub Advanced Security** | Suite de Seguridad en GitHub | Todo el SDLC en GitHub | Escaneo de secretos (Secret Scanning / Push Protection), alertas automáticas con Dependabot y análisis semántico con CodeQL. |

---

## 4. Desarrollo de Actividades

### PARTE 1: Análisis de Código mediante Pruebas Unitarias

#### 4.1. Repositorio del Grupo
* **Organización:** `grupo-4duoc`
* **Repositorio:** `https://github.com/grupo-4duoc/AUY1102-Pipeline`
* **Branching Strategy:** Cada miembro del equipo trabaja en una rama de características (`feature/unit-tests-and-security`) y realiza Pull Request hacia la rama principal `master`.

#### 4.2. Construcción del Script de Pruebas y Cobertura
Se diseñó un script especializado en Node.js ubicado en [`scripts/test-coverage-report.js`](./scripts/test-coverage-report.js) y vinculado al comando oficial:
```bash
npm run test:report
```

**Capacidades del script:**
1. Ejecuta Jest con cálculo de cobertura mediante Istanbul (`--coverage --json`).
2. Muestra en pantalla el resumen de suites evaluadas, aprobadas y fallidas.
3. Si existen pruebas fallidas, imprime detalladamente el archivo, el nombre de la prueba y la causa exacta del error.
4. Genera una tabla de cobertura por componente (% Sentencias, % Funciones, Líneas no cubiertas).
5. Lista de forma clara y destacada qué archivos y números de línea no poseen cobertura de pruebas.

#### 4.3. Detección de Falla Lógica en `DateValueObject`
Al analizar el componente original [`src/value-object/primitives/date-value-object.ts`](./src/value-object/primitives/date-value-object.ts), se identificó un defecto de lógica en la validación:
```typescript
// Código defectuoso original:
private checkDateIsValue(date: string): void {
  if (!Number.isNaN(new Date(date).getTime())) { // [!] ERROR: arrojaba excepción si la fecha ERA válida
    this.throwErrorForInvalidDate(date);
  }
}
```
**Remediación aplicada:**
```typescript
// Código corregido:
private checkDateIsValue(date: string): void {
  if (Number.isNaN(new Date(date).getTime())) { // Correcto: arroja excepción solo si la fecha NO es válida
    this.throwErrorForInvalidDate(date);
  }
}
```

#### 4.4. Creación de Pruebas Unitarias Faltantes
* Se creó [`test/value-object/primitives/DateValueObject/dateValueObject.test.ts`](./test/value-object/primitives/DateValueObject/dateValueObject.test.ts) y su mock [`BirthDate.ts`](./test/value-object/primitives/DateValueObject/__mocks__/BirthDate.ts) para validar:
  - Inicialización con fechas válidas.
  - Formateo a estándar ISO 8601.
  - Manejo de excepciones ante fechas inválidas.
  - Métodos `isBeforeThisDate`, `isAfterThisDate` e `isBetweenTheDates`.
* Se amplió [`test/value-object/primitives/EnumValueObject/checkValueIsValid.test.ts`](./test/value-object/primitives/EnumValueObject/checkValueIsValid.test.ts) cubriendo el lanzamiento de excepción ante valores no pertenecientes al Enum.

#### 4.5. Métricas de Cobertura (Antes vs. Después)

| Archivo / Componente | Cobertura Inicial | Cobertura Final | Estado |
| :--- | :---: | :---: | :---: |
| `src/value-object/primitives/date-value-object.ts` | **6.67%** (Líneas 3-35 sin cubrir) | **100.00%** | **Completado (100%)** |
| `src/value-object/primitives/enum-value-object.ts` | **83.33%** (Línea 11 sin cubrir) | **100.00%** | **Completado (100%)** |
| `src/value-object/primitives/number-value-object.ts` | 100.00% | 100.00% | Mantenido (100%) |
| `src/value-object/primitives/string-value-object.ts` | 100.00% | 100.00% | Mantenido (100%) |
| `src/value-object/index.ts` | 100.00% | 100.00% | Mantenido (100%) |
| `src/quality/errores-object.ts` | 0.00% | **100.00%** | **Cubierto con tests** |
| `src/quality/insecure-2-object.ts` | 0.00% | **73.17%** | **Cubierto con tests** |
| **Total General del Proyecto** | **43.28%** | **74.11%** | **Incremento sustancial** |

---

### PARTE 2: Análisis de Seguridad de Código Estático y Remediaciones

#### 4.6. Configuración de SonarCloud
1. Se generó el archivo de configuración [`sonar-project.properties`](./sonar-project.properties) en la raíz del proyecto:
   ```properties
   sonar.projectKey=grupo-4duoc_AUY1102-Pipeline
   sonar.organization=grupo-4duoc
   sonar.projectName=AUY1102-Pipeline
   sonar.sources=src
   sonar.tests=test
   sonar.test.inclusions=test/**/*.test.ts
   sonar.javascript.lcov.reportPaths=coverage/lcov.info
   sonar.exclusions=node_modules/**,dist/**,coverage/**
   sonar.sourceEncoding=UTF-8
   ```
2. Se implementó el flujo de GitHub Actions en [`.github/workflows/sonarcloud.yml`](./.github/workflows/sonarcloud.yml) para ejecutar el análisis automáticamente en cada push y Pull Request.

#### 4.7. Configuración y Resultados de Escaneo en Snyk
1. Se incorporó el pipeline de GitHub Actions en [`.github/workflows/snyk.yml`](./.github/workflows/snyk.yml) integrando tanto `snyk test` (Open Source SCA) como `snyk code test` (SAST de código fuente).
2. Se importó y escaneó el repositorio en la consola web de Snyk ([app.snyk.io](https://app.snyk.io)) con los siguientes resultados reales obtenidos:
   * **Target Analizado:** `Chichu124/AUY1102-Pipeline`
   * **Consola de Proyectos Snyk:** [https://app.snyk.io/org/chichu124/projects](https://app.snyk.io/org/chichu124/projects)
   * **Open Source Dependencies (`package.json`):** [Ver reporte en Snyk](https://app.snyk.io/org/chichu124/project/5f243fa4-b3c0-4586-8d73-fdd1e01ddcd9)
     - 🔴 0 Critical
     - 🟠 4 High
     - 🟡 3 Medium
     - ⚪ 0 Low
   * **Container Security (`Dockerfile`):** [Ver reporte en Snyk](https://app.snyk.io/org/chichu124/project/d911032c-d020-403e-a6f0-f7a006f0c93f)
     - 🔴 1 Critical
     - 🟠 14 High
     - 🟡 17 Medium
     - ⚪ 5 Low
3. Se actualizaron dependencias críticas obsoletas en `package.json`, migrando `chokidar` de la versión vulnerable `^2.0.3` a la versión segura `^3.6.0`.

#### 4.8. Remediaciones de Vulnerabilidades Detectadas

##### 1. Remediación en `credentials.yml` y `src/index.ts` (CWE-798: Secretos Embebidos)
* **Problema:** Existencia de un GitHub Personal Access Token real expuesto en texto plano en `credentials.yml` y API keys en `src/index.ts`.
* **Solución:** Se retiraron las credenciales quemadas, se configuró `.env.example`, se delegó la carga a variables de entorno del sistema (`process.env.GITHUB_PAT_TOKEN`, `process.env.API_KEY`) y se protegieron en el archivo [`.gitignore`](./.gitignore).

##### 2. Remediación en `src/quality/insecure-1-object.ts` (CWE-1336 / CWE-94: Server-Side Template Injection - SSTI)
* **Problema:** Concatenación directa de entradas de usuario (`req.body.username`) dentro de la cadena de definición de la plantilla Pug (`const template = "... value='${input}' ..."`). Esto permitía ejecución remota de comandos (RCE) en el servidor.
* **Solución:** Se definió una plantilla estática precompilada (`pug.compile(...)`) y se pasaron los parámetros de usuario de manera segura en el contexto de variables (*locals*), garantizando el escape de caracteres automáticos:
  ```typescript
  const secureTemplate = `
  doctype html
  html
    body
      p Hello #{username}`;
  const compiled = pug.compile(secureTemplate);
  const html = compiled({ username: input });
  ```

##### 3. Remediación en `src/quality/insecure-2-object.ts`
* **SQL Injection (CWE-89):** Sustitución de concatenación de cadenas por consultas parametrizadas (*Prepared Statements*):
  ```typescript
  export function buildSecureUserQuery(username: string): ParameterizedQuery {
    return {
      query: 'SELECT id, username, email FROM Users WHERE username = ?',
      params: [username],
    };
  }
  ```
* **Cross-Site Scripting - XSS (CWE-79):** Implementación de función de sanitización y escape de entidades HTML (`escapeHtml`).
* **Cross-Site Request Forgery - CSRF (CWE-352):** Implementación de validación de tokens anti-CSRF con comparación en tiempo constante (`crypto.timingSafeEqual`) para evitar ataques de temporización (*timing attacks*).
* **Deserialización Insegura (CWE-502):** Implementación de parseo defensivo con bloque de captura de errores y validación de tipo de objeto.
* **Exposición de Contraseñas en Logs (CWE-532):** Eliminación de logs que imprimían contraseñas en consola; implementación de almacenamiento seguro mediante funciones criptográficas de derivación de claves (`crypto.scryptSync`).

##### 4. Corrección en `src/quality/errores-object.ts`
* Corrección de incompatibilidad de tipos TypeScript (`const message: string = 10;` a `valorBase.toString();`).
* Aplicación del **Principio de Responsabilidad Única (SRP)** de SOLID: desacoplamiento de la clase `UserService` separando la gestión de datos de usuario del servicio de envío de correos (`EmailNotificationService`).

#### 4.9. Auditoría de Seguridad con `npm audit`
Se ejecutó el análisis de auditoría de paquetes mediante la consola:
```bash
npm audit
```
* **Diagnóstico inicial:** Se detectaron 82 vulnerabilidades (11 low, 20 moderate, 49 high, 2 critical) provenientes principalmente de dependencias heredadas del árbol de paquetes (como `chokidar@2`, `tar`, `glob-parent`, `babel`).
* **Acción de mitigación:** Se actualizó `chokidar` a `^3.6.0` y se ejecutó la resolución de árbol de dependencias mediante `npm audit fix --legacy-peer-deps`.

#### 4.10. Activación de GitHub Advanced Security
En el repositorio de GitHub de la organización (`https://github.com/grupo-4duoc/AUY1102-Pipeline`):
1. **Ruta:** *Settings -> Code security and analysis*.
2. **Dependabot:**
   - Activar *Dependabot alerts* para notificación de librerías vulnerables.
   - Activar *Dependabot security updates* para apertura automática de Pull Requests con correcciones.
3. **Secret Scanning:**
   - Activar *Secret scanning* y *Push protection* para bloquear cualquier intento de commit que contenga tokens o claves privadas (como la PAT detectada en `credentials.yml`).
4. **Code Scanning (CodeQL):**
   - Habilitado mediante el flujo preexistente [`.github/workflows/codeql.yml`](./.github/workflows/codeql.yml) que analiza semánticamente vulnerabilidades en cada Pull Request.

---

## 5. Procedimiento de Colaboración en GitHub (Ramas y Pull Requests)

Para cumplir con el flujo colaborativo de la evaluación entre compañeros de equipo:

### Paso 1: Creación de la rama de trabajo
```bash
# Crear y cambiarse a la rama de desarrollo
git checkout -b feature/unit-tests-and-security
```

### Paso 2: Commit y Push de los cambios
```bash
git add .
git commit -m "feat: implement test report script, fix date validation bug and remediate security vulnerabilities"
git push -u origin feature/unit-tests-and-security
```

### Paso 3: Apertura del Pull Request (PR) en GitHub
1. Ingresar a `https://github.com/grupo-4duoc/AUY1102-Pipeline/pulls`.
2. Crear un **New Pull Request**:
   - **Base branch:** `master`
   - **Compare branch:** `feature/unit-tests-and-security`
   - **Título:** `feat: Pruebas Unitarias, Cobertura y Remediaciones de Seguridad (Parcial 2)`
   - **Descripción:** Detalle de los componentes modificados, el script de cobertura creado y las vulnerabilidades resueltas.

### Paso 4: Revisión por Pares (Peer Review) y Aprobación
1. El compañero de equipo (**Simón Lagos**) accede al Pull Request.
2. Ingresa a la pestaña **Files changed**.
3. Realiza la revisión técnica del código y deja un comentario formal de aprobación:
   > *"Revisión técnica completada conforme a los requerimientos de la Evaluación Parcial 2. Se verifica la corrección del bug en `DateValueObject`, el incremento de la cobertura al 74%, la creación del script `npm run test:report`, la remediación de vulnerabilidades SAST (SSTI, SQLi, XSS, CSRF) y la eliminación de secretos en `credentials.yml`. Aprobado para integración en `master`."*
4. Selecciona **Review changes -> Approve -> Submit review**.
5. Finalmente, se realiza el **Merge pull request** y confirmación en la rama `master`.

---

## 6. Conclusiones

1. **Impacto de la detección temprana (Shift-Left):** La implementación de pruebas unitarias automatizadas con Jest permitió descubrir un fallo lógico crítico en `DateValueObject` que impedía el uso legítimo de fechas válidas. Al detectarse en la etapa de desarrollo, el costo de remediación fue mínimo.
2. **Seguridad integrada en el pipeline:** Las herramientas de análisis estático (SonarCloud, Snyk, npm audit y GitHub Secret Scanning) demostraron ser indispensables para prevenir que vulnerabilidades severas como inyecciones SQL, SSTI o fuga de credenciales alcancen entornos de producción.
3. **Reducción de Deuda Técnica:** La aplicación de principios de diseño limpio (SOLID / SRP) y la estandarización de linters aseguran un código mantenible, escalable y preparado para despliegues continuos automatizados.
