import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Recipe } from '../../types/index';
import {
  ChefHat,
  Clock,
  Search,
  PlusCircle,
  X,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Bell,
  CheckCircle2,
} from 'lucide-react';

export const RecipeCatalogScreen: React.FC = () => {
  const { recipes, saveRecipe } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  // Timer states for active recipe
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);

  // New Recipe Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Air-Fried Snacks');
  const [newTemp, setNewTemp] = useState(190);
  const [newTime, setNewTime] = useState(15);
  const [newMode, setNewMode] = useState('Air Fry');
  const [newIngredients, setNewIngredients] = useState('Paneer cubes 200g, Spices 1 tbsp');
  const [newSteps, setNewSteps] = useState('1. Marinate paneer.\n2. Air fry at 190C for 12 minutes.');

  const categories = [
    'all',
    'Dehydrated Fruits',
    'Air-Fried Snacks',
    'Pizza & Bread',
    'Rotisserie Food',
  ];

  // Set initial timer when opening recipe
  useEffect(() => {
    if (activeRecipe) {
      const sec = activeRecipe.cookingTimeMinutes * 60;
      setTimerSeconds(sec);
      setTotalTimerSeconds(sec);
      setIsTimerRunning(false);
      setTimerFinished(false);
    }
  }, [activeRecipe]);

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            setTimerFinished(true);
            playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const playTimerChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.18); // A5
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.9);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.9);
    } catch {}
  };

  const filtered = recipes.filter((r) => {
    const matchesSearch =
      search === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchesCat =
      selectedCategory === 'all' || r.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const recipe: Recipe = {
      id: `recipe-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      finishedImage:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      prepTimeMinutes: 10,
      cookingTimeMinutes: Number(newTime),
      temperatureCelsius: Number(newTemp),
      operatingMode: newMode,
      servings: '3-4 Pax',
      difficulty: 'Easy',
      compatibleModelNumbers: ['29RCAD Digital Air Fryer OTG'],
      ingredients: newIngredients.split(',').map((item) => ({
        name: item.trim(),
        quantity: 'As needed',
      })),
      steps: newSteps.split('\n').filter(Boolean).map((st, i) => ({
        stepNumber: i + 1,
        instruction: st.replace(/^\d+\.\s*/, '').trim(),
      })),
      accessoriesNeeded: ['Air Fryer Basket', 'Baking Tray'],
      proTips: 'Cook in single layer for optimal crispy texture.',
      safetyInstructions: 'Use supplied tongs to remove hot tray.',
      isAiDraft: false,
      isVerified: true,
    };

    await saveRecipe(recipe);
    setShowCreateModal(false);
    setNewTitle('');
    setActiveRecipe(recipe);
  };

  const formatTimerTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-400" />
            Visual Recipe Showroom
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrate real cooking capabilities: baking, rotisserie, air frying, and fruit dehydration.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-button-primary text-slate-950 text-xs font-bold shadow-md active:scale-95 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Recipe</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes, ingredients, or methods..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl glass-panel text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 glass-pill rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            onClick={() => setActiveRecipe(r)}
            className="rounded-3xl glass-panel overflow-hidden shadow-lg hover:border-white/20 transition cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
          >
            <div className="h-48 bg-black/40 relative overflow-hidden">
              <img
                src={r.finishedImage}
                alt={r.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                {r.category}
              </div>
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-[10px] text-white font-mono flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{r.cookingTimeMinutes}m · {r.temperatureCelsius}°C</span>
              </div>
            </div>

            <div className="p-4 space-y-2.5">
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition leading-snug">
                  {r.title}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  Accessories: {r.accessoriesNeeded.join(', ')}
                </div>
              </div>

              <div className="p-2.5 rounded-xl glass-pill text-[11px] text-amber-300/90 line-clamp-2">
                💡 {r.proTips}
              </div>

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {r.difficulty} · {r.servings}
                </span>
                <span className="font-semibold text-amber-400">View Recipe & Timer →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECIPE DETAIL MODAL WITH INTERACTIVE TIMER */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl glass-panel-elevated shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="relative h-56 sm:h-64 bg-black/40">
              <img
                src={activeRecipe.finishedImage}
                alt={activeRecipe.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveRecipe(null)}
                className="absolute top-4 right-4 p-2 rounded-full glass-button-secondary text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-amber-400 uppercase">
                  {activeRecipe.category}
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white mt-0.5">
                  {activeRecipe.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Specs Bar */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-2xl glass-pill">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Mode</div>
                  <div className="text-xs sm:text-sm font-bold text-amber-400 mt-0.5">
                    {activeRecipe.operatingMode}
                  </div>
                </div>
                <div className="p-3 rounded-2xl glass-pill">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Temp</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {activeRecipe.temperatureCelsius}°C
                  </div>
                </div>
                <div className="p-3 rounded-2xl glass-pill">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Time</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {activeRecipe.cookingTimeMinutes} Mins
                  </div>
                </div>
              </div>

              {/* LIVE COOKING TIMER CARD */}
              <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Interactive Showroom Timer
                    </span>
                  </div>
                  {timerFinished && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-bounce">
                      <CheckCircle2 className="w-4 h-4" /> Ready!
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
                  <div>
                    <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-tight">
                      {formatTimerTime(timerSeconds)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Target: {activeRecipe.cookingTimeMinutes}m @ {activeRecipe.temperatureCelsius}°C
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md ${
                        isTimerRunning
                          ? 'bg-rose-500 text-white'
                          : 'glass-button-primary text-slate-950'
                      }`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-4 h-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-slate-950" /> Start
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerFinished(false);
                        setTimerSeconds(totalTimerSeconds);
                      }}
                      className="p-2.5 rounded-2xl glass-button-secondary text-slate-300 hover:text-white active:scale-95 transition"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Quick Demo: 10s Fast Test */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(true);
                        setTimerFinished(false);
                        setTimerSeconds(10);
                        setTotalTimerSeconds(10);
                      }}
                      className="px-2.5 py-2.5 rounded-2xl glass-pill text-[10px] text-amber-400 font-mono hover:bg-white/[0.1] active:scale-95 transition"
                      title="Run a quick 10-second test countdown to demonstrate the alarm chime"
                    >
                      ⚡ 10s Demo
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{
                      width: `${
                        totalTimerSeconds > 0
                          ? ((totalTimerSeconds - timerSeconds) / totalTimerSeconds) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Required Ingredients
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl glass-pill flex items-center justify-between"
                    >
                      <span className="text-slate-200">{ing.name}</span>
                      <span className="font-mono text-amber-400 font-bold">{ing.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preparation & Cooking Steps
                </h3>
                <div className="space-y-2">
                  {activeRecipe.steps.map((st, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl glass-pill flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {st.stepNumber}
                      </div>
                      <div className="text-xs text-slate-200 leading-relaxed">
                        {st.instruction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="p-4 rounded-2xl glass-pill space-y-1 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Promoter Chef Tip:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{activeRecipe.proTips}</p>
              </div>

              <button
                onClick={() => setActiveRecipe(null)}
                className="w-full py-3 rounded-2xl glass-button-secondary text-xs font-bold text-white active:scale-95 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE RECIPE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreateRecipe}
            className="w-full max-w-md rounded-3xl glass-panel-elevated p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                Add Showroom Recipe
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Recipe Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Crisp Tandoori Samosas"
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                >
                  <option value="Air-Fried Snacks" className="bg-slate-900">Air-Fried Snacks</option>
                  <option value="Dehydrated Fruits" className="bg-slate-900">Dehydrated Fruits</option>
                  <option value="Pizza & Bread" className="bg-slate-900">Pizza & Bread</option>
                  <option value="Rotisserie Food" className="bg-slate-900">Rotisserie Food</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Temp (°C)</label>
                <input
                  type="number"
                  value={newTemp}
                  onChange={(e) => setNewTemp(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 font-medium">Time (Mins)</label>
                <input
                  type="number"
                  value={newTime}
                  onChange={(e) => setNewTime(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Ingredients (comma separated)</label>
              <input
                type="text"
                value={newIngredients}
                onChange={(e) => setNewIngredients(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium">Cooking Steps (one per line)</label>
              <textarea
                value={newSteps}
                onChange={(e) => setNewSteps(e.target.value)}
                rows={3}
                className="w-full mt-1 px-3 py-2 rounded-xl glass-panel text-xs text-white"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 rounded-xl glass-button-secondary text-xs text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl glass-button-primary text-xs text-slate-950 font-bold"
              >
                Save Recipe
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
