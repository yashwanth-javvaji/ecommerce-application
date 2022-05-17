// ReactJS
import React, { useState } from 'react';

// Material UI
// Components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

// Other Dependencies
import { motion } from 'framer-motion';


const ListPagination = ({ type, list, itemsPerPage }) => {
    const [page, setPage] = useState(1);
    const pageSize = itemsPerPage;

    const firstItemInPage = (page - 1) * pageSize;
    const lastItemInPage = Math.min(page * pageSize, list.length) - 1;

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    if (list.length === 0) {
        return (
            <Grid item xs={12} component={motion.div} layout>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    No {type} to show
                </Typography>
            </Grid>
        );
    } else {
        return (
            <>
                {list.slice(firstItemInPage, lastItemInPage + 1).map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)}
                <Grid item xs={12} component={motion.div} layout>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Showing {firstItemInPage + 1}-{lastItemInPage + 1} of {list.length} {type}
                        </Typography>
                        <Pagination
                            variant="outlined"
                            color="primary"
                            count={Math.ceil(list.length / pageSize)}
                            showFirstButton
                            showLastButton
                            page={page}
                            onChange={handlePageChange}
                        />
                    </Box>
                </Grid>
            </>
        );
    }
};

export default ListPagination;