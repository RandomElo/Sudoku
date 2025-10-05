export default function resoudreSudoku(grille) {
    const taille = 9;

    function estValide(ligne, colonne, chiffre) {
        const n = chiffre.toString();

        // Vérifie la ligne
        for (let j = 0; j < taille; j++) {
            if (grille[ligne][j] === n) return false;
        }

        // Vérifie la colonne
        for (let i = 0; i < taille; i++) {
            if (grille[i][colonne] === n) return false;
        }

        // Vérifie le carré
        const debutLigne = Math.floor(ligne / 3) * 3;
        const debutColonne = Math.floor(colonne / 3) * 3;
        for (let i = debutLigne; i < debutLigne + 3; i++) {
            for (let j = debutColonne; j < debutColonne + 3; j++) {
                if (grille[i][j] === n) return false;
            }
        }

        return true;
    }

    // Fonction récursive qui essaie de compléter la grille
    function resoudre() {
        for (let ligne = 0; ligne < taille; ligne++) {
            for (let colonne = 0; colonne < taille; colonne++) {
                if (grille[ligne][colonne] === "-") {
                    for (let chiffre = 1; chiffre <= 9; chiffre++) {
                        if (estValide(ligne, colonne, chiffre)) {
                            grille[ligne][colonne] = chiffre.toString();
                            if (resoudre()) return true;
                            grille[ligne][colonne] = "-";
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    resoudre();
    return grille;
}
