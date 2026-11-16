# Rapport d'audit — RescueOps

Auteur : Grégory Compastié
Pseudo GitHub : L3criminio
Date : 09/11/2026
Audit et corrections : 16/11/2026
Commit de base : 5e99359aa7cb8ad6a79a67a02373300e8b5a6873

| ID | Règle RO | Fichier / fonction | Entrée, obtenu S0, attendu | Risque concret | Priorité P0/P1/P2 | Preuve du correctif (test / commit) |
|---|---|---|---|---|---|---|
| A-01 | RO-02 | `src/energy.js`, `estimateEnergy` | (0, 2) -> 11 ; (5, -1) -> 22. Attendu : `RangeError`. | Coût calculé sur des entrées invalides. | P1 : validation métier absente. | Corrigé : 2 conditions -> `energy.test.js`, valeurs invalides et bornes ; `82bdb58`. |
| A-02 | RO-03/05 | `src/dispatch.js`, `deployDrone` | Drone `busy` ou mission `en_route` -> départ accepté en S0. Attendu : `Error`, entrées intactes. | Drone affecté deux fois ou mission redéployée. | P0 : affectation incompatible avec la sûreté de la simulation. | Corrigé : exiger `available` et `planned` -> `dispatch.test.js`, refus et nouveaux objets ; `42c12b9`. |
| A-03 | RO-04 | `src/dispatch.js`, `deployDrone` | Coût 31, batterie 35 -> départ avec 4 points ; batterie 50 -> 19 points. Attendu : `RangeError` ; 51 -> accepté. | Départ sans la réserve minimale de 20 points. | P0 : réserve de sûreté non respectée. | Corrigé : vérifier la réserve -> `dispatch.test.js`, batteries 0/30/35/50 refusées, 51 acceptée ; `09183b8`. |
| A-04 | RO-03/06 | `src/mission.js`, `advanceMission` | `planned -> en_route` sans drone, ou `en_route -> closed` -> acceptés en S0. Attendu : `Error`, source intacte. | Déploiement contourné et historique incohérent. | P0 : mission lancée sans contrôle du drone ni de sa batterie. | Corrigé : tableau des 3 étapes autorisées -> `mission.test.js`, 6 statuts et refus sans mutation ; `554a9d3`. |
| A-05 | RO-07 | `src/mission.js`, `cancelMission` | `en_route -> canceled` accepté en S0. Attendu : `Error` ; annulation seulement depuis `planned`. | Mission annulée alors que le drone est parti. | P1 : annulation contraire au contrat. | Corrigé : limiter à `planned` -> `mission.test.js`, 5 refus et annulation sans mutation ; `2638f17`. |
| A-06 | RO-08 | `src/public.js`, `getPublicStatus` | Suivi SOS-204 -> e-mail, GPS et priorité visibles ; historique partagé avec la source. Attendu : exactement `id`, `status`, copie de `history`. | Données privées publiques et historique modifiable depuis la vue. | P0 : données personnelles exposées selon la grille du TP. | Corrigé : retirer les champs privés et copier l'historique -> `public.test.js`, champs exacts et copie indépendante ; `960b25f`. |
| A-07 | RO-09 | `src/php/MissionCard.php`, `publicCard` | Mission SOS-204 -> carte avec `contactEmail` et `gps`. Attendu : exactement `id`, `statusLabel`. | Contact et coordonnées visibles publiquement. | P0 : données personnelles exposées selon la grille du TP. | Corrigé : retirer contact et GPS -> `MissionCard.test.php`, champs exacts, 6 libellés, entrée intacte ; `b5e85fb`. |

## D-01 — Dette technique reportable

Absence de CI GitHub -> un push peut oublier les tests. P2, reportée pour garder le TP centré sur les défauts métier. Mesure : exécuter JS, PHP, syntaxe et diff avant chaque livraison. Responsable : auteur ; réévaluer avant une prochaine livraison ou un travail en équipe. Aucun défaut P0 n'est différé.

## Contrôles AVANT correction

- `npm.cmd test` -> 8 tests JS réussis.
- `php tests/MissionCard.test.php` -> 3 vérifications conformes.
- `php -l src/php/MissionCard.php` -> syntaxe valide.
- `npm.cmd run demo` -> coût 31, batterie 39 ; e-mail et GPS publics ; départ à 35 accepté avec 4 points restants.
- Les tests initiaux couvrent surtout les cas autorisés, pas l'ensemble du contrat.

Tests ajoutés puis exécutés avant chaque fix :

| Commande ciblée | Échecs observés avant le fix |
|---|---|
| `node --test tests/energy.test.js` | 2 : distance et charge invalides acceptées. |
| `node --test tests/dispatch.test.js` (A-02) | 2 : drone occupé et mission non planifiée acceptés. |
| `node --test tests/dispatch.test.js` (A-03) | 1 : réserve insuffisante acceptée. |
| `node --test tests/mission.test.js` (A-04) | 6 : transitions interdites acceptées depuis chaque statut. |
| `node --test --test-name-pattern=RO-07 tests/mission.test.js` | 3 : annulation en route, sur place et au retour acceptée. |
| `node --test tests/public.test.js` | 2 : champs privés présents et historique partagé. |
| `php tests/MissionCard.test.php` | Arrêt sur P04 : contact et GPS encore présents. |

Les cas regroupés dans une boucle s'arrêtent au premier échec ; ils sont tous parcourus après correction.

## Contrôles APRÈS correction

- `npm.cmd test -- --test-reporter=spec` -> 33 tests JS réussis, 0 échec.
- `php tests/MissionCard.test.php` -> 11 vérifications conformes.
- `php -l src/php/MissionCard.php` et `php -l tests/MissionCard.test.php` -> syntaxe valide.
- `npm.cmd run demo` -> coût 31, batterie 39, suivi sans données privées ; départ à 35 refusé.
- `git diff --check` et `git diff 5e99359 --check` -> aucune erreur.
- RO-01 et les libellés PHP conservés ; règles métier non modifiées.
- Auto-revue -> 2 tests d'intégration ajoutés : énergie invalide au déploiement et suivi public après départ.
- Limites : tests locaux, pas de CI ni de revue par un pair. Les créateurs reçoivent des entrées bien formées selon le contrat.

## Conclusion d'audit

A-01 à A-07 corrigés et testés. Aucun P0 différé ; D-01 reste en P2. Les tests initiaux passent toujours. Voir `PR_DESCRIPTION.md` et `REVUE.md` pour la livraison et l'auto-revue.
