import React, {useEffect} from "react";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import {generateIconColorMode} from "../style/enable-dark-mode";
import Tooltip from "@material-ui/core/Tooltip";
import {useThemeContext} from "../../context/theme-context";

interface ImagePreviewComponentType {
    displayImagePreview: boolean
    setDisplayImagePreview: (val: boolean) => void
    // changeDisplayImagePreview: (action: string, src: string) => void
    imgSrc: string
}

export const ImagePreviewComponent: React.FunctionComponent<ImagePreviewComponentType> = ({
                                                                                              setDisplayImagePreview,
                                                                                              displayImagePreview,
                                                                                              imgSrc
                                                                                          }) => {
    const {theme} = useThemeContext();

    useEffect(() => {
        document.addEventListener('keyup', closeDisplayImagePreview)
        return () => {
            document.removeEventListener('keyup', closeDisplayImagePreview)
        }
    }, [closeDisplayImagePreview])

    function handleImagePreview(event: any, action: string) {
        event.preventDefault();
        switch (action) {
            case "OPEN":
                setDisplayImagePreview(true)
                // changeDisplayImagePreview(GroupActionEnum.OPEN, "")
                break;
            case "CLOSE":
                setDisplayImagePreview(false)
                // changeDisplayImagePreview(GroupActionEnum.CLOSE, "")
                break;
            default:
                throw new Error("handleImagePreview failed");
        }
    }

    function closeDisplayImagePreview(event: any) {
        event.preventDefault();
        if (event.key === "Escape") {
            setDisplayImagePreview(false);
            // changeDisplayImagePreview(GroupActionEnum.CLOSE, "");
            document.removeEventListener("keyup", closeDisplayImagePreview, false);
        }
    }

    return (
        <React.Fragment>
            {displayImagePreview &&
            <div style={{
                position: "fixed",
                zIndex: 1200,
                right: "0",
                bottom: "0",
                top: "0",
                left: "0",
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(0, 0, 0, .5)"
            }}/>
            }
            {
                displayImagePreview &&
                <div
                    style={{
                        position: "fixed",
                        zIndex: 1300,
                        right: "2%",
                        bottom: " 2%",
                        top: " 3%",
                        left: "2%",
                        backgroundColor: "transparent",
                        borderRadius: "2px",
                        border: "1px solid white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <div style={{
                        zIndex: 1400,
                        right: "10px",
                        position: "absolute",
                        top: "10px"
                    }}>
                        <Tooltip title='Press "Escape" to close'>
                            <IconButton onClick={event => handleImagePreview(event, "CLOSE")}>
                                <CloseIcon style={{color: generateIconColorMode(theme)}}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={{
                        filter: "blur(1.5rem)",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: "0.5"
                    }}/>
                    <img style={{maxHeight: "-webkit-fill-available"}} src={imgSrc}
                         alt="real size"/>
                </div>
            }
        </React.Fragment>
    )
}
