import e from "express";
import cors from "cors";
import { getSudoku } from "sudoku-gen";
import resoudreSudoku from "./resoudreSudoku.js";

const app = e();
const port = 3000;

app.use(
    cors({
        origin: "http://127.0.0.1:5500",
        methods: ["GET"],
        allowedHeaders: ["Content-Type"],
    })
);

app.use(e.json());

app.get("/generation-sudoku/:difficulte", (req, res) => {
    let { difficulte } = req.params;
    const niveaux = ["easy", "medium", "hard", "expert"];

    if (!niveaux.includes(difficulte)) {
        return res.status(400).json({
            error: "Difficulté invalide. Valeurs acceptées : easy, medium, hard, expert.",
        });
    }

    const puzzle = getSudoku(difficulte);
    return res.json(puzzle.puzzle);
});

app.post("/verification-valeur", (req, res) => {
    const { valeur, coordonnees, grille } = req.body;
    const sudoku = resoudreSudoku(grille);
    return res.json(valeur == sudoku[coordonnees.l][coordonnees.c]);
});

app.post("/indice", (req, res) => {
    const tableauCoordonneesCaseVide = [];
    // Récupération du nombre
    for (let indiceLigne in req.body) {
        const ligne = req.body[indiceLigne];
        for (let indiceColonne in ligne) {
            const colonne = ligne[indiceColonne];
            if (colonne == "-") {
                tableauCoordonneesCaseVide.push({ l: Number(indiceLigne), c: Number(indiceColonne) });
            }
        }
    }
    const cordonneeIndice = tableauCoordonneesCaseVide[Math.floor(Math.random() * tableauCoordonneesCaseVide.length)]; // Je choisi de facon alétoire l'indice
    const sudokuComplet = resoudreSudoku(req.body);

    return res.json({ indice: sudokuComplet[cordonneeIndice.l][cordonneeIndice.c], coordonnees: cordonneeIndice });
});

app.post("/remplissage-auto", (req, res) => {
    const sudokuComplet = resoudreSudoku(req.body);
    return res.json(sudokuComplet);
});

app.listen(port, () => {
    console.log(`Serveur : http://localhost:${port}`);
});
