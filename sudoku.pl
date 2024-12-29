is_valid_value(1).
is_valid_value(2).
is_valid_value(3).
is_valid_value(4).

is_valid_section(A, B, C, D) :-
    is_valid_value(A),
    is_valid_value(B),
    is_valid_value(C),
    is_valid_value(D),
    A =\= B,
    A =\= C,
    A =\= D,
    B =\= C,
    B =\= D,
    C =\= D.

is_valid_sudoku(
    R1C1, R1C2, R1C3, R1C4,
    R2C1, R2C2, R2C3, R2C4,
    R3C1, R3C2, R3C3, R3C4,
    R4C1, R4C2, R4C3, R4C4
) :-
    is_valid_section(R1C1, R1C2, R1C3, R1C4),
    is_valid_section(R2C1, R2C2, R2C3, R2C4),
    is_valid_section(R3C1, R3C2, R3C3, R3C4),
    is_valid_section(R4C1, R4C2, R4C3, R4C4),

    is_valid_section(R1C1, R2C1, R3C1, R4C1),
    is_valid_section(R1C2, R2C2, R3C2, R4C2),
    is_valid_section(R1C3, R2C3, R3C3, R4C3),
    is_valid_section(R1C4, R2C4, R3C4, R4C4),

    is_valid_section(R1C1, R1C2, R2C1, R2C2),
    is_valid_section(R3C1, R3C2, R4C1, R4C2),
    is_valid_section(R1C3, R1C4, R2C3, R2C4),
    is_valid_section(R3C3, R3C4, R4C3, R4C4).
