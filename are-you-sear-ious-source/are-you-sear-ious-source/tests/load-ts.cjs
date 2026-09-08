const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Transpile the pure data modules in isolation, without browser or framework
// setup. `dependencies` lets a caller substitute an already-loaded module for
// one of the target's relative imports, so `recipes.ts` is evaluated once and
// shared rather than re-transpiled per consumer.
function loadTs(filename, dependencies = {}) {
  const target = path.resolve(__dirname, '..', 'app', filename);
  const mod = new Module(target, module);
  mod.filename = target;
  mod.paths = Module._nodeModulePaths(path.dirname(target));
  const requireOriginal = mod.require.bind(mod);
  mod.require = (name) => dependencies[name] || requireOriginal(name);
  mod._compile(
    ts.transpileModule(fs.readFileSync(target, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    target,
  );
  return mod.exports;
}

// The two modules under test, loaded once for every suite that needs them.
const recipes = loadTs('recipes.ts');
const cookConfig = loadTs('cook-config.ts', { './recipes': recipes });

module.exports = { loadTs, recipes, cookConfig };
