const PRELOADED_LEVELS = {
    // Columns; Rows; Treasure R,C; Monster R,C
    "1-1": "14270444 32534144 51 2217375777",
    "1-2": "62415445 44443426 21 0641577074",
    "1-3": "42506242 52215325 26 2260737577",
    "1-4": "62434426 62532526 - 0204305027477375",
    "1-5": "24432342 07242270 - 00700777212756",
    "1-6": "23344346 23541455 45 004070731517",
    "1-7": "41343326 31266143 2164 050736415072",
    "1-8": "15143543 13360634 22 06606475",
    "2-1": "06153236 63136160 25 00025777",
    "2-2": "42652445 43534427 65 1127606271",
    "2-3": "13244322 21445140 1562 46",
    "2-4": "66223731 64344441 23 062646416054",
    "2-5": "61227414 44434314 12 063035376072",
    "2-6": "15250425 23434332 14 10524777",
    "2-7": "64144423 34264414 02 052544707577",
    "2-8": "22164222 22157022 11611666 -",
    "3-1": "33336325 52146415 1225 5254717375",
    "3-2": "53137214 22161626 1216 616365677276",
    "3-3": "44262347 73417163 21 05507277",
    "3-4": "54616353 56432355 - 020410252761637577",
    "3-5": "44136341 60415334 62 0007304777",
    "3-6": "53435131 52236061 1315 477173",
    "3-7": "22162134 22255212 116025 47",
    "3-8": "64523617 44464453 - 0611274146606672",
    "4-1": "22337132 33516122 6265 23",
    "4-2": "15346240 06235225 66 616335",
    "4-3": "54164131 52226143 3065 14375173",
    "4-4": "14313341 14323241 33 155177",
    "4-5": "14151326 23437040 15 105777",
    "4-6": "22626244 55152235 57 0105132773",
    "4-7": "33633327 54173442 16 11466770",
    "4-8": "52245413 12452336 1042 073757776534",
    "5-1": "32454341 52416242 10 1434",
    "5-2": "15313531 06232531 32 65",
    "5-3": "42423426 36054063 - 01062744577176",
    "5-4": "15226141 14262331 67 032037",
    "5-5": "53246415 63335343 22 052545173757",
    "5-6": "65464531 64162366 - 06101214516476",
    "5-7": "41452743 62333445 22 0407707367",
    "5-8": "35344253 44246234 - 00040620403757777175",
    "6-1": "41473145 44443253 25 0170727577",
    "6-2": "45444525 56261535 - 05071150727477",
    "6-3": "14145233 34331513 45 0106437477",
    "6-4": "23153135 53325041 25 -",
    "6-5": "15323424 15322722 32 17376377",
    "6-6": "56325535 52742446 - 1117323537406673",
    "6-7": "53333514 52215363 21 475154717476",
    "6-8": "15333522 51523260 33 -",
    "7-1": "44426234 56141534 35 051040706776",
    "7-2": "54242453 64142462 - 01307051357567",
    "7-3": "35362342 52623163 - 00700777",
    "7-4": "22616321 22343531 15 44",
    "7-5": "53424425 41524526 - 05173757617375",
    "7-6": "34444523 52623515 - 01071432727476",
    "7-7": "22163331 23425122 2150 157477",
    "7-8": "52125423 51416232 63 173722",
    "8-1": "23146141 33145222 1275 0507374070",
    "8-2": "24252535 34363135 52 0520364767",
    "8-3": "25233343 42514342 - 0003071530606775",
    "8-4": "26455341 33447324 - 22522555",
    "8-5": "54424324 52227145 35 20606257",
    "8-6": "53164335 14245635 21 07274161",
    "8-7": "65343132 33516135 66 010507316062",
    "8-8": "13624234 14324533 - 75"
}

const OFFSETS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const MAX_ITERATIONS = 500;

const TREASURE = "💎";
const MONSTER = "💀";
const EMPTY = "⬛";
const WALL = "🟫";
const FLOOR = "◻️";

const game = document.getElementById("game");
const levelSelect = document.getElementById("level_select");
const statusBar = document.getElementById("status");
const seedField = document.getElementById("random_seed");

