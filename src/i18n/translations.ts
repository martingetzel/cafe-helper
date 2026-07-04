import type { Method } from '../domain/types'

export type Lang = 'en' | 'es'

export interface Translations {
  languageName: string
  app: {
    title: string
    tagline: string
    footer: string
  }
  form: {
    method: string
    methodOptions: { v60: string; frenchPress: string }
    recipe: string
    v60RecipeOptions: { kasuya46: string; hoffmann: string; scottRao: string; lanceHedrick: string }
    frenchPressRecipeOptions: { standard: string; hoffmann: string; scottRao: string; gwilymDavies: string }
    solveFor: string
    solveForOptions: { coffee: string; water: string }
    coffeeWeight: string
    totalWater: string
    ratio: string
    roast: string
    roastOptions: { light: string; medium: string; dark: string }
    flavorLabel: (method: Method) => string
    flavorOptions: { sweet: string; standard: string; bright: string }
    strengthLabel: (method: Method) => string
    strengthOptions: { light: string; medium: string; strong: string }
    grinderNote: string
    grinderNotePlaceholder: string
    previewRecipe: string
  }
  schedule: {
    coffeeWeight: string
    totalWater: string
    waterTemp: string
    totalTime: string
    roundingNote: (coffeeGrams: number, actualWater: number, targetWater: number) => string
    grindPrefix: string
    grindHint: {
      v60: { kasuya46: string; hoffmann: string; scottRao: string; lanceHedrick: string }
      frenchPress: { standard: string; hoffmann: string; scottRao: string; gwilymDavies: string }
    }
    sourceLabel: string
    table: { time: string; step: string; water: string; total: string }
    startTimer: string
    saveRecipe: string
    backToEdit: string
  }
  steps: {
    v60: { pourLabel: (n: number) => string; firstPourNote: string }
    hoffmannV60: {
      bloom: string
      bloomNote: string
      swirl1: string
      swirl1Note: string
      pour2: string
      pour2Note: (grams: number) => string
      pour3: string
      pour3Note: (grams: number) => string
      stir: string
      stirNote: string
      swirl2: string
      swirl2Note: string
      drawdown: string
      drawdownNote: string
    }
    scottRaoV60: {
      preWet: string
      preWetNote: string
      excavate: string
      excavateNote: string
      mainPour: string
      mainPourNote: (grams: number) => string
      stir: string
      stirNote: string
      swirl: string
      swirlNote: string
      drawdown: string
      drawdownNote: string
    }
    lanceHedrickV60: {
      pourLabel: (n: number) => string
      fastPourNote: string
      spinLabel: string
      spinNotes: [string, string, string, string]
      drawdown: string
      drawdownNote: string
    }
    frenchPress: {
      bloom: string
      bloomNote: string
      mainPour: string
      mainPourNote: string
      skim: string
      skimNote: string
      plunge: string
      plungeNote: string
    }
    hoffmannFrenchPress: {
      pour: string
      pourNote: string
      settle: string
      settleNote: string
      breakCrust: string
      breakCrustNote: string
      restMore: string
      restMoreNote: string
      plunge: string
      plungeNote: string
    }
    scottRaoFrenchPress: {
      pour: string
      pourNote: string
      restPlunger: string
      restPlungerNote: string
      plunge: string
      plungeNote: string
      settle: string
      settleNote: string
    }
    gwilymDaviesFrenchPress: {
      pour: string
      pourNote: string
      rest1: string
      rest1Note: string
      stir: string
      stirNote: string
      insertPlunger: string
      insertPlungerNote: string
      rest2: string
      rest2Note: string
      press: string
      pressNote: string
      rest3: string
      rest3Note: string
      pourOut: string
      pourOutNote: string
    }
  }
  timer: {
    backToRecipe: string
    ready: string
    now: (label: string) => string
    next: (seconds: number, label: string, grams: number | null) => string
    done: string
    start: string
    pause: string
    resume: string
    reset: string
    saveRecipe: string
    savedConfirmation: string
  }
  saved: {
    title: string
    namePlaceholder: string
    save: string
    cancel: string
    load: string
    delete: string
  }
}

