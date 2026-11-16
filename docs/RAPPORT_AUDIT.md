# Rapport d'audit — RescueOps

Auteur : Grégory Compastié
Pseudo GitHub : L3criminio
Date : 09/11/2026
Audit et corrections : 16/11/2026
Commit de base : 5e99359aa7cb8ad6a79a67a02373300e8b5a6873

| ID | Règle RO | Fichier / fonction | Entrée, obtenu S0, attendu | Risque concret | Priorité P0/P1/P2 | Preuve du correctif (test / commit) |
|---|---|---|---|---|---|---|
| A-01 | RO-02 | `src/energy.js`, `estimateEnergy` | (0, 2) -> 11 ; (5, -1) -> 22. Attendu : `RangeError`. | Coût calculé sur des entrées invalides. | P1 : validation métier absente. | À corriger : vérifier distance et charge -> tests des valeurs invalides et des bornes. |
| A-02 | RO-03/05 | `src/dispatch.js`, `deployDrone` | Drone `busy` ou mission `en_route` -> départ accepté en S0. Attendu : `Error`, entrées intactes. | Drone affecté deux fois ou mission redéployée. | P0 : affectation incompatible avec la sûreté de la simulation. | À corriger : exiger `available` et `planned` -> tests des refus et du résultat accepté. |
| A-03 | RO-04 | `src/dispatch.js`, `deployDrone` | Coût 31, batterie 35 -> départ avec 4 points ; batterie 50 -> 19 points. Attendu : `RangeError` ; 51 -> accepté. | Départ sans la réserve minimale de 20 points. | P0 : réserve de sûreté non respectée. | À corriger : vérifier la réserve -> tests à 35, 50 et 51 points. |
| A-04 | RO-03/06 | `src/mission.js`, `advanceMission` | `planned -> en_route` sans drone, ou `en_route -> closed` -> acceptés en S0. Attendu : `Error`, source intacte. | Déploiement contourné et historique incohérent. | P0 : mission lancée sans contrôle du drone ni de sa batterie. | À corriger : imposer les 3 transitions autorisées -> tests sauts, retours, répétitions et états terminaux. |
| A-05 | RO-07 | `src/mission.js`, `cancelMission` | `en_route -> canceled` accepté en S0. Attendu : `Error` ; annulation seulement depuis `planned`. | Mission annulée alors que le drone est parti. | P1 : annulation contraire au contrat. | À corriger : limiter à `planned` -> tests de chaque statut et de l'historique. |
| A-06 | RO-08 | `src/public.js`, `getPublicStatus` | Suivi SOS-204 -> e-mail, GPS et priorité visibles ; historique partagé avec la source. Attendu : exactement `id`, `status`, copie de `history`. | Données privées publiques et historique modifiable depuis la vue. | P0 : données personnelles exposées selon la grille du TP. | À corriger : retirer les champs privés, copier l'historique -> 2 tests. |
| A-07 | RO-09 | `src/php/MissionCard.php`, `publicCard` | Mission SOS-204 -> carte avec `contactEmail` et `gps`. Attendu : exactement `id`, `statusLabel`. | Contact et coordonnées visibles publiquement. | P0 : données personnelles exposées selon la grille du TP. | À corriger : retirer contact et GPS -> champs exacts, libellés conservés, entrée intacte. |

## D-01 — Dette technique reportable

Absence de CI GitHub -> un push peut oublier les tests. P2, reportée pour garder le TP centré sur les défauts métier. Mesure : exécuter JS, PHP, syntaxe et diff avant chaque livraison. Responsable : auteur ; réévaluer avant une prochaine livraison ou un travail en équipe. Aucun défaut P0 n'est différé.

## Contrôles AVANT correction

- `npm.cmd test` -> 8 tests JS réussis.
- `php tests/MissionCard.test.php` -> 3 vérifications conformes.
- `php -l src/php/MissionCard.php` -> syntaxe valide.
- `npm.cmd run demo` -> coût 31, batterie 39 ; e-mail et GPS publics ; départ à 35 accepté avec 4 points restants.
- Les tests initiaux couvrent surtout les cas autorisés, pas l'ensemble du contrat.

## Contrôles APRÈS correction

Commandes, résultats réellement observés et limites :

## Conclusion d'audit
