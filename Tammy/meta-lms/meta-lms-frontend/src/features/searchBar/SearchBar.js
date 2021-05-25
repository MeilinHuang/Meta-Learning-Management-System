import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { Autocomplete } from '@material-ui/lab';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { selectSearchFor, searchFor, setSearchValue } from './searchBarSlice';
import { selectNodes, focusNode } from '../topicGraph/topicGraphSlice';
import './SearchBar.css';
import { dispatch } from 'd3-dispatch';
// TODO
const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
];

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export const SearchBar = () => {
    const classes = useStyles();

    const dispatch = useDispatch();
    const searchForVal = useSelector(selectSearchFor);

    const topics = useSelector(selectNodes);

    const materials = () => {
        let list = []
        topics.forEach(t => {
            console.log(t["id"], t["title"], t["materials_strings"])

            // go through prep materials
            t["materials_strings"]["preparation"].forEach(m => {
                console.log(m)
                list.push({
                    topicId: t["id"],
                    topicTitle: t["title"],
                    material: m
                })
            })

            // go through content materials
            t["materials_strings"]["content"].forEach(m => {
                console.log(m)
                list.push({
                    topicId: t["id"],
                    topicTitle: t["title"],
                    material: m
                })
            })

            // go through practice materials
            t["materials_strings"]["practice"].forEach(m => {
                console.log(m)
                list.push({
                    topicId: t["id"],
                    topicTitle: t["title"],
                    material: m
                })
            })
            // go through assessment materials
            t["materials_strings"]["assessment"].forEach(m => {
                console.log(m)
                list.push({
                    topicId: t["id"],
                    topicTitle: t["title"],
                    material: m
                })
            })
        });
        console.log('finalised list of materials', list)
        return list;
    }
    const materialsList = materials();

    const filterOptions = createFilterOptions({
        matchFrom: 'any',
        stringify: (option) => option.title
    });

    const filterOptionsMaterial = createFilterOptions({
        stringify: ({ firstName, lastName, id }) => `${firstName} ${lastName} ${id}`
    });
    return (
        <>
            <div style={{ paddingLeft: "50px", display: "flex", alignItems: "center" }}>
                <FormLabel component="legend" style={{ marginRight: "10px", color: "white" }}>Search for: </FormLabel>
                <FormControl component="fieldset"  >

                    <RadioGroup
                        row aria-label="position"
                        name="position"
                        defaultValue="topic"
                        onChange={(e) => {
                            dispatch(searchFor({ searchFor: e.target.value }))
                        }}
                    >

                        <FormControlLabel value="topic" control={<Radio color="secondary" />} label="Topic" />
                        <FormControlLabel value="material" control={<Radio color="secondary" />} label="Learning Material" />
                    </RadioGroup>
                </FormControl>
            </div>


            {/* search bar */}
            <div className={classes.search}>
                {/* <div className={classes.searchIcon}>
                    <SearchIcon />
                </div> */}
                {/* https://stackoverflow.com/questions/63437242/search-by-name-or-id-with-material-ui-autocomplete */}
                {/* https://codesandbox.io/s/heuristic-clarke-moz4d?fontsize=14&hidenavigation=1&theme=dark */}

                {/* topic search bar */}
                {searchForVal === 'topic' && <Autocomplete
                    id="filter-demo"
                    options={topics}
                    getOptionLabel={(option) => option.title}
                    filterOptions={filterOptions}
                    style={{ width: 300, background: "white" }}
                    onChange={(e, val) => {
                        console.log(val);
                        if (val === null) {
                            setSearchValue({ val: "" });
                        } else {
                            setSearchValue({ val });
                            dispatch(focusNode(val.id));
                        }

                    }}
                    renderInput={(params) =>
                        <TextField {...params}
                            placeholder={"Search for a " + searchForVal}
                            // searchForVal
                            // onChange={(e) => { console.log(e.target.value) }}
                            variant="outlined" />}
                />}

                {/* TODO: material search bar */}
                {searchForVal === 'material' && <Autocomplete
                    id="tags-outlined"
                    options={materialsList}
                    onInputChange={(event) => event.target}
                    filterOptions={filterOptionsMaterial}
                    style={{ width: 300, background: "white" }}
                    getOptionLabel={({ topicTitle, material }) => {
                        // this is how our option will be displayed when selected
                        // remove the `id` here
                        return `${material} from ${topicTitle}`;
                    }}
                    filterSelectedOptions

                    onChange={(e, val) => {
                        console.log(val);
                        if (val === null) {
                            setSearchValue({ val: "" });
                        } else {
                            setSearchValue({ val });
                            dispatch(focusNode(val.topicId));
                        }

                    }}

                    renderOption={({ topicTitle, material }) => {
                        return (
                            <div>
                                <div>
                                    {`${material} `}
                                    {/* {lastName} */}
                                </div>
                                <span><sub><i>from {topicTitle}</i></sub></span>
                            </div>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            placeholder={"Search for a " + searchForVal}
                        />
                    )}
                />}
            </div>
        </>
    );
}