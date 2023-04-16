# prosemirror-sample

IF NO_SELECTION
    DO DELETE 
        HEAD 
          AT START 
          WHO LEVEL = 1 NAME = blockquote
    DO LEFT_MOVE 
        HEAD
          AT START
          PARENT LEVEL = 1 NAME = blockquote
IF TEXT_SELECTION
    DO DELETE
        HEAD
          PARENT LEVEL = 1 NAME = blockquote
        ARCHOR
          PARENT LEVEL = 1 NAME = blockquote
IF NODE_SELECTION
    DO DELETE
    DO LEFT_MOVE
    DO RIGHT_MOVE
