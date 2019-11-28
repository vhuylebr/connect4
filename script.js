class Puissance4 {
    /*
      Intialise un plateau de jeu de dimensions `rows` × `cols` (par défaut 6×7),
      et fait l'affichage dans l'élément `element_id` du DOM.
     */
    constructor(element_id) {
        // un entier: 1 ou 2 (le numéro du prochain joueur)
        this.turn = 1;
        // Nombre de coups joués
        this.moves = 0;
        /* un entier indiquant le gagnant:
            null: la partie continue
               0: la partie est nulle
               1: joueur 1 a gagné
               2: joueur 2 a gagné
        */
        this.winner = null;
        this.element_id = element_id;
        this.element = document.querySelector(this.element_id);
    }

    /* Affiche le plateau de jeu dans le DOM */
    render() {
        let table = document.createElement('table');
        for (let i = this.rows - 1; i >= 0; i--) {
            let tr = table.appendChild(document.createElement('tr'));
            for (let j = 0; j < this.cols; j++) {
                let td = tr.appendChild(document.createElement('td'));
                let colour = this.board[i][j];
                if (colour)
                    td.className = 'player' + colour;
                td.dataset.column = j;
            }
        }
        this.element.innerHTML = '';
        this.element.appendChild(table);
    }

    set(row, column, player) {
        // On colore la case
        this.board[row][column] = player;
        // On compte le coup
        this.moves++;
    }

    /* Cette fonction ajoute un pion dans une colonne */
    play(column) {
        // Trouver la première case libre dans la colonne
        let row;
        for (let i = 0; i < this.rows; i++) {
            if (this.board[i][column] == 0) {
                row = i;
                break;
            }
        }
        if (row === undefined) {
            return null;
        } else {
            // Effectuer le coup
            this.set(row, column, this.turn);
            // Renvoyer la ligne où on a joué
            return row;
        }
    }

    handle_after_play(column) {
        if (this.winner !== null) {
            if (window.confirm("Game over!\n\nDo you want to restart?")) {
                this.reset();
                this.render();
            }
            return;
        }

        if (column !== undefined) {
            //attention, les variables dans les datasets sont TOUJOURS 
            //des chaînes de caractères. Si on veut être sûr de ne pas faire de bêtise,
            //il vaut mieux la convertir en entier avec parseInt
            column = parseInt(column);
            let row = this.play(parseInt(column));

            if (row === null) {
                window.alert("Column is full!");
            } else {
                // Vérifier s'il y a un gagnant, ou si la partie est finie
                if (this.win(row, column, this.turn)) {
                    this.winner = this.turn;
                } else if (this.moves >= this.rows * this.columns) {
                    this.winner = 0;
                }
                // Passer le tour : 3 - 2 = 1, 3 - 1 = 2
                this.turn = 3 - this.turn;

                // Mettre à jour l'affichage
                this.render()
                switch (this.winner) {
                    case 0:
                        setTimeout(() => window.alert("Null game!!"), 1);
                        break;
                    case 1:
                        setTimeout(() => window.alert("Player 1 wins"), 1);
                        break;
                    case 2:
                        setTimeout(() => window.alert("Player 2 wins"), 1);
                        break;
                }
            }
        }
    }
    handle_click(event) {
        // Vérifier si la partie est encore en cours
        this.handle_after_play(event.target.dataset.column);
        this.playIA()
    }

    playIA() {
        console.log("Mettre l'algorithme ICI")
        let column = 3;
        this.handle_after_play(column)
    }
    start(rows, cols, player1, beginner) {
            this.rows = rows;
            this.cols = cols;
            this.beginner = beginner;
            this.player1 = player1;
            // cet tableau à deux dimensions contient l'état du jeu:
            //   0: case vide
            //   1: pion du joueur 1
            //   2: pion du joueur 2
            this.board = Array(this.rows);
            for (let i = 0; i < this.rows; i++) {
                this.board[i] = Array(this.cols).fill(0);
            }
            if (this.player1 === "human") {
                this.element.addEventListener('click', (event) => this.handle_click(event));
                if (this.beginner === "player2") {
                    // IA turn
                    this.playIA()
                }
            }
        }
        /* 
     Cette fonction vérifie si le coup dans la case `row`, `column` par
     le joueur `player` est un coup gagnant.
     
     Renvoie :
       true  : si la partie est gagnée par le joueur `player`
       false : si la partie continue
   */
    win(row, column, player) {
        // Horizontal
        let count = 0;
        for (let j = 0; j < this.cols; j++) {
            count = (this.board[row][j] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        // Vertical
        count = 0;
        for (let i = 0; i < this.rows; i++) {
            count = (this.board[i][column] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        // Diagonal
        count = 0;
        let shift = row - column;
        for (let i = Math.max(shift, 0); i < Math.min(this.rows, this.cols + shift); i++) {
            count = (this.board[i][i - shift] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }
        // Anti-diagonal
        count = 0;
        shift = row + column;
        for (let i = Math.max(shift - this.cols + 1, 0); i < Math.min(this.rows, shift + 1); i++) {
            count = (this.board[i][shift - i] == player) ? count + 1 : 0;
            if (count >= 4) return true;
        }

        return false;
    }

    // Cette fonction vide le plateau et remet à zéro l'état
    reset() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0;
            }
        }
        this.move = 0;
        this.turn = 1;
        this.winner = null;
    }
}