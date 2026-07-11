# Ideas — Parcours Street Art Saint-Denis

## Trois approches stylistiques

### 1. "Raw Concrete"
Esthétique brute inspirée des murs de béton et du graffiti. Textures granuleuses, typographie bold condensée, palette monochrome avec accents vifs.
**Probabilité : 0.04**

### 2. "Cartographic Narrative"
Design centré sur la carte comme élément narratif principal. Approche éditoriale type magazine de voyage, fond clair, typographie élégante, carte plein écran avec panneaux latéraux.
**Probabilité : 0.07**

### 3. "Gallery Noire"
Fond sombre type galerie d'art contemporain. Les fresques sont mises en valeur comme des oeuvres dans un espace muséal digital. Transitions douces, typographie fine.
**Probabilité : 0.03**

---

## Approche choisie : "Cartographic Narrative"

### Design Movement
Cartographie narrative — inspiré des guides de voyage éditoriaux haut de gamme (Monocle, Cereal Magazine) croisés avec l'interactivité des cartes modernes (Mapbox Studio, Strava).

### Core Principles
1. **La carte est le héros** — elle occupe l'espace principal et sert de point d'entrée vers les contenus
2. **Narration progressive** — les informations se dévoilent au clic, sans surcharger l'interface
3. **Contraste éditorial** — typographie soignée et mise en page magazine pour les fiches artistes
4. **Ancrage local** — couleurs et textures évoquant La Réunion (terre volcanique, océan, végétation tropicale)

### Color Philosophy
- Fond principal : blanc cassé chaud (#F8F6F3) — évoque le papier de qualité
- Encre : noir profond (#1A1A1A) — lisibilité maximale
- Accent primaire : corail volcanique (#FF3E52) — énergie du street art, rappel de la lave
- Accent secondaire : bleu océan profond (#1A237E) — Kid Kreol & Boogie, océan Indien
- Tertiaire : vert tropical (#2D6A4F) — végétation luxuriante de l'île

### Layout Paradigm
Split-screen asymétrique : carte interactive à gauche (60%), panneau narratif à droite (40%) sur desktop. Sur mobile : carte plein écran avec panneau coulissant (bottom sheet).

### Signature Elements
1. **Marqueurs numérotés** sur la carte avec code couleur par artiste/type
2. **Panneaux coulissants** avec animation de révélation progressive au clic sur un marqueur
3. **Ligne de parcours animée** en pointillés qui pulse doucement pour indiquer la direction

### Interaction Philosophy
Exploration guidée mais libre : l'utilisateur peut suivre l'itinéraire dans l'ordre ou cliquer sur n'importe quel point. Chaque interaction révèle une couche d'information supplémentaire (fresque → artiste → bio complète).

### Animation
- Marqueurs : léger rebond à l'apparition (spring physics)
- Panneau latéral : slide-in depuis la droite (200ms ease-out)
- Ligne de parcours : animation dash-offset continue (pulse)
- Transitions entre fiches : fade + translate-y subtil

### Typography System
- Titres : **DM Serif Display** — élégance éditoriale, contraste avec le sujet urbain
- Corps : **Inter** — lisibilité parfaite pour les descriptions
- Labels carte / badges : **JetBrains Mono** ou **Space Mono** — aspect technique/cartographique

### Brand Essence
Guide interactif du street art dionysien — pour les voyageurs curieux qui veulent explorer l'art urbain de Saint-Denis à pied, au-delà des circuits touristiques classiques. Cultivé, accessible, ancré.

Trois adjectifs : **Exploratoire, Éditorial, Ancré**

### Brand Voice
Headlines et microcopy avec un ton de guide local cultivé. Pas de jargon touristique, pas de superlatifs vides.
- Exemple headline : "7 fresques, 2 km, 1 quartier qui se raconte sur ses murs"
- Exemple CTA : "Explorer le parcours"

### Wordmark & Logo
Lettrage "ST.ART" stylisé — le point entre ST et ART crée un double sens (street + art + start). Typographie condensée bold avec un accent corail sur le point.

### Signature Brand Color
Corail volcanique (#FF3E52) — énergie créative, lave réunionnaise, impossible à confondre.

## Style Decisions
- La carte utilise le fond CartoDB Positron (clair, sobre, lisible)
- Les marqueurs sont des cercles numérotés avec couleur par catégorie
- Le panneau descriptif a un fond blanc avec une bordure gauche colorée selon l'artiste
- Les biographies s'ouvrent dans un drawer/modal avec photo de profil stylisée (initiales si pas de photo)
- Desktop default state : la carte est toujours accompagnée d'un panneau éditorial d'introduction visible
- Brand lockup : "ST.ART" stylisé avec point corail est le branding primaire ; "Parcours Street Art Saint-Denis" est secondaire
- Typography rule : DM Serif Display pour les headlines éditoriales, Inter pour le body, mono uniquement pour les métadonnées de route/badges
