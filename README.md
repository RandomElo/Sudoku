# 🧩 Générateur et résolveur de sudoku
Ce projet propose deux fonctionnalités principales : un **générateur** de grilles de Sudoku et un **résolveur automatique**.
## 🎲 Générateur de sudoku
- Permet de générer une grille avec différents niveaux de difficulté : facile, moyen, difficile et expert.

- Offre la possibilité d’utiliser plusieurs aides :

    - Affichage des emplacements possibles : en cliquant sur un chiffre déjà présent dans la grille (par exemple le 3), le programme met en évidence toutes les cases où ce chiffre peut encore être placé.

    - Indices pour dévoiler le résultat pour une case vide aléatoirement.

    - Résolution complète

## ⚙️ Résolveur automatique
- Il suffit de saisir les chiffres connus dans la grille.

- Le programme résout automatiquement le Sudoku complet grâce à son algorithme intégré.

## 💻 Aperçu du site
### Générateur de sudoku
![Capture du générateur](/frontend/img/README/generateur.png)
### Résolveur automatique
![Capture du générateur](/frontend/img/README/resolveur.png)

## 🚀 Technologies utilisées
- **Frontend** : HTML, CSS et JavaScript
- **Backend** : 
    - **Express.js** : framework Node.js permettant de créer facilement une API.
    - **[sudoku-gen](https://www.npmjs.com/package/sudoku-gen)** : librairie utilisée pour générer aléatoirement des grilles de Sudoku.
    - **CORS** : middleware permettant d’autoriser les requêtes entre le serveur Express et le frontend,