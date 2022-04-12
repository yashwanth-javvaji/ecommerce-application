// Material UI
// Components
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

// Other Dependencies
import moment from 'moment';


const Review = ({ review }) => {
    const { rating, comment, user } = review;

    return (
        <Card>
            <CardHeader
                avatar={<Avatar alt={`${user.firstname} ${user.lastname}`} src={user.profileImage} />}
                title={`${user.firstname} ${user.lastname}`}
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating defaultValue={rating} precision={0.1} readOnly />
                        &nbsp;
                        <Typography variant="body1">({rating.toFixed(2)})</Typography>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography variant="body2" color="text.secondary">{moment(review.createdAt).fromNow()}</Typography>
                    </Box>
                }
            />
            <CardContent sx={{ mt: -2 }}>
                <Typography variant="body2">{comment}</Typography>
            </CardContent>
        </Card>
    );
};

export default Review;