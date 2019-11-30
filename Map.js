class Map {
    constructor(map, player, rows, columns) {
        this.map = map;
        this.player = player;
        this.moves = 0;
        this.columns = columns;
        this.rows = rows;
    }

    isFinished = (depth, weight) => {
        if (depth == 0 || weight == Infinity || weight == -Infinity || this.isFull()) {
            return true;
        }
        return false;
    }

    setCoin = (column) => {
        if (this.map[0][column] == null && column >= 0 && column < this.columns) {
            for (var y = this.rows - 1; y >= 0; y--) {
                if (this.map[y][column] == null) {
                    this.map[y][column] = this.player;
                    break;
                }
            }
            this.player = this.player == 1 ? 0 : 1;
            this.moves += 1;
            return true;
        } else {
            return false;
        }
    }
    getPositionWeight = (row, column, rowAdd, columnAdd) => {
        var weightPlayer1 = 0;
        var weightPlayer2 = 0;

        for (var i = 0; i < 4; i++) {
            if (this.map[row][column] == 0) {
                weightPlayer1++;
                if (weightPlayer1 == 4) {
                    return -Infinity;
                }
            } else if (this.map[row][column] == 1) {
                weightPlayer2++;
                if (weightPlayer2 == 4) {
                    return Infinity;
                }
            }
            row += rowAdd;
            column += columnAdd;
        }
        return weightPlayer2;
    }
    getMapWeight = () => {
        var weight = 0;
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                if (row < this.rows - 3) {
                    weight += this.getPositionWeight(row, column, 1, 0);
                }
                if (column < this.columns - 3) {
                    weight += this.getPositionWeight(row, column, 0, 1);
                    if (row > 2) {
                        weight += this.getPositionWeight(row, column, -1, +1);
                    }
                    if (row < this.rows - 3) {
                        weight += this.getPositionWeight(row, column, 1, 1);
                    }
                }
                if (weight > Infinity) return Infinity;
                if (weight < 0) return -Infinity;
            }
        }
        return weight;
    }

    isFull = () => {
        return this.moves == 42;
    }

    copy = () => {
        return new Map(JSON.parse(JSON.stringify(this.map)), this.player, this.rows, this.columns);
    }
    getArrayMap() {
        return this.map
    }
}