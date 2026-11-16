# [RescueOps] Description complète de PR à remplir

## Problème observé

Les 8 tests JS et 3 vérifications PHP de départ passaient, mais des départs interdits étaient acceptés, le parcours pouvait être contourné et les vues publiques exposaient le contact et le GPS. Cette PR corrige les 7 constats du rapport, sans changer la formule d'énergie ni les libellés PHP.

## Exigences traitées : RO-xx et constats A-xx

- A-01 / RO-02 -> distance et charge valides, sinon `RangeError`.
- A-02 / RO-03/05 -> drone disponible, mission planifiée, nouveaux objets.
- A-03 / RO-04 -> réserve de 20 points minimum : 50 refusé, 51 accepté pour un coût de 31.
- A-04 / RO-03/06 -> déploiement obligatoire puis étapes dans l'ordre.
- A-05 / RO-07 -> annulation seulement depuis `planned`.
- A-06 / RO-08 -> suivi JS limité à `id`, `status`, copie de `history`.
- A-07 / RO-09 -> carte PHP limitée à `id`, `statusLabel`.
- RO-01 conservée ; RO-10/11 -> rapport, preuves, auto-revue et même PR.

## Correctifs (fichier / fonction / comportement)

- `src/energy.js`, `estimateEnergy` -> 2 conditions avant le calcul.
- `src/dispatch.js`, `deployDrone` -> vérifier les statuts et la réserve avant le départ.
- `src/mission.js` -> tableau des 3 transitions autorisées ; annulation limitée à `planned`.
- `src/public.js` -> retirer les données privées et copier l'historique.
- `src/php/MissionCard.php` -> retirer contact et GPS.
- `tests/` -> anciens tests conservés, tests révélateurs ajoutés avant chaque fix.
- `docs/` -> audit, dette D-01, preuves et auto-revue renseignés. Un commit par fix.

## Tests réellement exécutés : commandes et résultats

Avant les fixes -> échecs confirmés pour chaque constat. Détail dans le rapport.

| Commande | Résultat final |
|---|---|
| `npm.cmd test -- --test-reporter=spec` | 33 tests JS réussis, 0 échec. |
| `php tests/MissionCard.test.php` | 11 vérifications conformes. |
| `php -l src/php/MissionCard.php` | Syntaxe valide. |
| `php -l tests/MissionCard.test.php` | Syntaxe valide. |
| `npm.cmd run demo` | Coût 31, batterie 39, départ à 35 refusé, suivi sans données privées. |
| `git diff 5e99359 --check` | Aucune erreur. |

Sous PowerShell, `npm.cmd` évite le blocage de `npm.ps1`.

## Non-régression / objets non mutés

Les 8 tests JS et 3 vérifications PHP initiaux sont conservés. Coûts 31 et 9 inchangés, charge 0/5 acceptée et 6 libellés PHP vérifiés. Déploiement, transitions et annulation -> source intacte en cas de succès comme de refus. Modifier l'historique public ne modifie pas la mission.

## Risques résiduels et dette D-01

CI absente -> P2, contrôles manuels avant chaque livraison ; à réévaluer avant la prochaine livraison ou un travail en équipe. Aucun P0 différé. Tests locaux, pas de pair externe ; entrées des créateurs supposées bien formées selon le contrat.

## Points précis à relire

- Réserve : `< 20` doit refuser ; exactement 20 doit passer.
- `planned -> en_route` doit passer uniquement par `deployDrone`.
- Les vues publiques ne doivent exposer aucun champ privé.

## Modifications faites après revue (dans cette même PR)

Auto-revue assistée, identifiée dans `REVUE.md` -> 2 tests ajoutés (`27a617a`) : énergie invalide au déploiement et suivi public après un vrai départ. Tous passent. Aucune approbation GitHub inventée.

## Preuve de livraison
URL réelle : https://github.com/jcrangon/RescueOps_B2_TP_FINAL/pull/1
Branche source dans mon fork : `L3criminio:TP_RescueOps_Gregory_Compastie`
Branche cible dans le dépôt du formateur : `jcrangon/RescueOps_B2_TP_FINAL:main`
Statut final de la PR : brouillon à ce stade ; passage en Ready for review après publication des contrôles. Ne pas fusionner.
