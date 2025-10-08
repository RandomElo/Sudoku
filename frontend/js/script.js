// Fonction qui me permet de lancer des confettis une fois le sudoku résolu
function lancerConfettis() {
    confetti({
        particleCount: 50,
        angle: 60, // entre 60 et 120 degrés
        spread: 55,
        ticks: 500,
        drift: 2,
        origin: {
            x: 0.05,
            y: 0.85,
        },
    });
    confetti({
        particleCount: 50,
        angle: 120, // entre 60 et 120 degrés
        spread: 55,
        ticks: 500,
        drift: -2,
        origin: {
            x: 0.95,
            y: 0.85,
        },
    });
}

// Fonction qui gére entièrement le sudoku
function afficherSudoku(element, type = "string", affichage) {
    // Permet de récupérer la grille directement dans un tableau a double dimension
    function recuperationGrille(coordonnees) {
        const tableau = document.querySelector("table");

        const lignes = tableau.querySelectorAll("tr");

        const resultat = Array.from(lignes).map((tr) => {
            const cellules = tr.querySelectorAll("td");
            return Array.from(cellules).map((td) => {
                const input = td.querySelector("input");
                return input ? (input.value.trim() === "" ? "-" : input.value.trim()) : td.textContent.trim();
            });
        });
        if (coordonnees) {
            resultat[coordonnees.l][coordonnees.c] = "-";
        }
        return resultat;
    }

    // Permet de vérifier si la grille est entièrement remplis
    function verifierFin() {
        const tableau = recuperationGrille();
        for (const ligne of tableau) {
            for (const colonne of ligne) {
                if (colonne == "-") {
                    return;
                }
            }
        }
        document.querySelector("#divBoutonsPrincipale").style.display = "none";
        lancerConfettis();
    }

    // Permet de remplir la grille de façon intelligente
    async function remplissageAutomatique() {
        const requete = await fetch("http://localhost:3000/remplissage-auto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recuperationGrille()),
        });
        if (requete.ok) {
            const reponse = await requete.json();
            for (const idLigne in reponse) {
                const ligne = reponse[idLigne];
                for (const idCellule in ligne) {
                    let cellule = document.querySelector(`[data-l="${idLigne}"][data-c="${idCellule}"]`);
                    const ancienneValeur = cellule.textContent;
                    if (ancienneValeur != ligne[idCellule]) {
                        cellule.innerText = ligne[idCellule];
                        cellule.classList.add("celluleResolueAuto");
                    }
                }
            }
            document.querySelector("#divBoutonsPrincipale").style.display = "none";
            lancerConfettis();
        } else {
            alert("Erreur lors de la récupération d'indice");
        }
    }

    let lignes = [];

    if (type == "string") {
        const chaineSplit = element.split("");
        for (let i = 0; i < 9; i++) {
            lignes.push(chaineSplit.slice(i * 9, (i + 1) * 9));
        }
    } else if (type == "tableau") {
        lignes = element;
    }

    let tableau = /*html*/ `<table>`;
    for (const indiceLigne in lignes) {
        const ligne = lignes[indiceLigne];
        let conteneur = /*html*/ `<tr>`; // </td></tr>
        for (const indiceColonne in ligne) {
            let element = ligne[indiceColonne];
            if (element == "-") {
                element = /*html*/ `<input type="text" class="inputCaseSudoku" />`;
            }
            conteneur += /*html*/ `<td data-l="${indiceLigne}" data-c="${indiceColonne}">${element}</td>`;
        }
        tableau += conteneur;
    }
    tableau += /*html*/ `</table>`;
    document.querySelector("#divResultat").innerHTML = tableau;

    if (affichage !== "resolution") {
        document.querySelector("#divBoutons").innerHTML = /*html*/ `
        <div id="divBoutonsPrincipale">
            <a id="boutonIndice" class="bouton">Indice</a>
        <a id="boutonRemplissageAutomatique" class="bouton">Remplissage automatique</a>
        </div>
        <div id="divBoutonGenererAutre">
            <a id="boutonGenererAutre" class="bouton">Générer un autre</a>
            <select id="selectDifficulte" class="select">
                <option value="easy">Difficulté facile</option>
                <option value="medium">Difficulté moyen</option>
                <option value="hard">Difficulté difficile</option>
                <option value="expert">Difficulté expert</option>
            </select>
        </div>`;

        // Gestion des cliques sur les boutons actions
        document.querySelector("#boutonRemplissageAutomatique").addEventListener("click", remplissageAutomatique);

        document.querySelector("#boutonIndice").addEventListener("click", async () => {
            const requete = await fetch("http://localhost:3000/indice", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recuperationGrille()),
            });
            if (requete.ok) {
                const reponse = await requete.json();
                document.querySelector(`[data-l="${reponse.coordonnees.l}"][data-c="${reponse.coordonnees.c}"]`).innerText = reponse.indice;
                verifierFin();
            } else {
                alert("Erreur lors du remplissage automatique de la grille");
            }
        });

        document.querySelector("#boutonGenererAutre").addEventListener("click", async () => {
            const difficile = document.querySelector("#selectDifficulte").value;
            const requete = await fetch(`http://localhost:3000/generation-sudoku/${difficile}`);
            if (requete.ok) {
                const reponse = await requete.json();
                afficherSudoku(reponse);

                let valeur;
                switch (difficile) {
                    case "easy":
                        valeur = "Facile";
                        break;
                    case "medium":
                        valeur = "Moyen";
                        break;
                    case "hard":
                        valeur = "Difficile";
                        break;
                    case "expert":
                        valeur = "Expert";
                        break;
                    default:
                        break;
                }
                document.querySelector("#titreMain").innerText = "Sudoku - " + valeur;
            } else {
                alert("Erreur lors de la récupération du sudoku");
            }
        });
    } else if (affichage == "resolution") {
        document.querySelector("#divBoutons").innerHTML = /*html*/ `<a id="boutonResoudre" class="bouton">Résoudre le sudoku</a>`;
        document.querySelector("#boutonResoudre").addEventListener("click", remplissageAutomatique);
    }

    // Gestion de l'ajout des numéro dans un input
    document.querySelectorAll(".inputCaseSudoku").forEach((input) => {
        input.addEventListener("input", async (e) => {
            e.preventDefault();
            if (isNaN(e.target.value)) {
                e.target.value = "";
                return;
            }
            if (e.target.value.length > 1) {
                e.target.value = e.target.value.slice(1, 2);
            }

            if (affichage !== "resolution") {
                const corpsRequete = {
                    valeur: e.target.value,
                    coordonnees: e.target.parentNode.dataset,
                    grille: recuperationGrille(e.target.parentNode.dataset),
                };
                e.target.value = "";
                const requete = await fetch("http://localhost:3000/verification-valeur", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(corpsRequete),
                });
                if (requete.ok) {
                    const reponse = await requete.json();
                    console.log(reponse);
                    const td = e.target.parentNode;

                    if (reponse) {
                        e.target.blur();
                        // td.innerText = corpsRequete.valeur;
                        td.innerHTML = /*html*/ `<div class="divSvgReponse divImgMBonneReponse"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg></div>`;

                        // Forcer le DOM à reconnaître le nouvel élément
                        const div = td.querySelector(".divSvgReponse");
                        div.offsetHeight;
                        div.classList.add("show");

                        setTimeout(() => {
                            e.target.focus();
                            td.innerText = corpsRequete.valeur;
                        }, 2000);
                    } else {
                        td.innerHTML = /*html*/ `<div class="divSvgReponse divImgMauvaiseReponse"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>`;

                        // Forcer le DOM à reconnaître le nouvel élément
                        const div = td.querySelector(".divSvgReponse");
                        div.classList.add("show");
                        div.offsetHeight;

                        setTimeout(() => {
                            td.innerHTML = `<input type="text" class="inputCaseSudoku" />`;
                            td.children[0].focus();
                        }, 2000);
                    }
                    verifierFin();
                } else {
                    alert("Erreur lors de la verification de la valeur saissie");
                }
            }
        });
    });

    // Gestion du clique sur les nombres validées
    const cellules = document.querySelectorAll("td");
    const cellulesSansInput = Array.from(cellules).filter((td) => !td.querySelector("input"));

    cellulesSansInput.forEach((cellule) => {
        cellule.addEventListener("click", (e) => {
            const valeurCellule = e.target.innerText;
            if (e.target.classList.contains("celluleCommune")) {
                for (const cellule of cellules) {
                    cellule.classList.remove("celluleCommune");
                    cellule.classList.remove("celluleAnnexe");
                }
                return;
            }
            // Je met à toutes les cellules un fond blanc
            for (const cellule of cellules) {
                cellule.classList.remove("celluleCommune");
            }

            const cellulesCorrespondante = Array.from(cellules).filter((td) => td.textContent == valeurCellule);

            for (const cellule of cellulesCorrespondante) {
                cellule.classList.add("celluleCommune");
                const l = Number(cellule.dataset.l);
                const c = Number(cellule.dataset.c);

                const cellulesCommuneHorizontale = document.querySelectorAll(`[data-l="${l}"]`);

                for (const c of cellulesCommuneHorizontale) {
                    if (cellule.dataset != c.dataset) {
                        c.classList.add("celluleAnnexe");
                    }
                }

                const cellulesCommuneVerticale = document.querySelectorAll(`[data-c="${c}"]`);

                for (const c of cellulesCommuneVerticale) {
                    if (cellule.dataset != c.dataset) {
                        c.classList.add("celluleAnnexe");
                    }
                }
            }
            // Ajout du bouton pour la suppression du filtre
            const divBoutonsContenu = document.querySelector("#divBoutons").innerHTML;
            document.querySelector("#divBoutons").innerHTML = /*html*/`<a id="boutonSupprimerFiltre" class="bouton">Supprimer filtre</a>`+divBoutonsContenu

        });
    });
}

