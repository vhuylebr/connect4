class Puissance4 {
    rows = 6;
    columns = 7;
    depth = 5;
    player = 0;
    constructor() {
        game_map = Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            game_map[i] = Array(this.cols).fill(null);
        }

        this.map = new Map(game_map, 0, this.rows, this.columns);

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

        if (this.player == 0) {
            this.setCoinRender(event.target.dataset.column);
            this.IAPlay();
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
                    let colour = map[y][j];
                    if (colour == 1)
                        td.className = 'player2';
                    if (colour == 0)
                        td.className = 'player1';
                    td.dataset.column = j;
                }
            }
            this.player = this.player == 1 ? 0 : 1;
            if (this.map.getMapWeight() == -Infinity) alert("joueur 1 à gagné");
            if (this.map.getMapWeight() == Infinity) alert("joueur 2 à gagné");
            if (this.map.isFull()) alert("égalité");
        }
    }

    isNotFinished = () => {
        return this.map.getMapWeight() != Infinity && this.map.getMapWeight() != -Infinity && !this.map.isFull()
    }

    IAPlay = () => {
        if (this.isNotFinished()) {
            var res = this.alphaBeta(this.map, this.depth, true);
            this.setCoinRender(res.column);
        }
    }

    alphaBeta = (map, depth, isMax, alpha, beta) => {
        var weight = map.getMapWeight();

        if (map.isFinished(depth, weight)) {
            return { column: null, depth, weight: weight };
        }

        if (isMax) {
            var max = { column: null, depth, weight: -Infinity };
            for (var column = 0; column < this.columns; column++) {
                var new_map = map.copy();
                if (new_map.setCoin(column)) {
                    var res = this.alphaBeta(new_map, depth - 1, false, alpha, beta);
                    if (max.column == null || res.weight > max.weight) {
                        max = { column, depth, weight: res.weight }
                        alpha = res.weight;
                    }
                    if (alpha >= beta) return max;
                }
            }
            return max;
        } else {
            var min = { column: null, depth, weight: Infinity };
            for (var column = 0; column < this.columns; column++) {
                var new_map = map.copy();
                if (new_map.setCoin(column)) {
                    var res = this.alphaBeta(new_map, depth - 1, true, alpha, beta);
                    if (min.column == null || res.weight < min.weight) {
                        min = { column, depth, weight: res.weight }
                        beta = res.weight;
                    }
                    if (alpha >= beta) return min;
                }
            }
            return min;
        }
    }
}