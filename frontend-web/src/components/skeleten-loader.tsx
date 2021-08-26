import Avatar from "@material-ui/core/Avatar";
import {Skeleton} from "@material-ui/lab";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import ListItem from "@material-ui/core/ListItem";

export function SkeletonLoader() {
    const toLoad: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
        <>
            {
                toLoad.map((index) => (
                    <ListItem key={index}>
                        <Avatar>
                            <Skeleton variant="circle" width={40} height={40}/>
                        </Avatar>
                        <ListItemText primary={
                            <React.Fragment>
                                <Skeleton variant="text"/>
                            </React.Fragment>
                        }
                                      secondary={
                                          <React.Fragment>
                                              <Skeleton variant="text"/>
                                          </React.Fragment>
                                      }/>
                    </ListItem>
                ))
            }
        </>
    )
}