import { Avatar, ListItem, ListItemText, Skeleton } from "@mui/material"
import React from "react"

export function SkeletonLoader () {
	const toLoad: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	return (
		<>
			{
				toLoad.map((index) => (
					<ListItem key={ index }>
						<Avatar>
							<Skeleton variant={ "circular" } width={ 40 } height={ 40 }/>
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
