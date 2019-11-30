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

class RandomAI {

	setPlayer(){}

	play(map) {
		let columns = map.length
		let choices = []
		for (let i = 0; i < columns; i += 1) {
			if (map[0][i] == 0) {
				choices.push(i)
			}
		}
		let res = choices[Math.round((Math.random() * 100)) % choices.length]
		console.log("Random plays on ", res)
		return res
	}
}

class Test {

	getAvailRow(map, col) {
		if (map[0].length < col)
		    return -1
		for (let i = 6 ; i >= 0 ; i -= 1) {
		    if (map[i][col] == 0) {
			return i
		    }
		}
		return -1
	    }

	game(player1, player2) {
		let map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],

		]
		player1.setPlayer(1)
		player2.setPlayer(2)
		let actPlayer = 1
		let col = player1.play(map)
		let lastMove = {row: this.getAvailRow(map, col), col}
		map[lastMove.row][lastMove.col] = actPlayer
		let i
		for (i = 0 ; i < 100 && !win(lastMove.row, lastMove.col, actPlayer, map) ; i += 1) {
			actPlayer = actPlayer == 1 ? 2 : 1
			if (actPlayer == 1)
				col = player1.play(map)
			else
				col = player2.play(map)
			lastMove = {row: this.getAvailRow(map, col), col}
			map[lastMove.row][lastMove.col] = actPlayer
			for (let i = 0 ; i < 7 ; i += 1) {
				console.log(map[i])
			}
			console.log("")
		}
		let res = {
			result: i == 100 ? 0 : actPlayer,
			rounds: i,
		}
		for (let i = 0 ; i < 7 ; i += 1) {
			console.log(map[i])
		}
		console.log("sqd")
		return (res)
	}

	gameTest() {
		let report = "### Duel tests\n\n"
		let random = new RandomAI()
		let ia = new IA(7, 7)
		ia.setPlayer(1)
		random.setPlayer(2)
		let totalVictories = 0
		let totalTimeouts = 0

		// AI vs Random
		report += "1) AI vs Random\n\n"
		let victories = 0
		let timeouts = 0
		for (let i = 0 ; i < 5 ; i += 1) {
			console.log("new game")
			let res = this.game(ia, random)
			report += "# Match n°" + (i + 1) + "/5 ended in " + res.rounds + " rounds :\n"
			report += "=> " + (res.result == 0 ? "Timeout" : "Player " + (res.result == 1 ? "AI" : "Random") + " wins !") + "\n\n"
			if (res.result == 1)
				victories += 1
			else if (res.result == 0)
				timeouts += 1
		}
		report += "### Total : " + victories + "/5 (" + timeouts + " timeouts) ###\n\n"
		totalTimeouts += timeouts
		totalVictories += victories

		ia.setPlayer(2)
		random.setPlayer(1)
		// Random vs AI
		report += "2) Random vs AI\n\n"
		victories = 0
		timeouts = 0
		for (let i = 0 ; i < 5 ; i += 1) {
			let res = this.game(random, ia)
			report += "# Match n°" + (i + 1) + "/5 ended in " + res.rounds + " rounds :\n"
			report += "=> " + (res.result == 0 ? "Timeout" : "Player " + (res.result == 2 ? "AI" : "Random") + " wins !") + "\n\n"
			if (res.result == 2)
				victories += 1
			else if (res.result == 0)
				timeouts += 1
		}
		report += "### Total : " + victories + "/5 (" + timeouts + " timeouts) ###\n\n"
		totalTimeouts += timeouts
		totalVictories += victories


		// AI vs AI
		victories = 0
		timeouts = 0
		let ai2 = new IA(7, 7)
		ia.setPlayer(1)
		ai2.setPlayer(2)
		report += "3) AI vs AI\n\n"
		for (let i = 0 ; i < 5 ; i += 1) {
			let res = this.game(ia, ai2)
			report += "# Match n°" + (i + 1) + "/5 ended in " + res.rounds + " rounds :\n"
			report += "=> " + (res.result == 0 ? "Timeout" : "Player " + res.result + " wins !") + "\n\n"
			if (res.result == 2)
				victories += 1
			else if (res.result == 0)
				timeouts += 1
		}
		report += "### Total : " + victories + "/5 (" + timeouts + " timeouts) ###\n\n"
		totalTimeouts += timeouts
		totalVictories += victories

		report += "==> Final grade : " + (totalVictories / 15 * 100) + " %\n"
		report += totalVictories + " / 15 victories with " + totalTimeouts + " timeouts\n"

		return report
	}

	testCase(map, ia, answer, res) {
		let col = ia.play(map)
		res.testNb += 1
		res.report += "# Test " + res.testNb + " : " + (col == answer && ++res.win ? "OK" : "KO") + "\n\n"
	}

	caseTests() {
		let ia = new IA(7, 7)
		ia.setPlayer(1)
		let res = { report: "### Case tests\n\n", win: 0, testNb: 0 }
		res.report += "1) Imminent defeat detection\n\n"
		let map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,1,1,0,0,0],
			[0,1,2,2,2,0,0]
		]
		this.testCase(map, ia, 5, res)
		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,1,2,0,0,0,0],
			[0,1,1,2,0,0,0],
			[2,2,1,1,2,0,0]
		]
		this.testCase(map, ia, 1, res)
		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,1,2,0,0,0],
			[0,0,1,2,1,0,0],
			[2,0,2,2,1,0,0]
		]
		this.testCase(map, ia, 3, res)
		res.testNb = 0

		res.report += "2) Imminent victory detection\n\n"

		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,2,2,0,0,0],
			[0,2,1,1,1,0,0]
		]
		this.testCase(map, ia, 5, res)

		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,2,1,0,0,0,0],
			[0,2,2,1,0,0,0],
			[1,1,2,2,1,0,0]
		]

		this.testCase(map, ia, 1, res)

		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,2,1,0,0,0],
			[0,0,2,1,2,0,0],
			[1,0,1,1,2,0,0]
		]

		this.testCase(map, ia, 3, res)

		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[2,0,0,0,0,0,0],
			[1,0,2,0,0,0,0],
			[2,0,2,2,0,0,0],
			[1,1,2,1,2,0,1],
			[2,2,1,1,1,0,1]
		]

		this.testCase(map, ia, 5, res)

		map = [
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0],
			[0,0,1,2,0,0,0],
			[0,0,1,2,0,0,0],
			[0,0,1,2,0,0,0]
		]

		this.testCase(map, ia, 2, res)

		res.report += "==> Final grade : " + (res.win / 8 * 100) + " %\n"
		res.report += res.win + " / 8 OK\n"
		return (res.report)
	}

	test() {
		let report = `
###############################################
#                                             #
#      Test results for the connect 4 AI      #
#                                             #
###############################################

`
		report += this.gameTest()
		//report += this.caseTests()
		console.log(report)
	}

	abc() {
		let random = new RandomAI()
		let ia = new IA(7, 7)
		ia.setPlayer(1)
		random.setPlayer(2)
		let res = this.game(ia, random)
		console.log("winner is " , res)
	}
}