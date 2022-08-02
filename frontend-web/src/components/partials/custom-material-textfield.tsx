import { TextField } from "@mui/material"
import React, { FunctionComponent } from "react"
import styled from "@emotion/styled"
import { useThemeContext } from "../../context/theme-context"

const StyledComp = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "myProp",
})<{ myProp: string }>(({
  myProp,
}) => ({
  "& label.Mui-focused": {
    color: myProp === "dark" ? "white" : "black",
  },
  "& .MuiInputLabel-formControl": {
    color: myProp === "dark" ? "white" : "black",
  },
  "& .MuiInput-underline": {
    color: myProp === "dark" ? "white" : "black",
  },
  "& .MuiOutlinedInput-input": {
    color: myProp === "dark" ? "white" : "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
	 borderColor: myProp === "dark" ? "white" : "black",
    },
    "&:hover fieldset": {
	 borderColor: myProp === "dark" ? "white" : "black",
    },
    "&.Mui-focused fieldset": {
	 borderColor: myProp === "dark" ? "white" : "black",
    },
  },
}))

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
  const { theme } = useThemeContext()

  const handleChange = (event: any) => {
    props.handleChange(event)
  }

  const submitForm = (event: any) => {
    if (props.keyUp !== undefined) {
	 props.keyUp(event)
    }
    if (props.keyDown !== undefined) {
	 props.keyDown(event)
    }
  }

  return (
    <React.Fragment>
	 <StyledComp
	   myProp={theme}
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
	   onKeyUp={(event) => submitForm(event)}
	   onKeyDown={(event) => submitForm(event)}
	 />
    </React.Fragment>
  )
}
