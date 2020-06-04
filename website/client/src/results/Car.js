import React from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { makeStyles } from "@material-ui/core/styles";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import CardContent from "@material-ui/core/CardContent";
import Quality from "./Quality";
import clsx from "clsx";
import CardMedia from "@material-ui/core/CardMedia";
import Slider from "@material-ui/core/Slider";
import PowerIcon from "@material-ui/icons/Power";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// Component for a car card
const useStyles = makeStyles((theme) => ({
	root: {
		// maxWidth: 700,
	},
	media: {
		maxWidth: 300,
	},
	slider: {
		marginLeft: "2vw",
	},
	expand: {
		transform: "rotate(0deg)",
		marginLeft: "auto",
		transition: theme.transitions.create("transform", {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: "rotate(180deg)",
	},
	msrp: {
		margin: "100px",
	},
	badges: {
		maxWidth: 100,
		margin: 10,
		marginTop: 30
	}
}));

const sliderStyles = makeStyles((theme) => ({
	root: {
		margin: "2vw",
		maxWidth: 500,
	},
}));

const priceRange = (minValue, maxValue) => {
	return [
		{
			value: minValue,
			label: `MIN VALUE: ${minValue}`,
		},
		{
			value: maxValue,
			label: `MAX VALUE: ${maxValue}`,
		},
	];
};

const formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
});

const Car = (props) => {
	const classes = useStyles();
	const sliderClass = sliderStyles();
	// state that describes whether user clicked on the expand more
	const [expanded, setExpanded] = React.useState(false);
	const [compareDisabled, toggleDisabled] = React.useState(false);
	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	const marketPrice = props.data.PRICE_RANGE.split(" ");
	const lowerBound = parseInt(marketPrice[0]);
	const upperBound = parseInt(marketPrice[2]);

	const submitData = (e) => {
		console.log("PRESSED");
		props.func(e.currentTarget.value);
	};

	const loadBadges = (badge) => {
		console.log(badge);
		const finalImages = [];
		const prices = {
			0: "pricegold.png",
			1: "pricesilver.png",
			2: "pricebronze.png",
		};

		const ratings = {
			0: "ratinggold.png",
			1: "ratingsilver.png",
			2: "ratingbronze.png",
		};
		const mpg = {
			0: "mpggold.png",
			1: "mpgsilver.png",
			2: "mpgbronze.png",
		};
		const oogaPrice = badge.msrp;
		const oogaRating = badge.rating;
		const oogaMpg = badge.mpg;
		if (typeof oogaPrice != "undefined") finalImages.push(prices[oogaPrice]);
		if (typeof oogaRating != "undefined") finalImages.push(ratings[oogaRating]);
		if (typeof oogaMpg != "undefined") finalImages.push(mpg[oogaMpg]);
		console.log(finalImages);
		return finalImages;
	};
	return (
		<div>
			<div>
				<Card variant="outlined">
					<CardActionArea>
						<Typography
							className={clsx(classes.h6, classes.root)}
							color="primary"
							variant="h6"
						>
							{props.name}
						</Typography>
						{props.data["IS ELECTRIC"] && <PowerIcon />}
						<Grid container>
							<Grid item xs={4}>
								{
									<CardMedia
										className={classes.media}
										component="img"
										src="image"
										image={props.data.IMAGE_LINK}
									></CardMedia>
								}
							</Grid>
							{loadBadges(props.bValues).map((item, index) => {
								return (
								<Grid key={index} item={1}>
									<CardMedia className={classes.badges} component="img" src="image" image={item}></CardMedia>
								</Grid>
								)
							})}

							<Grid item xs={4}>
								<Typography variant="h4" className={classes.msrp}>
									{formatter.format(props.data.MSRP)}
								</Typography>
							</Grid>
						</Grid>
					</CardActionArea>
					<CardActions>
						<IconButton
							value={props.data.ID}
							onClick={submitData}
							disabled={false}
						>
							Compare Me!
						</IconButton>
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: expanded,
							})}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label="show more"
							edge="end"
						>
							<ExpandMoreIcon />
						</IconButton>
					</CardActions>
					{/* what the user sees after clickng on the expand more icon */}
					<Collapse in={expanded} timeout="auto" unmountOnExit>
						<CardContent>
							<div className={sliderClass.root}>
								<Slider
									min={lowerBound}
									max={upperBound}
									className={sliderClass.root}
									color="primary"
									disabled
									marks={priceRange(lowerBound, upperBound)}
								/>
							</div>
							{/* <Typography variant="h2">Surprise!</Typography> */}
							{Object.entries(props.data).map(([key, value]) => {
								var electric = undefined;
								if (key === "IS ELECTRIC" && value) electric = true;
								if (!["IMAGE_LINK", "NAME"].includes(key))
									return (
										<Quality
											isElectric={electric}
											key={key}
											dataType={key}
											dataValue={value}
										/>
									);
								return undefined;
							})}
						</CardContent>
					</Collapse>
				</Card>
			</div>
		</div>
	);
};

export default Car;