const en: Translations = {
  languageName: 'English',
  app: {
    title: 'Café Helper',
    tagline: 'Coffee pour calculator + timer',
    footer: 'Brew smart. Sip slow.',
  },
  form: {
    method: 'Method',
    methodOptions: { v60: 'V60', frenchPress: 'French press' },
    recipe: 'Recipe',
    v60RecipeOptions: {
      kasuya46: 'Kasuya 4:6',
      hoffmann: 'Hoffmann Ultimate',
      scottRao: 'Scott Rao',
      lanceHedrick: 'Lance Hedrick',
    },
    frenchPressRecipeOptions: {
      standard: 'Standard (SCA)',
      hoffmann: 'Hoffmann (long steep)',
      scottRao: 'Scott Rao',
      gwilymDavies: 'Gwilym Davies',
    },
    solveFor: 'Solve for',
    solveForOptions: { coffee: 'Coffee weight', water: 'Total water' },
    coffeeWeight: 'Coffee weight (g)',
    totalWater: 'Total water (g)',
    ratio: 'Ratio (1 : x)',
    roast: 'Roast level',
    roastOptions: { light: 'Light', medium: 'Medium', dark: 'Dark' },
    flavorLabel: (method) => (method === 'v60' ? 'Flavor (pour balance)' : 'Flavor (temperature nudge)'),
    flavorOptions: { sweet: 'Sweet', standard: 'Standard', bright: 'Bright' },
    strengthLabel: (method) => (method === 'v60' ? 'Strength (pour count)' : 'Strength (steep time)'),
    strengthOptions: { light: 'Light', medium: 'Medium', strong: 'Strong' },
    grinderNote: 'Grinder setting (optional note)',
    grinderNotePlaceholder: 'e.g. Comandante 24 clicks',
    previewRecipe: 'Preview recipe',
  },
  schedule: {
    coffeeWeight: 'Coffee weight',
    totalWater: 'Total water',
    waterTemp: 'Water temp',
    totalTime: 'Est. total time',
    roundingNote: (coffeeGrams, actualWater, targetWater) =>
      `Rounded to a scale-friendly ${coffeeGrams}g of coffee, so total water lands at ${actualWater}g (target was ${targetWater}g).`,
    grindPrefix: 'Grind:',
    grindHint: {
      v60: {
        kasuya46: 'Medium-coarse, like coarse sand (adjust finer for a slower drawdown).',
        hoffmann: 'Medium-fine — a bit finer than most V60 recipes call for.',
        scottRao: 'Medium-fine.',
        lanceHedrick: 'Medium-fine.',
      },
      frenchPress: {
        standard: 'Coarse, like coarse sea salt or breadcrumbs.',
        hoffmann: 'Medium-coarse — a little finer than a standard French press grind, since the long steep needs less coarseness.',
        scottRao: 'Medium.',
        gwilymDavies: 'Medium.',
      },
    },
    sourceLabel: 'Source:',
    table: { time: 'Time', step: 'Step', water: 'Water', total: 'Total' },
    startTimer: 'Go to timer',
    saveRecipe: 'Save recipe',
    backToEdit: '← Edit parameters',
  },
  steps: {
    v60: {
      pourLabel: (n) => `Pour ${n}`,
      firstPourNote: 'Bloom + first pour, slow concentric circles',
    },
    hoffmannV60: {
      bloom: 'Bloom pour',
      bloomNote: 'Spiral pour from the centre outwards to wet all the grounds',
      swirl1: 'Swirl',
      swirl1Note: 'Swirl the brewer until the slurry looks even, then let it bloom',
      pour2: 'Main pour 1',
      pour2Note: (grams) => `Pour from the centre outwards over ~30s, up to ${grams}g total`,
      pour3: 'Main pour 2',
      pour3Note: (grams) => `Centre pour over ~30s, keeping the V60 full, up to ${grams}g total`,
      stir: 'Stir',
      stirNote: 'One gentle stir clockwise, one counter-clockwise — no whirlpool',
      swirl2: 'Flatten swirl',
      swirl2Note: 'Gently swirl 2-3 times to flatten the bed for an even drawdown',
      drawdown: 'Drawdown',
      drawdownNote: 'Wait for the water to fully drain through',
    },
    scottRaoV60: {
      preWet: 'Pre-wet',
      preWetNote: 'Saturate all the grounds evenly',
      excavate: 'Excavate',
      excavateNote: 'Gently dig in to wet any dry pockets of coffee',
      mainPour: 'Main pour',
      mainPourNote: (grams) => `One continuous pour up to ${grams}g total`,
      stir: 'Stir',
      stirNote: 'Gently stir to knock grounds off the sides',
      swirl: 'Rao spin',
      swirlNote: 'Swirl to flatten the bed for an even brew',
      drawdown: 'Drawdown',
      drawdownNote: 'Drawdown should finish within about 3 minutes total',
    },
    lanceHedrickV60: {
      pourLabel: (n) => `Pour ${n}`,
      fastPourNote: 'Fast flow rate, aimed just behind the centre',
      spinLabel: 'Spin',
      spinNotes: ['Spin somewhat aggressively', 'Spin gently', 'Spin very lightly', 'Give it another light spin'],
      drawdown: 'Drawdown',
      drawdownNote: 'Wait for the complete drawdown',
    },
    frenchPress: {
      bloom: 'Bloom pour',
      bloomNote: 'Saturate all grounds, give it a gentle stir',
      mainPour: 'Remaining water',
      mainPourNote: 'Fill to the top and place the lid on (plunger up)',
      skim: 'Break crust & skim',
      skimNote: 'Gently break the crust and skim off the foam/grounds',
      plunge: 'Plunge',
      plungeNote: 'Press slowly and evenly, then serve immediately',
    },
    hoffmannFrenchPress: {
      pour: 'Pour all water',
      pourNote: 'Add all the water in one go — no separate bloom for this method',
      settle: 'Let it steep',
      settleNote: 'Leave it undisturbed',
      breakCrust: 'Break crust & skim',
      breakCrustNote: 'Stir the crust with a spoon, then skim off the foam and floating grounds',
      restMore: 'Rest 5 more minutes',
      restMoreNote: 'Let the fines settle to the bottom, undisturbed',
      plunge: 'Plunge — not to the bottom',
      plungeNote:
        "Lower the plunger just until it touches the surface. Don't press it to the bottom — that keeps the settled grounds and fines out of your cup.",
    },
    scottRaoFrenchPress: {
      pour: 'Pour all water',
      pourNote: 'Pour quickly, all at once, making sure every ground is wet',
      restPlunger: 'Rest the plunger',
      restPlungerNote: 'Place the plunger about 1cm below the surface — do not press',
      plunge: 'Plunge gently',
      plungeNote: 'Press down gently and evenly',
      settle: 'Let it settle',
      settleNote: 'Wait for coffee particles to settle, then serve',
    },
    gwilymDaviesFrenchPress: {
      pour: 'Pour all water',
      pourNote: 'Add it quickly',
      rest1: 'Rest, lid off',
      rest1Note: 'Leave the lid off and wait 5 minutes',
      stir: 'Stir',
      stirNote: 'Mix the coffee and water with a tablespoon',
      insertPlunger: 'Insert plunger',
      insertPlungerNote: "Insert the plunger, but don't press it down yet",
      rest2: 'Rest',
      rest2Note: 'Wait 3 minutes',
      press: 'Press slowly',
      pressNote: 'Press the plunger down slowly',
      rest3: 'Rest',
      rest3Note: 'Wait 2 minutes',
      pourOut: 'Pour into carafe',
      pourOutNote: 'Pour the coffee out, then wait 2 more minutes before serving',
    },
  },
  timer: {
    backToRecipe: '← Back to recipe',
    ready: 'Ready when you are',
    now: (label) => `Now: ${label}`,
    next: (seconds, label, grams) => `Next in ${seconds}s — ${label}${grams ? ` (${grams}g)` : ''}`,
    done: 'Brew complete — enjoy!',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    saveRecipe: 'Save this recipe',
    savedConfirmation: 'Recipe saved!',
  },
  saved: {
    title: 'Saved recipes',
    namePlaceholder: 'Recipe name, e.g. Sunday morning V60',
    save: 'Save',
    cancel: 'Cancel',
    load: 'Load',
    delete: 'Delete',
  },
}