const randint = (low, high) => Math.floor(
    myRandom() * (high - low + 1)
) + low;
const choice = arr => arr[randint(0, arr.length - 1)];

let currentLevelData;
let myRandom;

function setTableCell(data, pos) {
    game.firstChild.children[pos[0]].children[pos[1]].innerHTML = data;
}

function setBadFlag(pos, flag) {
    let cell = game.firstChild.children[pos[0]].children[pos[1]];
    if (flag) cell.classList.add("bad");
    else cell.classList.remove("bad");
}

function nodeIndex(node) {
    return [...node.parentNode.childNodes].indexOf(node);
}

function setStatus(status) {
    statusBar.innerHTML = status;
    statusBar.removeAttribute("class");
    statusBar.classList.add(status.replaceAll(" ", "_"));
}

function startFromLevelSelect() {
    let selectedLevel = levelSelect.value;
    let levelString = PRELOADED_LEVELS[selectedLevel];
    let levelData = levelStringToData(levelString);
    startLevel(levelData);
}

function startRandom() {
    let seed = seedField.value;
    if (seed === "")
        seed = seedField.value = (Math.random().toString())
            .slice(2);
    myRandom = new Math.seedrandom(seed);
    let grid = new Array(8).fill(null).map(x =>
        new Array(8).fill(EMPTY)
    );
    let trcRow = randint(1, 6);
    let trcCol = randint(1, 6);
    for (let roff = -2; roff < 3; roff++) {
        for (let coff = -2; coff < 3; coff++) {
            let pr = trcRow + roff;
            let pc = trcCol + coff;
            if (pr < 0 || pr > 7 || pc < 0 || pc > 7)
                continue;
            let onRowEdge = Math.abs(roff) === 2;
            let onColEdge = Math.abs(coff) === 2;
            if (onRowEdge && onColEdge)
                continue;
            grid[pr][pc] =
                (!onRowEdge && !onColEdge) ? FLOOR : WALL;
        }
    }
    if (trcRow === 2 && trcCol === 2)
        grid[0][0] = WALL;
    if (trcRow === 2 && trcCol === 5)
        grid[0][7] = WALL;
    if (trcRow === 5 && trcCol === 2)
        grid[7][0] = WALL;
    if (trcRow === 5 && trcCol === 5)
        grid[7][7] = WALL;
    let atTop = trcRow <= 2;
    let atBottom = trcRow >= 5;
    let atLeft = trcCol <= 2;
    let atRight = trcCol >= 5;
    let allowedExits = [
        [-2, -1], [-2,  0], [-2,  1],
        [-1, -2], [ 0, -2], [ 1, -2],
        [ 2, -1], [ 2,  0], [ 2,  1],
        [-1,  2], [ 0,  2], [ 1,  2]
    ];
    const remove = x => {
        allowedExits = allowedExits.filter(y =>
            `${y[0]},${y[1]}` !== `${x[0]},${x[1]}`
        );
    };
    if (atTop)
        remove([-2,  0]);
    if (atBottom)
        remove([ 2,  0]);
    if (atLeft)
        remove([ 0, -2]);
    if (atRight)
        remove([ 0,  2]);
    if (trcRow === 1) {
        remove([-2, -1]);
        remove([-2,  1]);
    }
    if (trcRow === 6) {
        remove([ 2, -1]);
        remove([ 2,  1]);
    }
    if (trcCol === 1) {
        remove([-1, -2]);
        remove([ 1, -2]);
    }
    if (trcCol === 6) {
        remove([-1,  2]);
        remove([ 1,  2]);
    }
    if (atTop && atLeft) {
        remove([-2, -1]);
        remove([-1, -2]);
    }
    if (atTop && atRight) {
        remove([-2,  1]);
        remove([-1,  2]);
    }
    if (atBottom && atLeft) {
        remove([ 2, -1]);
        remove([ 1, -2]);
    }
    if (atBottom && atRight) {
        remove([ 2,  1]);
        remove([ 1,  2]);
    }
    let [er, ec] = choice(allowedExits);
    grid[trcRow + er][trcCol + ec] = FLOOR;
    let iterations = 0;
    while (grid.some(row => row.includes(EMPTY))) {
        if (iterations > MAX_ITERATIONS) break;
        let changed = false;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (grid[r][c] !== EMPTY) continue;
                for (let roff of [-1, 1]) {
                    for (let coff of [-1, 1]) {
                        let cr = r + roff;
                        let cc = c + coff;
                        let square = new Set([
                            (grid[cr] ?? [])[cc],
                            (grid[cr] ?? [])[c],
                            grid[r][cc]
                        ]);
                        if (square.has(FLOOR) &&
                            square.size === 1) {
                            grid[r][c] = WALL;
                            changed = true;
                        }
                    }
                }
            }
        }
        if (!changed) {
            let unfinished = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (grid[r][c] !== FLOOR) continue;
                    for (let [roff, coff] of OFFSETS) {
                        if (
                            (grid[r + roff] ?? [])
                            [c + coff] === EMPTY
                        ) unfinished.push(
                            [r + roff, c + coff]
                        );
                    }
                }
            }
            if (!unfinished.length) {
                iterations++;
                continue;
            }
            let [sr, sc] = choice(unfinished);
            grid[sr][sc] = FLOOR;
        }
    }
    grid = grid.map(
        row => row.map(x => x === EMPTY ? WALL : x)
    );
    let rows = grid.map(
        row => row.filter(x => x === WALL).length
    );
    let cols = [];
    for (let c = 0; c < 8; c++) {
        cols.push(grid.map(row => row[c])
                      .filter(x => x === WALL).length);
    }
    let treasures = [[trcRow + randint(-1, 1),
                      trcCol + randint(-1, 1)]];
    let monsters = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (grid[r][c] !== FLOOR) continue;
            let wallCount = 0;
            for (let [roff, coff] of OFFSETS) {
                let tile = (grid[r + roff] ?? [])[c + coff];
                if ([WALL, undefined].includes(tile))
                    wallCount++;
            }
            if (wallCount === 3)
                monsters.push([r, c]);
        }
    }
    let levelData = {cols, rows, treasures, monsters};
    startLevel(levelData);
}

