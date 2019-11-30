class Puissance4 {
    rows = 6;
    columns = 7;
    depth = 5;
    player = 1;
    constructor() {
        game_map = Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            game_map[i] = Array(this.cols).fill(0);
        }
        this.ia = new IA(this.rows, this.columns)
        this.map = new Map(game_map, 1, this.rows, this.columns);

        var game_map = document.getElementById('map');
        for (var i = 0; i < this.rows; i++) {
            let tr = game_map.appendChild(document.createElement('tr'));
            for (var j = 0; j < this.columns; j++) {
                let td = tr.appendChild(document.createElement('td'));
                td.className = 'empty';
                td.dataset.column = j;
            }
        }
        game_map.addEventListener('click', event => this.handleClic(event))
    }

    handleClic = (event) => {

        if (this.player == 1) {
            this.setCoinRender(event.target.dataset.column);
            if (this.isNotFinished()) {
                var res = this.ia.alphaBeta(this.map, this.depth, true);
                this.setCoinRender(res.column);
            }

        }
    }

    setCoinRender = (column) => {
        let table = document.getElementById('map')
        if (this.isNotFinished()) {

            if (!this.map.setCoin(column)) {
                return alert("La colonne est pleine");
            }
            table.innerHTML = ''
            let map = this.map.getArrayMap()
            for (var y = 0; y < this.rows; y++) {
                let tr = table.appendChild(document.createElement('tr'));
                for (var j = 0; j < this.columns; j++) {
                    let td = tr.appendChild(document.createElement('td'));
                    let player = map[y][j];
                    if (player == 2)
                        td.className = 'player2';
                    if (player == 1)
                        td.className = 'player1';
                    td.dataset.column = j;
                }
            }
            this.player = this.player == 1 ? 2 : 1;
            if (this.map.getMapWeight() == -Infinity) alert("joueur 1 à gagné");
            if (this.map.getMapWeight() == Infinity) alert("joueur 2 à gagné");
            if (this.map.isFull()) alert("égalité");
        }
    }

    isNotFinished = () => {
        return this.map.getMapWeight() != Infinity && this.map.getMapWeight() != -Infinity && !this.map.isFull()
    }

}