const es: Translations = {
  languageName: 'Español',
  app: {
    title: 'Café Helper',
    tagline: 'Calculadora de vertido y temporizador para tu cafecito',
    footer: 'Brew smart. Sip calm.',
  },
  form: {
    method: 'Método',
    methodOptions: { v60: 'V60', frenchPress: 'Prensa francesa' },
    recipe: 'Receta',
    v60RecipeOptions: {
      kasuya46: 'Kasuya 4:6',
      hoffmann: 'Hoffmann Ultimate',
      scottRao: 'Scott Rao',
      lanceHedrick: 'Lance Hedrick',
    },
    frenchPressRecipeOptions: {
      standard: 'Estándar (SCA)',
      hoffmann: 'Hoffmann (infusión larga)',
      scottRao: 'Scott Rao',
      gwilymDavies: 'Gwilym Davies',
    },
    solveFor: 'Calcular a partir de',
    solveForOptions: { coffee: 'Peso del café', water: 'Agua total' },
    coffeeWeight: 'Peso del café (g)',
    totalWater: 'Agua total (g)',
    ratio: 'Ratio (1 : x)',
    roast: 'Nivel de tueste',
    roastOptions: { light: 'Claro', medium: 'Medio', dark: 'Oscuro' },
    flavorLabel: (method) => (method === 'v60' ? 'Sabor (balance de vertidos)' : 'Sabor (ajuste de temperatura)'),
    flavorOptions: { sweet: 'Dulce', standard: 'Estándar', bright: 'Brillante' },
    strengthLabel: (method) => (method === 'v60' ? 'Intensidad (número de vertidos)' : 'Intensidad (tiempo de infusión)'),
    strengthOptions: { light: 'Suave', medium: 'Medio', strong: 'Fuerte' },
    grinderNote: 'Ajuste del molino (nota opcional)',
    grinderNotePlaceholder: 'ej. Comandante 24 clics',
    previewRecipe: 'Vista previa de la receta',
  },
  schedule: {
    coffeeWeight: 'Peso del café',
    totalWater: 'Agua total',
    waterTemp: 'Temperatura del agua',
    totalTime: 'Tiempo total est.',
    roundingNote: (coffeeGrams, actualWater, targetWater) =>
      `Se redondeó a ${coffeeGrams}g de café (una cifra cómoda para la balanza), así que el agua total queda en ${actualWater}g (el objetivo era ${targetWater}g).`,
    grindPrefix: 'Molienda:',
    grindHint: {
      v60: {
        kasuya46: 'Media-gruesa, como arena gruesa (más fina si el drenaje es muy lento).',
        hoffmann: 'Media-fina, un poco más fina de lo habitual en una V60.',
        scottRao: 'Media-fina.',
        lanceHedrick: 'Media-fina.',
      },
      frenchPress: {
        standard: 'Gruesa, como sal marina gruesa o pan rallado.',
        hoffmann: 'Media-gruesa, un poco más fina que la molienda habitual de prensa francesa, ya que la infusión larga necesita menos grosor.',
        scottRao: 'Media.',
        gwilymDavies: 'Media.',
      },
    },
    sourceLabel: 'Fuente:',
    table: { time: 'Tiempo', step: 'Paso', water: 'Agua', total: 'Total' },
    startTimer: 'Ir al temporizador',
    saveRecipe: 'Guardar receta',
    backToEdit: '← Editar parámetros',
  },
  steps: {
    v60: {
      pourLabel: (n) => `Vertido ${n}`,
      firstPourNote: 'Bloom + primer vertido, círculos lentos y concéntricos',
    },
    hoffmannV60: {
      bloom: 'Vertido inicial',
      bloomNote: 'Vertido en espiral desde el centro hacia afuera para mojar todo el café',
      swirl1: 'Girar',
      swirl1Note: 'Gira la V60 hasta que la mezcla se vea uniforme y déjala hacer el bloom',
      pour2: 'Vertido principal 1',
      pour2Note: (grams) => `Vierte desde el centro hacia afuera durante ~30s, hasta llegar a ${grams}g en total`,
      pour3: 'Vertido principal 2',
      pour3Note: (grams) => `Vierte en el centro durante ~30s, manteniendo la V60 llena, hasta llegar a ${grams}g en total`,
      stir: 'Remover',
      stirNote: 'Un giro suave en sentido horario y otro en sentido antihorario — sin crear remolino',
      swirl2: 'Girar para nivelar',
      swirl2Note: 'Gira suavemente 2-3 veces para nivelar el lecho y lograr un drenaje uniforme',
      drawdown: 'Drenaje',
      drawdownNote: 'Espera a que el agua termine de filtrarse',
    },
    scottRaoV60: {
      preWet: 'Prehumedecer',
      preWetNote: 'Satura todos los granos molidos de manera uniforme',
      excavate: 'Excavar',
      excavateNote: 'Remueve suavemente para mojar cualquier zona seca de café',
      mainPour: 'Vertido principal',
      mainPourNote: (grams) => `Un solo vertido continuo hasta llegar a ${grams}g en total`,
      stir: 'Remover',
      stirNote: 'Remueve con suavidad para despegar el café de las paredes',
      swirl: 'Giro Rao',
      swirlNote: 'Gira para nivelar el lecho y lograr una extracción uniforme',
      drawdown: 'Drenaje',
      drawdownNote: 'El drenaje debería terminar en unos 3 minutos en total',
    },
    lanceHedrickV60: {
      pourLabel: (n) => `Vertido ${n}`,
      fastPourNote: 'Flujo rápido, apuntando justo detrás del centro',
      spinLabel: 'Girar',
      spinNotes: [
        'Gira de forma algo agresiva',
        'Gira con suavidad',
        'Gira muy suavemente',
        'Dale otro giro suave',
      ],
      drawdown: 'Drenaje',
      drawdownNote: 'Espera el drenaje completo',
    },
    frenchPress: {
      bloom: 'Bloom',
      bloomNote: 'Satura todo el café molido y remueve con suavidad',
      mainPour: 'Agua restante',
      mainPourNote: 'Llena hasta arriba y coloca la tapa (émbolo arriba)',
      skim: 'Romper la costra y retirar espuma',
      skimNote: 'Rompe la costra con suavidad y retira la espuma o los restos',
      plunge: 'Prensar',
      plungeNote: 'Presiona lento y parejo, y sirve de inmediato',
    },
    hoffmannFrenchPress: {
      pour: 'Vierte toda el agua',
      pourNote: 'Añade toda el agua de una vez — este método no lleva bloom aparte',
      settle: 'Deja que repose',
      settleNote: 'No lo muevas',
      breakCrust: 'Rompe la costra y retira espuma',
      breakCrustNote: 'Remueve la costra con una cuchara y retira la espuma y los restos flotantes',
      restMore: 'Reposa 5 minutos más',
      restMoreNote: 'Deja que los finos se asienten en el fondo, sin moverlo',
      plunge: 'Prensa — sin llegar al fondo',
      plungeNote:
        'Baja el émbolo solo hasta que toque la superficie. No lo empujes hasta el fondo: así los posos y finos asentados quedan fuera de tu taza.',
    },
    scottRaoFrenchPress: {
      pour: 'Vierte toda el agua',
      pourNote: 'Vierte rápido, de una sola vez, asegurándote de mojar todo el café',
      restPlunger: 'Apoya el émbolo',
      restPlungerNote: 'Coloca el émbolo a 1cm por debajo de la superficie — no lo presiones',
      plunge: 'Prensa con suavidad',
      plungeNote: 'Presiona hacia abajo con suavidad y de forma pareja',
      settle: 'Deja que se asiente',
      settleNote: 'Espera a que las partículas de café se asienten y sirve',
    },
    gwilymDaviesFrenchPress: {
      pour: 'Vierte toda el agua',
      pourNote: 'Añádela rápido',
      rest1: 'Reposa, sin tapa',
      rest1Note: 'Deja la tapa quitada y espera 5 minutos',
      stir: 'Remueve',
      stirNote: 'Mezcla el café y el agua con una cuchara',
      insertPlunger: 'Inserta el émbolo',
      insertPlungerNote: 'Inserta el émbolo, pero no lo presiones todavía',
      rest2: 'Reposa',
      rest2Note: 'Espera 3 minutos',
      press: 'Presiona lento',
      pressNote: 'Presiona el émbolo hacia abajo lentamente',
      rest3: 'Reposa',
      rest3Note: 'Espera 2 minutos',
      pourOut: 'Vierte en la jarra',
      pourOutNote: 'Vierte el café y espera 2 minutos más antes de servir',
    },
  },
  timer: {
    backToRecipe: '← Volver a la receta',
    ready: 'Listo cuando quieras',
    now: (label) => `Ahora: ${label}`,
    next: (seconds, label, grams) => `Siguiente en ${seconds}s — ${label}${grams ? ` (${grams}g)` : ''}`,
    done: '¡Café listo, disfrútalo!',
    start: 'Iniciar',
    pause: 'Pausar',
    resume: 'Reanudar',
    reset: 'Reiniciar',
    saveRecipe: 'Guardar esta receta',
    savedConfirmation: '¡Receta guardada!',
  },
  saved: {
    title: 'Recetas guardadas',
    namePlaceholder: 'Nombre de la receta, ej. V60 del domingo',
    save: 'Guardar',
    cancel: 'Cancelar',
    load: 'Cargar',
    delete: 'Eliminar',
  },
}

export const translations: Record<Lang, Translations> = { en, es }
