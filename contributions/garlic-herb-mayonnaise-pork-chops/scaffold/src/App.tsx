import { useEffect, useState } from 'react';
import { ArrowRight, Bookmark, Clock3, Flame, Printer, Thermometer } from 'lucide-react';
import { equipment, normalizeSettings, recipe, safetySentence, sizeLabel, sources, temp, temperatureRows, variantFor, vesselFor, type Settings } from './recipe';
import type { GrillPlan } from './grill';
import { readSavedRecipe, writeSavedRecipe } from './storage';
import { useTimer } from './hooks/useTimer';
import { RecipeControls } from './components/RecipeControls';
import { CookMode } from './components/CookMode';
import { GrillPlanner } from './components/GrillPlanner';
import { Ingredients } from './components/Ingredients';
import { Method } from './components/Method';
import { RecipePrint } from './components/RecipePrint';

export default function App() {
  const [initial] = useState(readSavedRecipe);
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [plan, setPlan] = useState<GrillPlan>(initial.plan);
  const [saved, setSaved] = useState(initial.saved);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);
  const [cookOpen, setCookOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const timer = useTimer();
  const variant = variantFor(settings); const vessel = vesselFor(settings);
  useEffect(() => { setStorageAvailable(writeSavedRecipe(saved, settings, plan)); }, [saved, settings, plan]);
  function updateSettings(patch: Partial<Settings>) {
    const next = normalizeSettings({ ...settings, ...patch });
    if (next.servings !== settings.servings || next.vessel !== settings.vessel || next.variant !== settings.variant) { setChecked([]); setStep(0); setDone(false); timer.reset(); }
    setSettings(next);
  }
  const savedLabel = saved && storageAvailable ? 'Saved' : saved ? 'Session only' : 'Save recipe';
  return <>
    <div className="screen-app recipe-app">
      <a className="skip" href="#recipe">Skip to recipe</a>
      <header className="site-header">
        <a className="brand" href="#recipes" aria-label="Are You Sear-ious home"><Flame /><span>Are You <span className="brand-accent">Sear-ious</span></span></a>
        <nav aria-label="Main navigation"><a href="#recipes" className="active">Recipes</a><a href="#temperatures">Temperature guide</a><a href="#setup">Grill setup</a></nav>
        <div className="header-actions"><button className="save-nav" type="button" aria-pressed={saved} aria-label={savedLabel} onClick={() => setSaved(!saved)}><Bookmark size={17} /><span>{savedLabel}</span></button><select className="unit-select" aria-label="Temperature unit" value={settings.tempUnit} onChange={(event) => updateSettings({ tempUnit: event.target.value as Settings['tempUnit'] })}><option value="F">°F</option><option value="C">°C</option></select></div>
      </header>
      <main className="container">
        <div className="intro" id="recipes"><div><p className="eyebrow">THE GAS GRILL PLAYBOOK · {recipe.category}</p><h1>{recipe.title}</h1><p className="muted">{recipe.description}</p></div><span className="gas-label"><span />MADE FOR GAS</span></div>
        <RecipeControls key={`${settings.vessel}:${settings.variant}:${settings.servings}:${settings.measureUnit}`} settings={settings} onChange={updateSettings} />
        <div className="feature-grid">
          <article className="feature-card"><div className="feature-copy"><span className="eyebrow orange">TWO-ZONE HEAT · GRILL GRATES</span><h2>{recipe.heroLine1}<br />{recipe.heroLine2}</h2><p>{recipe.description}</p><div className="recipe-meta"><span><Clock3 size={16} />{vessel.time}</span><span><Flame size={16} />3-burner gas grill</span></div><a className="primary-button" href="#recipe">View recipe <ArrowRight size={18} /></a></div><img src={recipe.image} alt={recipe.imageAlt} width="1120" height="747" fetchPriority="high" /><span className="photo-caption">{recipe.photoCaption}</span></article>
          <aside className="temp-card"><p className="eyebrow">{variant.shortName.toUpperCase()}</p><div><span><Flame size={18} />Grill ambient</span><strong>{temp(recipe.grillAmbientF, settings.tempUnit)}</strong><p>Indirect zone · grate level</p></div><div><span><Thermometer size={18} />Internal finish</span><strong>{temp(recipe.finishF, settings.tempUnit)}</strong><p>Center of the assembled dish</p></div><p>{variant.targetNote}</p><a href="#setup">Choose your burners <ArrowRight size={16} /></a></aside>
        </div>
        <p className="source-note">Image generated for this recipe. Appearance does not verify doneness. <a href="./provenance/image-details.json">Image details</a>.</p>
        <section className="bottom-strip" aria-label="Grilling essentials"><div><Flame /><strong>Three burners. Your choice.</strong><p>Nothing preselected. Build direct and indirect zones manually.</p></div><div><Thermometer /><strong>Temperature decides.</strong><p>Probe the thickest pork center; grill marks are not a safety reading.</p></div><div><Printer /><strong>Take it to the grill.</strong><p>Print a clean recipe, or follow cook mode.</p></div></section>
        <section id="recipe" className="recipe-section">
          <div className="section-heading"><div><p className="eyebrow orange">YOUR CONFIGURED RECIPE</p><h2>{recipe.title}</h2></div><div className="action-row"><button className="secondary-button" type="button" onClick={() => window.print()}><Printer size={17} />Print recipe</button><button className="primary-button" type="button" onClick={() => setCookOpen(true)}><Flame size={17} />Start cook mode</button></div></div>
          <div className="recipe-facts"><span>{sizeLabel(settings)}</span><span>Prep: about {recipe.prep}</span><span>Rest: {recipe.rest}</span></div>
          <p className="timing-note">{vessel.timing} Serving count changes the batch size, not the cooking time; chop thickness and grill behavior matter.</p>
          <p className="source-note" role="status">{!storageAvailable ? 'Device storage is unavailable. Settings remain in this session only.' : saved ? 'Saved on this browser: chop cut, batch size, servings, units and burner plan update as you change them. Click Saved again to remove this saved copy.' : 'Save to restore this setup on this browser. Checklists, cook progress and timers are session-only.'}</p>
          <div className="recipe-columns"><aside><Ingredients settings={settings} checked={checked} onToggle={(id) => setChecked((values) => values.includes(id) ? values.filter((value) => value !== id) : [...values, id])} onReset={() => setChecked([])} /><div className="ingredients equipment"><h3>Bring to the grill</h3><ul className="recipe-equipment">{equipment.map((item) => <li key={item}>{item}</li>)}</ul><p className="micro">{recipe.equipmentNote}</p></div></aside><Method settings={settings} /></div>
        </section>
        <section id="temperatures" className="guide-section"><div className="section-heading"><div><p className="eyebrow">{recipe.title.toUpperCase()}</p><h2>Know your temperatures.</h2></div><span className="guide-unit">°{settings.tempUnit}</span></div><p className="section-description">{safetySentence(settings)} Texture, browning and bubbling are quality cues, not safety measurements.</p><div className="table-scroll"><table className="temperature-table"><thead><tr><th scope="col">Stage</th><th scope="col">Temperature</th><th scope="col">What it means</th></tr></thead><tbody>{temperatureRows(settings).map((row) => <tr key={row.stage}><th scope="row">{row.stage}</th><td>{temp(row.value, settings.tempUnit)}</td><td>{row.meaning}</td></tr>)}</tbody></table></div><p className="source-note">Probe the coolest center without touching iron. <a href={sources[0].url}>USDA guidance</a>.</p></section>
        <GrillPlanner plan={plan} onChange={setPlan} unit={settings.tempUnit} />
        <section className="guide-section" aria-labelledby="sources-heading"><h2 id="sources-heading">Sources & adaptation</h2><p className="recipe-origin">This original Are You Sear-ious adaptation changes ingredients, prep guidance and safety notes with the selected protein. <a href="./RECIPE.md">Recipe details</a> · <a href="./SOURCES.md">Source notes</a> · <a href="./THIRD-PARTY-NOTICES.txt">Software notices</a>.</p><p className="recipe-origin">Sources provide safety and technique references; they do not endorse this recipe. No physical cooking test was performed.</p><ul className="source-links">{sources.map((source) => <li key={source.url}><a href={source.url}>{source.label}</a></li>)}</ul></section>
      </main>
      <footer className="container"><a className="brand" href="#recipes">Are You <span className="brand-accent">Sear-ious</span></a><span>Gas grill. Good food.</span></footer>
    </div>
    <CookMode open={cookOpen} onClose={() => setCookOpen(false)} settings={settings} plan={plan} step={step} onStep={setStep} done={done} onDone={setDone} minutes={minutes} onMinutes={setMinutes} timer={timer} />
    <RecipePrint settings={settings} plan={plan} />
  </>;
}
