import { withStyles, TextField } from "@material-ui/core";
const CssTextField = withStyles({
    root: {
        
        '& .MuiTextField-root': {
            color: "white"
        },
        '& label': {
            color: 'white',
            fontSize: "20px"
        }, '& label.Mui-focused': {
            color: 'white',
        }, '& input': {
            color: 'white',
            fontSize: "20px"
        }, '& textArea': {
            color: 'white',
            fontSize: "20px"
        },
        '& .MuiInput-underline:before': {
            borderBottomColor: "white"
        }

    },
/*
    track: {
        borderRadius: 26 / 2,
        border: `1px solid #eedd22`,
        backgroundColor: "#eedd22",
        opacity: 1,
        transition: (['background-color', 'border']),
    },
    */
})(TextField);

export default CssTextField;