// Fonction qui s'occupe entièrement de la résolution du sudoku
function resolutionSudoku() {
    function verificateurCoordonnees(variable, typeModificateur) {
        let temp = variable;
        if (typeModificateur == "plus") {
            temp = temp + 1;
        } else {
            temp = temp - 1;
        }
        // Verification
        if (temp >= 0 && temp <= 8) {
            return temp;
        } else {
            return variable;
        }
    }
    document.querySelector("#titreMain").innerText = "Résolveur de sudoku";
    const tableau = Array.from({ length: 9 }, () => Array(9).fill("-"));
    afficherSudoku(tableau, "tableau", "resolution");

    document.addEventListener("keyup", (e) => {
        if (e.target.className == "inputCaseSudoku") {
            let l = Number(e.target.parentNode.dataset.l);
            let c = Number(e.target.parentNode.dataset.c);
            let futureCellule;
            if (e.key == "ArrowUp") {
                futureCellule = document.querySelector(`[data-l="${verificateurCoordonnees(l, "moins")}"][data-c="${c}"]`);
            } else if (e.key == "ArrowLeft") {
                futureCellule = document.querySelector(`[data-l="${l}"][data-c="${verificateurCoordonnees(c, "moins")}"]`);
            } else if (e.key == "ArrowRight") {
                futureCellule = document.querySelector(`[data-l="${l}"][data-c="${verificateurCoordonnees(c, "plus")}"]`);
            } else if (e.key == "ArrowDown") {
                futureCellule = document.querySelector(`[data-l="${verificateurCoordonnees(l, "plus")}"][data-c="${c}"]`);
            } else {
                return;
            }
            futureCellule = futureCellule.children[0];
            futureCellule.focus();
        }
    });
}