function levelStringToData(levelString) {
    let [colData, rowData, treasureData, monsterData] =
        levelString.split(" ");
    let cols = [...colData].map(x => parseInt(x));
    let rows = [...rowData].map(x => parseInt(x));
    let treasures = [];
    if (treasureData.length > 1) {
        for (let i = 0; i < treasureData.length; i += 2)
            treasures.push([parseInt(treasureData[i]),
                            parseInt(treasureData[i+1])]);
    }
    let monsters = [];
    if (monsterData.length > 1) {
        for (let i = 0; i < monsterData.length; i += 2)
            monsters.push([parseInt(monsterData[i]),
                           parseInt(monsterData[i+1])]);
    }
    return {cols, rows, treasures, monsters};
}

function startLevel(levelData) {
    setStatus("Unsolved");
    while (game.firstChild)
        game.removeChild(game.firstChild);
    let table = document.createElement("table");
    for (let row = 0; row < 9; row++) {
        let tr = document.createElement("tr");
        for (let col = 0; col < 9; col++) {
            let cell = document.createElement("td");
            if (row !== 0 && col !== 0) {
                cell.addEventListener("click", handleClick(false));
                cell.addEventListener("contextmenu", handleClick(true));
                cell.addEventListener("mousedown", (event) => {
                    if (event.detail > 1)
                        event.preventDefault();
                });
            }
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    game.appendChild(table);
    for (let i = 0; i < 8; i++) {
        setTableCell(levelData.cols[i], [0, i + 1]);
        if (levelData.cols[i] !== 0)
            setBadFlag([0, i + 1], true);
        setTableCell(levelData.rows[i], [i + 1, 0]);
        if (levelData.rows[i] !== 0)
            setBadFlag([i + 1, 0], true);
    }
    for (let row = 1; row < 9; row++) {
        for (let col = 1; col < 9; col++)
            setTableCell(EMPTY, [row, col]);
    }
    for (let treasure of levelData.treasures) {
        setTableCell(TREASURE, treasure.map(x => x + 1));
        setBadFlag(treasure.map(x => x + 1), true);
    }
    for (let monster of levelData.monsters) {
        setTableCell(MONSTER, monster.map(x => x + 1));
        setBadFlag(monster.map(x => x + 1), true);
    }
    currentLevelData = levelData;
    currentLevelData.placed = [];
    for (let row = 0; row < 8; row++) {
        let placedRow = [];
        for (let col = 0; col < 8; col++) {
            let placed = EMPTY;
            if (levelData.treasures.map(x => `${x[0]},${x[1]}`)
                                   .includes(`${row},${col}`))
                placed = TREASURE;
            if (levelData.monsters.map(x => `${x[0]},${x[1]}`)
                                  .includes(`${row},${col}`))
                placed = MONSTER;
            placedRow.push(placed);
        }
        currentLevelData.placed.push(placedRow);
    }
}

function handleClick(isRightClick) {
    return function (event) {
        setStatus("Unsolved");
        let thisCell = event.currentTarget;
        let col = nodeIndex(thisCell) - 1;
        let row = nodeIndex(thisCell.parentNode) - 1;
        event.preventDefault();
        let oldPlaced = currentLevelData.placed[row][col];
        if (oldPlaced === MONSTER || oldPlaced === TREASURE) return;
        let newPlaced = EMPTY;
        if (oldPlaced === FLOOR) newPlaced = EMPTY;
        if (oldPlaced === WALL) newPlaced = FLOOR;
        if (oldPlaced === EMPTY) newPlaced = WALL;
        currentLevelData.placed[row][col] = newPlaced;
        setTableCell(newPlaced, [row + 1, col + 1]);
        let rowCount = currentLevelData.placed[row]
                            .filter(x => x === WALL).length;
        setBadFlag([row + 1, 0], rowCount !== currentLevelData.rows[row]);
        let colCount = currentLevelData.placed.map(x => x[col])
                            .filter(x => x === WALL).length;
        setBadFlag([0, col + 1], colCount !== currentLevelData.cols[col]);
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++)
                setBadFlag([r + 1, c + 1], false);
        }
        let badTiles = new Array(8).fill(null).map(
            x => new Array(8).fill(false)
        );
        let foundTreasureRooms = [];
        for (let treasure of currentLevelData.treasures) {
            let [tr, tc] = treasure;
            let foundRoom = null;
            for (let roff = 0; roff < 3; roff++) {
                for (let coff = 0; coff < 3; coff++) {
                    let r = tr + roff - 2;
                    let c = tc + coff - 2;
                    let ptrContents = [
                        (currentLevelData.placed[r] ?? [])[c],
                        (currentLevelData.placed[r] ?? [])[c + 1],
                        (currentLevelData.placed[r] ?? [])[c + 2],
                        (currentLevelData.placed[r + 1] ?? [])[c],
                        (currentLevelData.placed[r + 1] ?? [])[c + 1],
                        (currentLevelData.placed[r + 1] ?? [])[c + 2],
                        (currentLevelData.placed[r + 2] ?? [])[c],
                        (currentLevelData.placed[r + 2] ?? [])[c + 1],
                        (currentLevelData.placed[r + 2] ?? [])[c + 2]
                    ];
                    if (!ptrContents.every(
                        x => [TREASURE, FLOOR].includes(x)
                    )) continue;
                    foundRoom = [roff, coff];
                }
            }
            if (foundRoom === null) {
                badTiles[tr][tc] = true;
            } else {
                foundTreasureRooms.push([
                    [tr + foundRoom[0] - 2, tc + foundRoom[1] - 2],
                    [tr + foundRoom[0] - 2, tc + foundRoom[1] - 1],
                    [tr + foundRoom[0] - 2, tc + foundRoom[1]],
                    [tr + foundRoom[0] - 1, tc + foundRoom[1] - 2],
                    [tr + foundRoom[0] - 1, tc + foundRoom[1] - 1],
                    [tr + foundRoom[0] - 1, tc + foundRoom[1]],
                    [tr + foundRoom[0], tc + foundRoom[1] - 2],
                    [tr + foundRoom[0], tc + foundRoom[1] - 1],
                    [tr + foundRoom[0], tc + foundRoom[1]]
                ]);
                let top = tr + foundRoom[0] - 2;
                let left = tc + foundRoom[1] - 2;
                let nextToTR = [
                    (currentLevelData.placed[top - 1] ?? [])[left],
                    (currentLevelData.placed[top - 1] ?? [])[left + 1],
                    (currentLevelData.placed[top - 1] ?? [])[left + 2],
                    (currentLevelData.placed[top] ?? [])[left - 1],
                    (currentLevelData.placed[top + 1] ?? [])[left - 1],
                    (currentLevelData.placed[top + 2] ?? [])[left - 1],
                    (currentLevelData.placed[top] ?? [])[left + 3],
                    (currentLevelData.placed[top + 1] ?? [])[left + 3],
                    (currentLevelData.placed[top + 2] ?? [])[left + 3],
                    (currentLevelData.placed[top + 3] ?? [])[left],
                    (currentLevelData.placed[top + 3] ?? [])[left + 1],
                    (currentLevelData.placed[top + 3] ?? [])[left + 2]
                ];
                if (nextToTR.filter(x => x === FLOOR).length !== 1)
                    badTiles[tr][tc] = true;
            }
        }
        let maybeSafe = foundTreasureRooms.flat().map(x => `${x[0]},${x[1]}`);
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                let square = [
                    currentLevelData.placed[r][c],
                    currentLevelData.placed[r][c + 1],
                    (currentLevelData.placed[r + 1] ?? [])[c],
                    (currentLevelData.placed[r + 1] ?? [])[c + 1]
                ];
                if (square.every(x => [FLOOR, MONSTER].includes(x))) {
                    for (roff = 0; roff < 2; roff++) {
                        for (coff = 0; coff < 2; coff++) {
                            badTiles[r + roff][c + coff] = !(
                                maybeSafe.includes(`${r+roff},${c+coff}`)
                            );
                        }
                    }
                }
                let adjacents = [
                    (currentLevelData.placed[r - 1] ?? [])[c],
                    (currentLevelData.placed[r + 1] ?? [])[c],
                    currentLevelData.placed[r][c - 1],
                    currentLevelData.placed[r][c + 1]
                ];
                let wallCount = adjacents.filter(
                    x => [WALL, undefined].includes(x)
                ).length;
                let isDeadEnd = wallCount === 3;
                let placed = currentLevelData.placed[r][c];
                let isBadDeadEnd =
                    (isDeadEnd && [FLOOR, undefined].includes(placed)) ||
                    (!isDeadEnd && placed === MONSTER);
                badTiles[r][c] ||= isBadDeadEnd;
            }
        }
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++)
                setBadFlag([r + 1, c + 1], badTiles[r][c]);
        }
        if (document.getElementsByClassName("bad").length === 0) {
            let nonWalls = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (currentLevelData.placed[r][c] !== WALL)
                        nonWalls.push([r, c]);
                }
            }
            let visited = [];
            let frontier = [nonWalls[0]];
            while (frontier.length) {
                let current = frontier.shift();
                visited.push(current);
                for (let offset of OFFSETS) {
                    let newPos = [current[0] + offset[0],
                                  current[1] + offset[1]];
                    if (newPos[0] < 0 || newPos[0] > 7) continue;
                    if (newPos[1] < 0 || newPos[1] > 7) continue;
                    if (currentLevelData.placed[newPos[0]][newPos[1]] ===
                        WALL) continue;
                    if (visited.map(x => `${x[0]},${x[1]}`)
                               .includes(`${newPos[0]},${newPos[1]}`))
                        continue;
                    if (frontier.map(x => `${x[0]},${x[1]}`)
                                .includes(`${newPos[0]},${newPos[1]}`))
                        continue;
                    frontier.push(newPos);
                }
            }
            if (nonWalls.length !== visited.length)
                setStatus("Not Together");
            else if (currentLevelData.placed.flat().some(x => x === EMPTY))
                setStatus("Some Empty");
            else
                setStatus("Complete");
        }
    }
}