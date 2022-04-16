// NextJS
import Link from 'next/link';

// Material UI
// Components
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const ComponentHeader = (props) => {
    return (
        <Grid item container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Grid item>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                    {!!props.icon && <props.icon />}
                    &nbsp;
                    {props.title}
                </Typography>
            </Grid>
            {(!!props.href && !!props.linkText) && (
                <Grid item>
                    <Link href={props.href}>
                        <Button variant={props.variant || "contained"} sx={{ textTransform: 'none' }}>{props.linkText}</Button>
                    </Link>
                </Grid>
            )}
        </Grid>
    );
};

export default ComponentHeader;