import React from "react";
import IconButton from "@material-ui/core/IconButton";
import {
	List,
	ListItem,
	Divider,
	Drawer,
	ListItemAvatar,
	Avatar,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Slider from "@material-ui/core/Slider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import CheckIcon from "@material-ui/icons/Check";

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
});

const useStyles = makeStyles((theme) => ({
	root: {
		width: 500,
	},
}));

const priceLabel = makeStyles(theme => ({
	root: {
		width: '90vw',
		maxWidth: 300
	},
	valueLabel: {
		background: 'transparent',
		color: 'red'
	}
}))

const FilterDrawer = (props) => {
	const classes = useStyles();
	const sliderClasses = priceLabel();
	const [filter, setFilter] = React.useState("MSRP");
	const [finalValue, setFinal] = React.useState(1);
	const [open, setOpen] = React.useState(false);
	// looks to see whether the user presses certain keys (mainly for UX)
	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};
	const icons = [<AttachMoneyIcon />, <Icon>filter_alt</Icon>];
	const filterRange = [
		{
			value: 0,
			label: `MIN VALUE: 0`,
		},
		{
			value: props.maxAvailPrice,
			label: `MAX VALUE: ${props.maxAvailPrice}`,
		},
	];

	const submitFilters = () => {
		return (
			handleDrawerClose(), props.func(filter, finalValue)
		);
	};

	const handleFilter = (event) => {
		setFilter(event.target.value);
	};

	// const PriceLabel = withStyles({
	// 	root: {
	// 		margin: "4vw",
	// 		maxWidth: 500,
	// 	},
	// 	valueLabel: {
	// 		background: "transparent",
	// 		color: "red",
	// 	},
	// })(Slider);

	const handleChange = (event, newValue) => {
		setFinal(newValue);
	};
	const topics = (anchor) => (
		<div role={"presentation"} className={classes.root}>
			<IconButton onClick={submitFilters}>
				<CheckIcon />
			</IconButton>
			{/* Just maps out the topics, making listitems for each one */}
			<List>
				{[
					<Slider
						className={sliderClasses.root}
						min={0}
						max={props.maxAvailPrice}
						marks={filterRange}
						valueLabelDisplay="auto"
						onChange={handleChange}
						value={finalValue}
						defaultValue={30000}
						valueLabelFormat={(val) => formatter.format(val)}
					/>,
					<Select value={filter} onChange={handleFilter}>
						<MenuItem value="MSRP">Price</MenuItem>
						<MenuItem value="RATING">Rating</MenuItem>
						<MenuItem value="MPG">Efficiency</MenuItem>
					</Select>,
				].map((text, index) => (
					<>
						<ListItem key={index}>
							<ListItemAvatar key={index}>
								<Avatar key={index}>{icons[index]}</Avatar>
							</ListItemAvatar>
							{/* <ListItemText key={index}>{text}</ListItemText> */}
							{text}
						</ListItem>
						<Divider />
					</>
				))}
			</List>
		</div>
	);
	return (
		<div>
			<IconButton edge="end" onClick={handleDrawerOpen}>
				<SearchIcon />
			</IconButton>
			<Drawer variant="persistent" anchor={"right"} open={open}>
				{topics("right")}
			</Drawer>
		</div>
	);
};

export default FilterDrawer;
