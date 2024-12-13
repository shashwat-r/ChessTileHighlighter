function print(...args) {console.log(...args)}
function type(...args) {return typeof(args)}

function highlightBoard() {
    // print("HIGHLIGHT_BOARD")
    board_element = document.getElementById("board-single")
    // print("BOARD_ELEMENT")
    // print(board_element)
    if (board_element === null) return

    // Add Highlight Elements
    for (file_idx = 1; file_idx <= 8; file_idx++) {
        for (rank_idx = 1; rank_idx <= 8; rank_idx++) {
            position_string = String(10*file_idx+rank_idx)
            
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
    }

    // Figure Out the Side
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

    // Setup Board
    board = {}
    possible_pieces = ["wr", "wn", "wb", "wq", "wk", "wp", "br", "bn", "bb", "bq", "bk", "bp"]
    for (file_idx = 1; file_idx <= 8; file_idx++) {
        for (rank_idx = 1; rank_idx <= 8; rank_idx++) {
            position_string = String(10*file_idx+rank_idx)
            piece = "empty"
            for (i = 0; i < possible_pieces.length; i++) {
                possible_piece = possible_pieces[i]
                elem = board_element.querySelectorAll(".piece."+possible_piece+".square-"+position_string)
                if (elem.length > 0) {
                    // print(position_string, possible_piece, elem)
                    piece = possible_piece
                    break
                }
            }
            board[position_string] = piece
        }
    }
    // print(board)
    
    // Setup Attack Values
    white_attack = {}
    black_attack = {}
    level_rgb_mapping = {0:"0", 1:"127", 2:"255"}
    for (file_idx = 1; file_idx <= 8; file_idx++) {
        for (rank_idx = 1; rank_idx <= 8; rank_idx++) {
            position_string = String(10*file_idx+rank_idx)
            white_attack[position_string] = 0
            black_attack[position_string] = 0
        }
    }

    // Figure Out Attack Values
    for (file_idx = 1; file_idx <= 8; file_idx++) {
        for (rank_idx = 1; rank_idx <= 8; rank_idx++) {
            position_string = String(10*file_idx+rank_idx)

            // White Pawn
            if (board[position_string] == "wp") {
                if (rank_idx <= 7) {
                    if (file_idx >= 2) {
                        new_file_idx = file_idx - 1
                        new_rank_idx = rank_idx + 1
                        new_position_string = String(10*new_file_idx+new_rank_idx)
                        white_attack[new_position_string] = 2
                    }
                    if (file_idx <= 7) {
                        new_file_idx = file_idx + 1
                        new_rank_idx = rank_idx + 1
                        new_position_string = String(10*new_file_idx+new_rank_idx)
                        white_attack[new_position_string] = 2
                    }
                }
            }

            // Black Pawn
            if (board[position_string] == "bp") {
                if (rank_idx >= 2) {
                    if (file_idx >= 2) {
                        new_file_idx = file_idx - 1
                        new_rank_idx = rank_idx - 1
                        new_position_string = String(10*new_file_idx+new_rank_idx)
                        black_attack[new_position_string] = 2
                    }
                    if (file_idx <= 7) {
                        new_file_idx = file_idx + 1
                        new_rank_idx = rank_idx - 1
                        new_position_string = String(10*new_file_idx+new_rank_idx)
                        black_attack[new_position_string] = 2
                    }
                }
            }

            // White Rook
            if (board[position_string] == "wr") {
                piece_found = false
                attack_value = 2
                for (increment = 1; increment <= 7; increment++) {
                    new_rank_idx = rank_idx
                    new_file_idx = file_idx - increment
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                    if (
                        (new_file_idx < 1)
                        || (new_file_idx > 8)
                        || (new_rank_idx < 1)
                        || (new_rank_idx > 8)
                    ) break

                    new_position_string = String(10*new_file_idx+new_rank_idx)
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
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 2
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 2
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 2
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx - 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx + 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx - 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx + 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }
            }

            // Black Knight
            if (board[position_string] == "bn") {
                new_rank_idx = rank_idx - 2
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 2
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 2
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 2
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx - 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx + 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx - 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx + 2
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }
            }

            // White King
            if (board[position_string] == "wk") {
                new_rank_idx = rank_idx
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    white_attack[new_position_string] = 2
                }
            }

            // Black King
            if (board[position_string] == "bk") {
                new_rank_idx = rank_idx
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx + 1
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx + 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }

                new_rank_idx = rank_idx - 1
                new_file_idx = file_idx - 1
                if (!(
                    (new_file_idx < 1)
                    || (new_file_idx > 8)
                    || (new_rank_idx < 1)
                    || (new_rank_idx > 8)
                )) {
                    new_position_string = String(10*new_file_idx+new_rank_idx)
                    black_attack[new_position_string] = 2
                }
            }
        }
    }

    // Highlight Attack Values
    player_attack = black_attack
    opponent_attack = white_attack
    if (is_white) {
        player_attack = white_attack
        opponent_attack = black_attack
    }
    for (file_idx = 1; file_idx <= 8; file_idx++) {
        for (rank_idx = 1; rank_idx <= 8; rank_idx++) {
            position_string = String(10*file_idx+rank_idx)
            green_level = level_rgb_mapping[player_attack[position_string]]
            red_level = level_rgb_mapping[opponent_attack[position_string]]
            if ((green_level == 0) & (red_level == 0)) opacity_level = "0"
            else opacity_level = "0.3"

            highlight_div_class_name = "highlight square-"+position_string
            highlight_div = document.getElementsByClassName(highlight_div_class_name)[0]
            highlight_div.style = "background-color: rgb("+red_level+", "+green_level+", 0); opacity: "+opacity_level+";"
        }
    }
}

function runEvery(interval_time_seconds, func) {
    setInterval(func, interval_time_seconds*1000)
}

runEvery(0.5, ()=>{highlightBoard()})