// Fonction qui gère la requete de récupération de la grille
async function generationSudoku() {
    const requete = await fetch("http://localhost:3000/generation-sudoku/easy");
    if (requete.ok) {
        const reponse = await requete.json();
        afficherSudoku(reponse);
        document.querySelector("#titreMain").innerText = "Sudoku - Facile";
    } else {
        alert("Erreur lors de la récupération du sudoku");
    }
}

// Fonction qui surveille le clique sur le bouton de génération du sudoku
function surveillanceCliqueBoutonGeneration() {
    document.querySelector("#boutonGeneration").addEventListener("click", generationSudoku);
}

// Gestion du reset de la page
document.querySelector("#titreNavbar").addEventListener("click", () => {
    document.querySelector("#titreMain").innerText = "Générateur de sudoku";
    document.querySelector("#divResultat").innerHTML = "";
    document.querySelector("#divBoutons").innerHTML = `<a id="boutonGeneration" class="bouton">Générer un sudoku</a>`;
    surveillanceCliqueBoutonGeneration();
});

// Gestion de la navigation pour navbar
document.querySelector("#lienGenerationSudoku").addEventListener("click", generationSudoku);
document.querySelector("#lienResolutionAutomatique").addEventListener("click", resolutionSudoku);

surveillanceCliqueBoutonGeneration(); // Lancement de la surveillance du bouton
