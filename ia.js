class IA {
    tree = { weight: 0, leaves: {} }
    player = 0
    maxDepth = 10

    constructor(player) {
        this.player = player
    }

    clearGame() {

    }

    initTree(tree, map) {
        tree = { wieght: 0, leaves: {} }
        this.columns = map.length
        this.rows = map[0].length
        for (let i = 0; i < this.columns; i += 1) {
            if (map[this.rows - 1][i] == 0) {
                tree.leaves[i] = { weight: 0, leaves: {} }
            }
        }
    }

    getAvailRow(map, col) {
        if (map.length < col)
            return -1
        for (let i = map[col].length; i >= 0; i += 1) {
            if (map[i][col] == 0)
                return i
        }
        return -1
    }

    addDepth(tree, map, player, depth) {
        if (depth == this.maxDepth) {
            console.log(tree)
            return
        }
        initTree(tree, map)
        for (let key = 0; key < Object.keys(tree.leaves); key += 1) {
            let col = Object.keys(tree.leaves)[key]
            let row = getAvailRow(map, col)
            if (row != -1) {
                map[row][col] = player
                if (Puissance4.win(row, col, player, map) == false)
                    addDepth(tree.leaves[col], JSON.parse(JSON.stringify(map)), player, depth + 1)
                map[row][col] = 0
            }
        }
    }

    play(map) {

    }
}