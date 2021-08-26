import React, {FunctionComponent} from 'react';
import TextField from '@material-ui/core/TextField';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({
    labelInput: {
        color: (props: any) => props.isDarkModeEnable === "dark" ? "white" : "black",
    },
    input: {
        color: (props) => props.isDarkModeEnable === "dark" ? "white" : "black",
        borderColor: (props) => props.isDarkModeEnable === "dark" ? "white" : "black",
    },
    cssLabel: {
        color: (props) => props.isDarkModeEnable === "dark" ? "white" : "black",
    },
    cssFocused: {
        color: (props) => props.isDarkModeEnable === "dark" ? "white" : "black",
    },
}));

interface ICustomMaterialTextField {
    id: string | undefined
    label: string
    value: string
    name: string
    isMultiline: boolean
    type: "password" | "text"
    handleChange: (event: any) => void
    isDarkModeEnable: string
    onClick?: () => void
    keyUp?: (event: any) => void
    keyDown?: (event: any) => void
}


export const CustomTextField: FunctionComponent<ICustomMaterialTextField> = (props) => {
    const styles = useStyles(props);

    const handleChange = (event: any) => {
        props.handleChange(event);
    };

    const submitForm = (event: any) => {
        if (props.keyUp !== undefined) {
            props.keyUp(event);
        }
        if (props.keyDown !== undefined) {
            props.keyDown(event);
        }
    }

    return (
        <React.Fragment>
            <TextField
                id={props.id}
                label={props.label}
                variant="outlined"
                fullWidth
                value={props.value}
                autoFocus={false}
                maxRows={4}
                multiline={props.isMultiline}
                name={props.name}
                onClick={props.onClick}
                onChange={handleChange}
                type={props.type}
                onKeyUp={event => submitForm(event)}
                onKeyDown={event => submitForm(event)}
                InputLabelProps={{
                    classes: {
                        root: styles.cssLabel,
                        focused: styles.cssLabel
                    },
                }}
                InputProps={{
                    className: styles.input,
                }}
            />
        </React.Fragment>
    );
}
