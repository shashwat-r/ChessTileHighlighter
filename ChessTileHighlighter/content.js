function print(...args) {console.log(...args)}
function type(...args) {return typeof(args)}
function runEvery(interval_time_seconds, func) {
    setInterval(func, interval_time_seconds*1000)
}

function getPositionString(file_idx, rank_idx) {
    valid_idx_list = [1, 2, 3, 4, 5, 6, 7, 8]
    if (valid_idx_list.includes(file_idx) && valid_idx_list.includes(rank_idx)) {
        return String(10*file_idx+rank_idx)
    }
    return ""
}

function highlightBoard() {
    // Load Chessboard UI Element
    // print("HIGHLIGHT_BOARD")
    board_element = null
    element_ids = ["board-single", "board-play-computer", "board-analysis-board"]
    for (i=0; i<element_ids.length; i++) {
        board_element = document.getElementById(element_ids[i])
        if (board_element !== null) break
    }
    // print("BOARD_ELEMENT")
    // print(board_element)
    if (board_element === null) return

    // Get Position List
    position_strings = []
    position_file_idx = {}
    position_rank_idx = {}

    for (file_idx = 1; file_idx <= 8; file_idx++) {
        for (rank_idx = 1; rank_idx <= 8; rank_idx++) {
            position_string = getPositionString(file_idx, rank_idx)
            position_strings.push(position_string)
            position_file_idx[position_string] = file_idx
            position_rank_idx[position_string] = rank_idx
        }
    }
    // print(position_strings.length, position_strings)

    // Add Highlight Elements on UI
    for (i = 0; i < position_strings.length; i++) {
        position_string = position_strings[i]
        highlight_div_class_name = "highlight square-"+position_string
        existing_highlight_divs = document.getElementsByClassName(highlight_div_class_name)
        if ((existing_highlight_divs === null) || (existing_highlight_divs.length === 0)) {
            highlight_div = document.createElement("div")
            highlight_div.className = "highlight square-"+position_string
            // board_element.appendChild(highlight_div)
            highlight_div.style = "background-color: rgb(0, 0, 0); opacity: 0.0;"
            board_element.insertBefore(highlight_div, board_element.firstChild)
        }
    }

    // Figure Out the Side from UI
    is_white = true
    text_elements = document.querySelector("svg.coordinates").querySelectorAll("text")
    y1 = 0
    y8 = 0
    for (i=0; i<text_elements.length; i++) {
        text_element = text_elements[i]

        y = text_element.getAttribute('y')
        num = text_element.textContent.trim()
        // print(typeof(y), y, typeof(num), num)

        y_float = parseFloat(y)
        num_int = parseInt(num)
        // print(typeof(y_float), y_float, typeof(num_int), num_int)

        if (num_int === 1) y1 = y_float
        if (num_int === 8) y8 = y_float
    }
    // print("y1", y1, "y8", y8)
    if (y1 > y8) is_white = true
    else is_white = false
    // print("IS_WHITE", is_white)
    
    // Initialize Tracking Board
    board = {"": "empty"}
    possible_pieces = ["wr", "wn", "wb", "wq", "wk", "wp", "br", "bn", "bb", "bq", "bk", "bp"]
    for (i = 0; i < position_strings.length; i++) {
        position_string = position_strings[i]
        piece = "empty"
        for (j = 0; j < possible_pieces.length; j++) {
            possible_piece = possible_pieces[j]
            elem = board_element.querySelectorAll(".piece."+possible_piece+".square-"+position_string)
            if (elem.length > 0) {
                // print(position_string, possible_piece, elem)
                piece = possible_piece
                break
            }
        }
        board[position_string] = piece
    }
    // print(board)
    
    // Initialize Attack Values
    white_attack = {}
    black_attack = {}

    for (i = 0; i < position_strings.length; i++) {
        position_string = position_strings[i]
        white_attack[position_string] = 0
        black_attack[position_string] = 0
    }

    for (i = 0; i < position_strings.length; i++) {
        position_string = position_strings[i]
        file_idx = position_file_idx[position_string]
        rank_idx = position_rank_idx[position_string]
        // print("MAIN: `"+i+"` `"+position_string+"`:`"+board[position_string]+"` `"+file_idx+":"+rank_idx+"`")

        // White Pawn
        if (board[position_string] == "wp") {
            new_file_idx = file_idx - 1
            new_rank_idx = rank_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_file_idx = file_idx + 1
            new_rank_idx = rank_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2
        }

        // Black Pawn
        if (board[position_string] == "bp") {
            new_file_idx = file_idx - 1
            new_rank_idx = rank_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_file_idx = file_idx + 1
            new_rank_idx = rank_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2
        }

        // White Rook
        if (board[position_string] == "wr") {
            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }
        }

        // Black Rook
        if (board[position_string] == "br") {
            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }
        }

        // White Bishop
        if (board[position_string] == "wb") {
            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }
        }

        // Black Bishop
        if (board[position_string] == "bb") {
            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }
        }

        // White Queen
        if (board[position_string] == "wq") {
            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                white_attack[new_position_string] = Math.max(attack_value, white_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }
        }

        // Black Queen
        if (board[position_string] == "bq") {
            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx + increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx + increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }

            piece_found = false
            attack_value = 2
            for (increment = 1; increment <= 7; increment++) {
                new_rank_idx = rank_idx - increment
                new_file_idx = file_idx - increment
                new_position_string = getPositionString(new_file_idx, new_rank_idx)
                // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
                black_attack[new_position_string] = Math.max(attack_value, black_attack[new_position_string])
                if (board[new_position_string] !== "empty") {
                    piece_found = true
                    attack_value = 1
                }
            }
        }

        // White Knight
        if (board[position_string] == "wn") {
            new_rank_idx = rank_idx - 2
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 2
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 2
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 2
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx - 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx + 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx - 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx + 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2
        }

        // Black Knight
        if (board[position_string] == "bn") {
            new_rank_idx = rank_idx - 2
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 2
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 2
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 2
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx - 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx + 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx - 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx + 2
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2
        }

        // White King
        if (board[position_string] == "wk") {
            new_rank_idx = rank_idx
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            white_attack[new_position_string] = 2
        }

        // Black King
        if (board[position_string] == "bk") {
            new_rank_idx = rank_idx
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx + 1
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx + 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2

            new_rank_idx = rank_idx - 1
            new_file_idx = file_idx - 1
            new_position_string = getPositionString(new_file_idx, new_rank_idx)
            // print("`"+position_string+"`:`"+board[position_string]+"` `"+new_position_string+"`:`"+board[new_position_string]+"`")
            black_attack[new_position_string] = 2
        }

        // Reset Invalid Position Attack Values
        white_attack[""] = 0
        black_attack[""] = 0
    }

    // print("white_attack", white_attack)
    // print("black_attack", black_attack)

    // Highlight Attack Values on UI
    player_attack = black_attack
    opponent_attack = white_attack
    if (is_white) {
        player_attack = white_attack
        opponent_attack = black_attack
    }
    red_intensity_mapping = {0:"0", 1:"0", 2:"255"}
    green_intensity_mapping = {0:"0", 1:"0", 2:"255"}
    for (i = 0; i < position_strings.length; i++) {
        position_string = position_strings[i]
        green_level = green_intensity_mapping[player_attack[position_string]]
        red_level = red_intensity_mapping[opponent_attack[position_string]]
        if (opponent_attack[position_string] == 2) red_level = 255
        if ((green_level == 0) & (red_level == 0)) opacity_level = "0"
        else opacity_level = "0.3"

        highlight_div_class_name = "highlight square-"+position_string
        highlight_div = document.getElementsByClassName(highlight_div_class_name)[0]
        highlight_div.style = "background-color: rgb("+red_level+", "+green_level+", 0); opacity: "+opacity_level+";"
    }
}

runEvery(0.5, ()=>{highlightBoard()})
