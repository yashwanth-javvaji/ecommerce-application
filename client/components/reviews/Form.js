// ReactJS
import { useState } from "react";

// NextJS
import Router from "next/router";

// Material UI
// Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// Icons
import RateReviewIcon from '@mui/icons-material/RateReview';

// Custom
// Components
import ComponentHeader from "../ComponentHeader";
// HOCs
import withCurrentUser from '../../HOC/withCurrentUser';
// Services
import { addReview } from "../../services/products";
import { createReview } from "../../services/reviews";
// Utils
import { checkIsEmpty, checkLength } from "../../utils/error-handling/validation";
import { formatErrorMessage } from "../../utils/error-handling/format-error-message";


const Form = ({ currentUser, productId }) => {
    const [formData, setFromData] = useState({
        rating: 0,
        comment: ""
    });
    const [ratingHoverValue, setRatingHoverValue] = useState(-1);
    const [errors, setErrors] = useState([]);

    const validate = (target) => {
        let isError = false;
        const attributes = target ? [target.name] : Object.keys(formData);
        // comment
        if (attributes.includes("comment")) {
            const value = target ? target.value : formData.comment;
            isError |= checkIsEmpty(value, "comment", errors, setErrors) || checkLength(value, { min: 20 }, "comment", errors, setErrors);
        }
        return isError;
    };

    const handleBlur = (event) => {
        validate(event.target);
    };

    const handleChange = (event) => {
        setFromData({
            ...formData,
            [event.target.name]: event.target.value
        });
        validate(event.target);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isError = validate();
        if (!isError) {
            await createReview({
                data: {
                    ...formData,
                    user: currentUser.id
                },
                onSuccess: async (review) => {
                    await addReview({
                        productId,
                        reviewId: review.id,
                        onSuccess: () => Router.reload()
                    });
                },
                onError: (errors) => setErrors(formatErrorMessage(errors))
            });
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <ComponentHeader
                    icon={RateReviewIcon}
                    title="Write a review for this product"
                />
            </Grid>
            <Grid item xs={12}>
                {(!currentUser) ? (
                    <Typography variant="body2" color="text.secondary">Please sign-in to write a review</Typography>
                ) : (
                    <Paper sx={{ p: 3 }}>
                        <Box component="form" id="reviewForm" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>Rating</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating
                                            name="rating"
                                            precision={0.1}
                                            value={formData.rating}
                                            onChange={(event, value) => setFromData({ ...formData, rating: value })}
                                            onChangeActive={(event, value) => setRatingHoverValue(value)}
                                        />
                                        &nbsp;&nbsp;
                                        <Typography variant="body1">{ratingHoverValue === -1 ? formData.rating : ratingHoverValue} stars</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        size="small"
                                        error={!!errors.comment}
                                        required
                                        fullWidth
                                        multiline={true}
                                        minRows="5"
                                        maxRows="5"
                                        id="comment"
                                        label="Review"
                                        name="comment"
                                        value={formData.comment}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        helperText={errors.comment}
                                    />
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                )}
            </Grid>
        </Grid>
    );
};

export default withCurrentUser(Form);