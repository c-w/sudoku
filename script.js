function shuffle(_array) {
    const array = [..._array];
    for (let i = array.length - 1; i >= 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function replaceAt(_array, indices, value) {
    const array = [..._array];
    for (const i of indices) {
        array[i] = value(i);
    }
    return array;
}

function renderSudoku(values) {
    const size = Math.sqrt(values.length);
    const table = document.createElement("table");
    for (let i = 0; i < size; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < size; j++) {
            const td = document.createElement("td");
            const value = values[i * size + j];
            td.innerText = value.value;
            if (value.hidden) {
                td.classList.add("hidden");
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.body.appendChild(table);
}

async function main(pl, config) {
    const { numBlanks, numToShow } = config;
    const generatorSession = pl.create();
    const checkerSession = pl.create();
    const initialization = shuffle(["R1C1", "R1C2", "R1C3", "R1C4", "R2C1", "R2C2", "R2C3", "R2C4", "R3C1", "R3C2", "R3C3", "R3C4", "R4C1", "R4C2", "R4C3", "R4C4"]);
    await generatorSession.promiseConsult("./sudoku.pl");
    await checkerSession.promiseConsult("./sudoku.pl");
    await generatorSession.promiseQuery(`is_valid_sudoku(${initialization.join(", ")}).`);
    const shown = [];
    for await (const validSudoku of generatorSession.promiseAnswers()) {
        const values = Object.values(validSudoku.links).map((it) => String(it.value));
        const mask = shuffle(values.map((_, i) => i)).slice(0, numBlanks);
        const maskedSudoku = replaceAt(values, mask, (i) => `Blank${i}`);
        const solutions = [];
        await checkerSession.promiseQuery(`is_valid_sudoku(${maskedSudoku.join(", ")}).`);
        for await (const solution of checkerSession.promiseAnswers()) {
            solutions.push(solution);
            if (solutions.length >= 2) {
                break;
            }
        }
        if (solutions.length === 1) {
            const solution = values.map((value, i) => ({ value, hidden: mask.includes(i) }));
            shown.push(solution);
            renderSudoku(solution);
            if (shown.length >= numToShow) {
                break;
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const numBlanks = Number(params.get("blanks") || "8");
    const numToShow = Number(params.get("amount") || "2");
    main(window.pl, { numBlanks, numToShow });
});
