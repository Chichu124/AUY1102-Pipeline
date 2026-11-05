const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('========================================================================================');
console.log('               EVALUACION PARCIAL 2 - ANALISIS DE PRUEBAS Y COBERTURA                   ');
console.log('               Asignatura: AUY1102 - Ciclo de Vida del Software I                       ');
console.log('               Integrantes: Equipo Grupo 4 Duoc UC                                      ');
console.log('========================================================================================\n');

console.log('Iniciando ejecucion de pruebas unitarias existentes con Jest...');

const rootDir = path.resolve(__dirname, '..');
const coverageDir = path.join(rootDir, 'coverage');
const resultsPath = path.join(coverageDir, 'jest-results.json');
const coveragePath = path.join(coverageDir, 'coverage-final.json');

if (!fs.existsSync(coverageDir)) {
  fs.mkdirSync(coverageDir, { recursive: true });
}

let jestExitCode = 0;

try {
  // Use runInBand for fast and reliable execution on Windows
  execSync(
    'npx jest --coverage --runInBand --json --outputFile=coverage/jest-results.json --colors=false',
    {
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      encoding: 'utf-8',
    }
  );
} catch (error) {
  jestExitCode = error.status || 1;
}

// Read results
let testResults = null;
if (fs.existsSync(resultsPath)) {
  try {
    testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  } catch (e) {
    console.error('Error parseando resultados de Jest:', e.message);
  }
}

// 1. Mostrar estado de las pruebas
console.log('\n----------------------------------------------------------------------------------------');
console.log(' 1. REPORTE DE EJECUCION DE PRUEBAS UNITARIAS');
console.log('----------------------------------------------------------------------------------------');

if (testResults) {
  console.log(`Suites de prueba totales:   ${testResults.numTotalTestSuites}`);
  console.log(`Suites exitosas:             ${testResults.numPassedTestSuites}`);
  console.log(`Suites con fallos:           ${testResults.numFailedTestSuites}`);
  console.log(`Casos de prueba totales:     ${testResults.numTotalTests}`);
  console.log(`Casos de prueba aprobados:   ${testResults.numPassedTests}`);
  console.log(`Casos de prueba fallidos:    ${testResults.numFailedTests}`);

  console.log('\nDetalle por archivo de prueba:');
  testResults.testResults.forEach((suite) => {
    const filePath = suite.name || '';
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const isPass = suite.status === 'passed';
    const tag = isPass ? '[PASS]' : '[FAIL]';
    const totalAssertions = suite.assertionResults ? suite.assertionResults.length : 0;
    const passedAssertions = suite.assertionResults
      ? suite.assertionResults.filter((a) => a.status === 'passed').length
      : 0;
    console.log(`  ${tag.padEnd(8)} ${relativePath} (${passedAssertions}/${totalAssertions} tests aprobados)`);
  });

  // Mostrar detalle de pruebas fallidas
  if (testResults.numFailedTests > 0) {
    console.log('\n----------------------------------------------------------------------------------------');
    console.log(' [!] DETALLE DE PRUEBAS QUE FALLAN');
    console.log('----------------------------------------------------------------------------------------');
    testResults.testResults.forEach((suite) => {
      if (suite.status === 'failed') {
        const filePath = suite.name || '';
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        console.log(`\nArchivo: ${relativePath}`);
        suite.assertionResults
          .filter((a) => a.status === 'failed')
          .forEach((test) => {
            console.log(`  * Fallo en: "${test.fullName || test.title}"`);
            if (test.failureMessages && test.failureMessages.length > 0) {
              console.log(`    Causa: ${test.failureMessages[0].split('\n')[0]}`);
            }
          });
      }
    });
  } else {
    console.log('\n-> Resultado: TODAS las pruebas unitarias pasaron satisfactoriamente (0 fallos).');
  }
}

// 2. Reporte de Cobertura y Código no cubierto
console.log('\n----------------------------------------------------------------------------------------');
console.log(' 2. REPORTE DE COBERTURA DE CODIGO Y LINEAS NO CUBIERTAS');
console.log('----------------------------------------------------------------------------------------');

