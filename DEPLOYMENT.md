# Publication sur OVH

Le dépôt `nogseb/street-art`, branche `main`, est la source de référence. Le site est un frontend statique React/Vite, publié à l’adresse **https://nogues.app/street-art/**.

## Build et publication

Le workflow `.github/workflows/deploy-ovh.yml` s’exécute après chaque push sur `main` et peut être lancé manuellement depuis GitHub Actions. Il installe pnpm 10.4.1, respecte le lockfile, vérifie TypeScript, exécute les tests, construit le site et contrôle le contenu du build avant l’envoi SFTP.

**Seul `dist/public/` est publié dans `www/street-art`.** Le transfert ajoute ou remplace les fichiers ; il n’utilise aucune option de suppression distante. Les anciennes ressources hashées peuvent donc rester sur le serveur. La racine `www`, les dossiers `www/rm`, `www/kids` et `www/.well-known` ne doivent jamais être modifiés.

Le contrôle du dossier cible a été renforcé par rapport au modèle fourni : toute valeur autre que `www/street-art` (avec éventuellement un slash final) est refusée, même si la variable GitHub existe. Le modèle initial refusait seulement la racine, mais n’empêchait pas une variable de pointer vers un autre projet.

## Configuration GitHub

Dans **Settings → Secrets and variables → Actions**, fournir les secrets de dépôt suivants directement dans GitHub, jamais dans le code ou un message :

| Paramètre | Type | Fonction |
| --- | --- | --- |
| `OVH_SFTP_HOST` | Secret | Hôte SFTP |
| `OVH_SFTP_USER` | Secret | Utilisateur SFTP |
| `OVH_SFTP_PASSWORD` | Secret | Mot de passe SFTP |
| `OVH_TARGET_DIR` | Variable facultative | Uniquement `www/street-art` ; cette valeur est utilisée par défaut si la variable est absente |

Si les secrets sont absents, le workflow affiche **« Secrets SFTP absents : publication ignorée. »** et n’envoie aucun fichier. Une exécution verte avec l’étape d’envoi ignorée ne signifie pas que le site a été déployé.

## Site autonome

Vite utilise `base: '/street-art/'` et Wouter utilise le même préfixe. Le fichier `client/public/.htaccess` est copié dans le build et renvoie les routes inconnues vers `/street-art/index.html`. Il ne remplace pas le `.htaccess` à la racine du domaine.

L’image officielle de Tatie Monique et le favicon sont intégrés au dépôt et au build, sans chemin `/manus-storage/`. La photo est un WebP de 1200 × 1600 pixels ; le favicon est un PNG de 96 × 96 pixels. Les scripts de prévisualisation, le proxy cartographique Google inutilisé et l’analytics propres à Manus ont été retirés du build OVH. Aucun backend Node n’est nécessaire sur OVH.

La carte conserve Leaflet et les tuiles publiques OpenStreetMap, sans clé API. Les polices Google Fonts et les tuiles sont chargées en HTTPS ; le site n’est pas un site hors ligne. Le service cartographique public impose une attribution visible et reste sans garantie de disponibilité : https://operations.osmfoundation.org/policies/tiles/.

## Photos des visiteurs et coexistence des domaines

Les photos personnelles restent stockées dans IndexedDB/localStorage, dans le navigateur de chaque visiteur. **Changer de domaine ne migre pas ces photos** : les données ajoutées sur l’adresse Manus ne sont pas accessibles depuis `nogues.app`. Aucun stockage serveur ou partage entre appareils n’a été ajouté.

L’adresse Manus doit rester en ligne jusqu’à validation explicite de la nouvelle adresse par l’utilisateur. Le projet Manus n’est pas modifié par ce workflow GitHub ; les évolutions suivantes doivent être apportées à ce dépôt de référence.

## Vérification après chaque déploiement

Vérifier l’accueil et les huit étapes, la carte, l’image officielle, le lightbox, le mode sombre, les liens Google Maps et le retour à l’accueil depuis une route inconnue sur ordinateur et mobile. Confirmer que la page d’accueil de `nogues.app` est inchangée. Une validation avec navigateur mobile simulé ne remplace pas le contrôle sur un iPhone physique.
