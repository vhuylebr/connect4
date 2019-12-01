class IA {
    player = 0

    constructor(rows, columns) {
        this.rows = rows
        this.columns = columns
    }

    setPlayer(p) {
        this.player = p
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
                    if (alpha >= beta)
                        return max;
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
                    if (alpha >= beta) {
                        return min
                    };
                }
            }
            return min;
        }
    }

    play(map) {
        let mapObj = new Map(map, this.player, this.rows, this.columns, this.player)
        let res = this.alphaBeta(mapObj, 5, true)
        return res.column
    }
}