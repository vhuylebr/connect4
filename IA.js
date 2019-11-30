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
            //console.log("enter")
            for (var column = 0; column < this.columns; column++) {
                var new_map = map.copy();
                //console.log(column)
                //console.log("coming through")
                if (new_map.setCoin(column)) {
                    var res = this.alphaBeta(new_map, depth - 1, false, alpha, beta);
                    if (max.column == null || res.weight > max.weight) {
                        max = { column, depth, weight: res.weight }
                        alpha = res.weight;
                    }
                    if (alpha >= beta) {
                        //console.log("A")
                        return max;
                    }
                } else {
                    console.log("did not enter for ", column)
                    
                }
            }
            //console.log("B")
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
                        //console.log("C");
                        return min
                    };
                }
            }
            //console.log("D")
            return min;
        }
    }

    play(map) {
        let mapObj = new Map(map, this.player, this.rows, this.columns)
        let res = this.alphaBeta(mapObj, 5, true)
        return res.column
    }
}