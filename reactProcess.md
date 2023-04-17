SELECTION NO
    DO DELETE
        POINT HEAD
            && AT START
            && PARENT LEVEL = 1 NAME = blockquote
            => CHANGE_PARENT_TYPE_TO_PRAGRAPH
    DO LEFT_MOVE
        POINT HEAD
            && AT START
            && PARENT LEVEL = 1 NAME = blockquote
            => MOVE_POINT
SELECTION TEXT
    DO DELETE
        && POINT HEAD
            PARENT LEVEL = 1 NAME = blockquote
        && POINT ARCHOR
            PARENT LEVEL = 1 NAME = blockquote
        => MERGE_NODE
SELECTION NODE
    DO DELETE
    => DELETE_NODE
    DO LEFT_MOVE
    => MOVE_POINT
    DO RIGHT_MOVE
    => MOVE_POINT
