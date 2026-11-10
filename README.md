# Cartographie Amiens – Petit-Caux (Argœuves–Navarre)

Cartographie territoriale, cinq onglets et réseau indépendant. Données consolidées au **10 novembre 2026** à partir du fichier **Amiens(1).xlsx**.

## Onglets

1. **Cartographie des acteurs** : 45 positions liées à des sources et 69 entités (incluant le projet central et 23 entités contextuelles).
2. **Synthèse des oppositions** : 13 thèmes étayés, effets forestiers, riverains et compensations agricoles distingués.
3. **Points de vigilance & sources** : 18 vigilances et 24 références URL.
4. **Chronologie** : 18 jalons sourcés et 10 repères techniques, faits et projections séparés.
5. **Évolution des acteurs** : Nouveaux / Cumulés / Par position, avec périmètre local ou contextuel ; 45 acteurs suivis dont 35 datables, 10 non datés.

## Enseignements principaux

- La ligne à deux circuits **400 kV, environ 80 km**, entre Argœuves et Navarre a reçu une **DUP par arrêté ministériel du 8 juin 2026**, publié le 11 juin. **La DUP ne prouve pas une mise en service ni l'obtention de toute autorisation environnementale.**
- STOP THT 76-80 conteste notamment la traversée de la forêt d’Eu et présente l'alternative « scénario 1 » ; l'article de juin 2026 évoque une intention de recours futur, pas le dépôt d'un recours avéré.
- Les FDSEA, JA, FNSEA, Chambre d'agriculture et autres organisations contestent les indemnisations, demandent de valoriser la « perte de chance » ; cette démarche ne prouve pas un rejet collectif de toute liaison.
- Les cinq organisations citées comme soutiens du collectif STOP THT et des participants administratifs sont des **acteurs documentés sans position propre établie**.
- Les montants d'indemnisation et surfaces forestières rapportés sont attribués à leurs sources, sans être présentés comme des coûts définitifs ou des impacts déjà constatés.
- La réunion agricole prévue le 10 juillet 2026 n'est pas considérée comme une négociation aboutie : aucun compte-rendu de résultat dans le fichier fourni.

## Audit documentaire

- Fichier `data/audit-amiens1-20261110.json` : classification des **17 lignes**, preuve par URL et détection des doublons et sources anciennes.
- Empreinte SHA-256 de la source Excel : `69ad8738762dd10bfc46cbd25a083cc67c79ae6c26ae8ecabd42f594dadc4caa`.
- Les lignes **3, 7 et 11** correspondent au même reportage ICI publié en **septembre 2025**, non à trois événements nouveaux. Les dates de trouvaille Excel ne sont pas assimilées à des publications.
- La contribution STOP THT comporte une date d'en-tête contradictoire avec le récit de création en 2023 ; une date non confirmée ne sert pas à ajouter des points de courbe.
- L'extrait du PDF de contribution atteint **32 767 caractères** dans Excel, ce qui ne garantit pas l'intégralité du document source.

## Sources primaires

- RTE : https://www.rte-france.com/projets/nos-projets/creation-ligne-electrique-amiens-petitcaux
- Préfecture (arrêtés) : https://www.somme.gouv.fr/Actions-de-l-Etat/Amenagement-du-territoire/RTE-Reseau-de-transport-d-electricite-Projet-de-ligne-a-haute-tension-entre-Amiens-80-et-Petit-Caux-76/Arretes-portant-declaration-d-utilite-publique
- Texte légal (DUP) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054228910
- Contribution STOP THT : https://assets.rte-france.com/prod/public/concertation-documents/avis_stop_tht_76_80_0_2.pdf
- Profession agricole : https://www.action-agricole-picarde.com/ligne-amiens-petit-caux-les-agriculteurs-veulent-indemniser-la-perte-de-chance

## Maintenance

Les données sont dans `data/`, les catégories dans `config/taxonomy.json` ; les deux visualisations utilisent les mêmes fiches et preuves. La cartographie n'est pas un jugement arbitral sur l'utilité du projet.

```bash
python3 validate.py
python3 -m http.server 8000
```

Ouvrir le site servi sur HTTP : la lecture directe en `file://` ne permet pas de charger les données JSON. Le rendu final de GitHub Pages n'est pas automatiquement testé par les contrôles.
