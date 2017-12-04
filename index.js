console.log(11)

function* gen(argument) {
	yield 1
	yield 2
}

let g = gen()

g.next()