import {
    ALL_COMMANDS,
    COMMAND_NOTES,
    COMMAD_NEW_NOTE,
    COMMAND_EDIT_NOTE,
    COMMAND_DEL_NOTE,
    COMMAND_RETURN
} from "./commands";

const is_command = (mesg) => {
    return mesg !== ALL_COMMANDS && mesg !== COMMAND_NOTES && mesg !== COMMAD_NEW_NOTE && mesg !== COMMAND_EDIT_NOTE && mesg !== COMMAND_DEL_NOTE && mesg !== COMMAND_RETURN;
};

export {
    is_command
}