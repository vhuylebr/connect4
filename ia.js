function win(row, column, player, board) {
    // Horizontal
    let count = 0;
    let cols = board[0].length
    let rows = board.length
    for (let j = 0; j < cols; j++) {
        count = (board[row][j] == player) ? count + 1 : 0;
        if (count >= 4) return true;
    }
    // Vertical
    count = 0;
    for (let i = 0; i < rows; i++) {
        count = (board[i][column] == player) ? count + 1 : 0;
        if (count >= 4) return true;
    }
    // Diagonal
    count = 0;
    let shift = row - column;
    for (let i = Math.max(shift, 0); i < Math.min(rows, cols + shift); i++) {
        count = (board[i][i - shift] == player) ? count + 1 : 0;
        if (count >= 4) return true;
    }
    // Anti-diagonal
    count = 0;
    shift = row + column;
    for (let i = Math.max(shift - cols + 1, 0); i < Math.min(rows, shift + 1); i++) {
        count = (board[i][shift - i] == player) ? count + 1 : 0;
        if (count >= 4) return true;
    }

    return false;
}

class IA {
    tree = { weight: 0, leaves: {} }
    player = 0
    maxDepth = 8

    constructor(player) {
        this.player = player
    }

    clearGame() {

    }


    dispMap(map) {
        for (let i = 0 ; i < map.length + 2 ; i += 1)
            process.stdout.write("-")
        process.stdout.write("\n")
        for (let i = map.length - 1 ; i >= 0 ; i -= 1) {
            process.stdout.write("|")
            for (let j = 0 ; j < map[i].length ; j += 1) {
                if (map[i][j] == 1)
                    process.stdout.write("X")
                else if (map[i][j] == 2)
                    process.stdout.write("O")
                else
                    process.stdout.write(" ")
            }
            process.stdout.write("|\n")
        }
        for (let i = 0 ; i < map.length + 2 ; i += 1)
            process.stdout.write("-")
        process.stdout.write("\n")
    }


    initTree(tree, map, player) {
        tree.weight = 0
        tree.leaves = {}
        tree.player = player
        this.columns = map.length
        this.rows = map[0].length
        for (let i = 0; i < this.columns; i += 1) {
            if (map[this.rows - 1][i] == 0) {
                tree.leaves[i] = { weight: 0, leaves: {}, player: (player == 1 ? 2 : 1) }
            }
        }
    }

    getAvailRow(map, col) {
        if (map.length < col)
            return -1
        for (let i = 0; i < map[col].length; i += 1) {
            if (map[i][col] == 0)
                return i
        }
        return -1
    }

    alphaBeta(tree, alpha, beta) {
        let v = 0
        if (Object.keys(tree.leaves).length == 0)
            return tree.weight
        else if (tree.player != this.player) {
            v = Infinity
            for (let i = 0 ; i < Object.keys(tree.leaves).length ; i += 1) {
                v = Math.min(v, alphaBeta(tree.leaves[i], alpha, beta))
                tree.leaves[i].weight = v
                if (alpha >= v)
                    return v
                else
                    beta = Math.min(beta, v)

            }
        } else {
            v = -Infinity
            for (let i = 0 ; i < Object.keys(tree.leaves).length ; i += 1) {
                v = Math.max(v, alphaBeta(tree.leaves[i], alpha, beta))
                tree.leaves[i].weight = v
                if (v >= beta)
                    return v
                else
                    alpha = Math.max(alpha, v)

            }
        }
        return v
    }

    addDepth(tree, map, player, depth) {
        if (depth > this.maxDepth) {
            //console.log(tree)
            return
        }
        //this.dispMap(map)
        this.initTree(tree, map, player)
        //console.log("here", tree)
        for (let key = 0; key < Object.keys(tree.leaves).length ; key += 1) {
            let col = Object.keys(tree.leaves)[key]
            let row = this.getAvailRow(map, col)
            if (row != -1) {
                map[row][col] = player
                if (win(row, col, player, map) == false)
                    this.addDepth(tree.leaves[col], JSON.parse(JSON.stringify(map)), (player == 1 ? 2 : 1), depth + 1)
                else {
                    tree.leaves[col].weight = (player == this.player ? 1 : -1)
                    //this.dispMap(map)
                }
                map[row][col] = 0
            }
        }
    }

    play(map) {
        let tree = {}
        this.addDepth(tree, map, this.player, 0)
        this.alphaBeta(tree, -Infinity, +Infinity)
        let final = 0
        let max = 0
        for (let i = 0 ; Object.keys(tree.leaves) ; i += 1) {
            if (tree.leaves.weight > max) {
                max = tree.leaves.weight
                final = i
            }
        }
        return final
    }
}