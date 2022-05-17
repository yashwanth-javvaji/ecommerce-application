// ReactJS
import { useEffect, useState } from 'react';

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

// Custom
// Services
import { getProfileImage } from '../../services/profile';


const Review = ({ review }) => {
    const { rating, comment, user } = review;

    const [profileImage, setProfileImage] = useState();

    useEffect(async () => {
        if (!!user.profileImage) {
            setProfileImage(await getProfileImage(user.profileImage));
        }
    }, [user.profileImage]);

    return (
        <Card>
            <CardHeader
                avatar={<Avatar alt={`${user.firstname} ${user.lastname}`} src={profileImage} />}
                title={`${user.firstname} ${user.lastname}`}
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating defaultValue={rating} precision={0.1} readOnly />
                        &nbsp;
                        <Typography variant="body1">({rating.toFixed(2)})</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>{moment(review.createdAt).fromNow()}</Typography>
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