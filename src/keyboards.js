import {
    ALL_COMMANDS,
    COMMAND_NOTES,
    COMMAD_NEW_NOTE,
    COMMAND_EDIT_NOTE,
    COMMAND_DEL_NOTE,
    COMMAND_RETURN
} from "./commands";

const home = [
    [
        COMMAND_NOTES,
        COMMAD_NEW_NOTE
    ],
    [
        COMMAND_EDIT_NOTE,
        COMMAND_DEL_NOTE
    ]

];
const return_command = [
    [
        COMMAND_RETURN
    ]
];

export default {
    home,
    return_command
};