if (fs.existsSync(coveragePath)) {
  const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));

  let totalStatements = 0;
  let coveredStatements = 0;
  let totalBranches = 0;
  let coveredBranches = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;

  const fileReports = [];

  for (const filePath of Object.keys(coverageData)) {
    const fileCov = coverageData[filePath];
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');

    // Statements
    const stmts = Object.values(fileCov.s);
    const sTotal = stmts.length;
    const sCovered = stmts.filter((v) => v > 0).length;

    // Branches
    const branches = Object.values(fileCov.b).flat();
    const bTotal = branches.length;
    const bCovered = branches.filter((v) => v > 0).length;

    // Functions
    const funcs = Object.values(fileCov.f);
    const fTotal = funcs.length;
    const fCovered = funcs.filter((v) => v > 0).length;

    // Lines & Uncovered lines calculation
    const statementMap = fileCov.statementMap || {};
    const uncoveredLinesSet = new Set();

    for (const key of Object.keys(statementMap)) {
      if (fileCov.s[key] === 0) {
        const loc = statementMap[key];
        for (let l = loc.start.line; l <= loc.end.line; l++) {
          uncoveredLinesSet.add(l);
        }
      }
    }

    const uncoveredLinesList = Array.from(uncoveredLinesSet).sort((a, b) => a - b);

    // Group ranges
    const ranges = [];
    if (uncoveredLinesList.length > 0) {
      let start = uncoveredLinesList[0];
      let end = start;
      for (let i = 1; i < uncoveredLinesList.length; i++) {
        if (uncoveredLinesList[i] === end + 1) {
          end = uncoveredLinesList[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = uncoveredLinesList[i];
          end = start;
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
    }

    totalStatements += sTotal;
    coveredStatements += sCovered;
    totalBranches += bTotal;
    coveredBranches += bCovered;
    totalFunctions += fTotal;
    coveredFunctions += fCovered;

    const sPct = sTotal ? ((sCovered / sTotal) * 100).toFixed(2) : '100.00';
    const bPct = bTotal ? ((bCovered / bTotal) * 100).toFixed(2) : '100.00';
    const fPct = fTotal ? ((fCovered / fTotal) * 100).toFixed(2) : '100.00';

    fileReports.push({
      file: relPath,
      stmts: `${sCovered}/${sTotal} (${sPct}%)`,
      branches: `${bCovered}/${bTotal} (${bPct}%)`,
      functions: `${fCovered}/${fTotal} (${fPct}%)`,
      uncoveredLines: ranges.join(', ') || 'Ninguna (100% cubierto)',
      hasUncovered: uncoveredLinesList.length > 0,
      pctNum: parseFloat(sPct),
    });
  }

  // Print table
  console.log(
    'Componente / Archivo'.padEnd(52) +
      '| Sentencias'.padEnd(22) +
      '| Funciones'.padEnd(16) +
      '| Lineas sin cobertura'
  );
  console.log('-'.repeat(110));

  fileReports.forEach((r) => {
    console.log(
      r.file.padEnd(52) +
        `| ${r.stmts}`.padEnd(22) +
        `| ${r.functions}`.padEnd(16) +
        `| ${r.uncoveredLines}`
    );
  });

  const overallStmtsPct = totalStatements ? ((coveredStatements / totalStatements) * 100).toFixed(2) : '0';
  const overallBranchesPct = totalBranches ? ((coveredBranches / totalBranches) * 100).toFixed(2) : '0';
  const overallFuncsPct = totalFunctions ? ((coveredFunctions / totalFunctions) * 100).toFixed(2) : '0';

  console.log('-'.repeat(110));
  console.log(
    `TOTAL PROYECTO`.padEnd(52) +
      `| ${coveredStatements}/${totalStatements} (${overallStmtsPct}%)`.padEnd(22) +
      `| ${coveredFunctions}/${totalFunctions} (${overallFuncsPct}%)`.padEnd(16) +
      `| Cobertura global: ${overallStmtsPct}%`
  );

  console.log('\n----------------------------------------------------------------------------------------');
  console.log(' 3. RESUMEN DE CODIGO NO CUBIERTO POR PRUEBAS (LINEAS Y COMPONENTES)');
  console.log('----------------------------------------------------------------------------------------');

  const uncoveredComponents = fileReports.filter((f) => f.hasUncovered);
  if (uncoveredComponents.length > 0) {
    uncoveredComponents.forEach((comp) => {
      console.log(`* Archivo: ${comp.file}`);
      console.log(`  -> Porcentaje alcanzado:      ${comp.stmts}`);
      console.log(`  -> Lineas de codigo sin test: ${comp.uncoveredLines}\n`);
    });
  } else {
    console.log('-> Excelente: el 100% del codigo fuente se encuentra cubierto por pruebas unitarias.');
  }
} else {
  console.log('No se encontró archivo de cobertura generado en coverage/coverage-final.json');
}

console.log('========================================================================================');
console.log(' Fin del reporte de analisis de pruebas unitarias y cobertura                           ');
console.log('========================================================================================\n');

const hasFailingTests = testResults && testResults.numFailedTests > 0;
process.exit(hasFailingTests ? 1 : 0);
