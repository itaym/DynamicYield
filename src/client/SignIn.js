import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import { doLogin } from './redux/actions';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © Itay Merchav'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

class SignIn extends PureComponent {

    doLogin = async () => {
        const { dispatch } = this.props;
        dispatch(doLogin(this.name, this.password));
    };

    onChange = (paramName) => {
        return (event) => {
            this[paramName] = event.target.value;
        }
    };

    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>

                    <Typography component="h1" variant="h5">
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                    </Typography>

                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>

                    <TextField
                        onChange={this.onChange('name')}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="User name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        onChange={this.onChange('password')}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.doLogin}
                    >
                        Sign In
                    </Button>
                </div>
                <Box mt={8}>
                    <Copyright/>
                </Box>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {...state,
        loggedIn: !!state.user
    };
};

export default connect(mapStateToProps)(SignIn);