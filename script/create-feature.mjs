import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function toPascalCase(input) {
  return input
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

async function main() {
  const rawName = await ask('Nombre de la feature (ej: estudiantes, docentes): ');
  const name = rawName.trim().toLowerCase();

  if (!name) {
    console.log('❌ Nombre no válido.');
    rl.close();
    process.exitCode = 1;
    return;
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    console.log('❌ El nombre solo puede tener minúsculas, números y guiones (ej: "mi-feature").');
    rl.close();
    process.exitCode = 1;
    return;
  }

  const featureDir = path.resolve('src', 'features', name);

  if (fs.existsSync(featureDir)) {
    console.log(`❌ La feature "${name}" ya existe en src/features/${name}`);
    rl.close();
    process.exitCode = 1;
    return;
  }

  const pageComponentName = `${toPascalCase(name)}Page`;
  const subfolders = ['components', 'hooks', 'services', 'types', 'pages'];

  subfolders.forEach((sub) => {
    fs.mkdirSync(path.join(featureDir, sub), { recursive: true });
  });

  ['hooks', 'services', 'types'].forEach((sub) => {
    fs.writeFileSync(path.join(featureDir, sub, '.gitkeep'), '');
  });

  const pageContent = `export function ${pageComponentName}() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-sky-400">Feature "${name}"</h1>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(featureDir, 'pages', `${pageComponentName}.tsx`), pageContent);

  const indexContent = `export { ${pageComponentName} } from './pages/${pageComponentName}';\n`;
  fs.writeFileSync(path.join(featureDir, 'index.ts'), indexContent);

  console.log(`\n✨ Feature "${name}" creada en src/features/${name}/`);
  console.log('Estructura: components/ hooks/ services/ types/ pages/');
  console.log(`Componente: ${pageComponentName} (exportado desde index.ts)`);
  console.log('\nRecuerda agregar la ruta en src/App.tsx, por ejemplo:');
  console.log(`  import { ${pageComponentName} } from '@/features/${name}';`);
  console.log(`  <Route path="/${name}" element={<${pageComponentName} />} />`);

  rl.close();
}

main();
