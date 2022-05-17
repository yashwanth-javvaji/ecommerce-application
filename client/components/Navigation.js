// ReactJS
import { useEffect, useState } from 'react';

// NextJS
import Router from 'next/router';

// Material UI
// Components
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// Icons
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DiscountIcon from '@mui/icons-material/Discount';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import PaymentsIcon from '@mui/icons-material/Payments';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
// Styles
import { styled } from '@mui/material/styles';

// Other Dependencies
import { useCart } from 'react-use-cart';

// Custom
// HOCs
import withCurrentUser from '../HOC/withCurrentUser';
// Services
import { getProfileImage } from '../services/profile';
import { getAllCategories } from '../services/categories';
import { signout } from '../services/auth';
// Utils
import { validateCartItems } from '../utils/cart/validator';


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Navigation = ({ currentUser }) => {
    const [profileImage, setProfileImage] = useState();
    const [categories, setCategories] = useState([]);

    // side nav
    const [sideNavOpen, setSideNavOpen] = useState(false);
    const handleSideNavOpen = () => {
        setSideNavOpen(true);
    };
    const handleSideNavClose = () => {
        setSideNavOpen(false);
    };

    // category dropdown
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(true);
    const handleCategoryDropdownClick = () => {
        setCategoryDropdownOpen(!categoryDropdownOpen);
    };

    // profile menu
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const isProfileMenuOpen = Boolean(profileAnchorEl);
    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };
    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    // mobile more menu
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMobileMoreMenuOpen = Boolean(mobileMoreAnchorEl);
    const handleMobileMoreMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleMobileMoreMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    // menu's close
    const handleMenuClose = () => {
        handleProfileMenuClose();
        handleMobileMoreMenuClose();
    };

    // cart
    const { items, totalUniqueItems, removeItem } = useCart();

    const renderProfileMenu = (
        <Menu
            anchorEl={profileAnchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={isProfileMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                Router.push("/profile");
                handleMenuClose();
            }}>
                <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
                Router.push("/orders");
                handleMenuClose();
            }}>
                <ListItemIcon>
                    <LocalShippingIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>My Orders</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={async () => {
                await signout({
                    onSuccess: () => {
                        Router.push("/");
                        Router.reload();
                    }
                });
                handleMenuClose();
            }}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
            </MenuItem>
        </Menu>
    );

    const renderMobileMoreMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMoreMenuOpen}
            onClose={handleMobileMoreMenuClose}
        >
            <MenuItem onClick={(event) => currentUser ? handleProfileMenuOpen(event) : Router.push("/auth/signin")}>
                <ListItemIcon>
                    {currentUser ? <AccountCircleIcon fontSize="small" /> : <LoginIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText>{currentUser ? "Account" : "Sign In"}</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon onClick={() => Router.push("/cart")}>
                    <Badge badgeContent={totalUniqueItems} color="error">
                        <ShoppingCartIcon size="small" />
                    </Badge>
                </ListItemIcon>
                <ListItemText>Cart</ListItemText>
            </MenuItem>
        </Menu>
    );

    useEffect(() => {
        if (!!currentUser) {
            getProfileImage(currentUser.profileImage)
                .then((profileImage) => setProfileImage(profileImage));
        }
        validateCartItems(items, removeItem);
        getAllCategories()
            .then((categories) => setCategories(categories.map((category) => category.name)));
    }, []);

    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        onClick={handleSideNavOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        color="inherit"
                        sx={{ textDecoration: 'none', display: { xs: 'none', sm: 'block' }, ml: 2 }}
                    >
                        SKY E-Commerce
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            variant="contained"
                            disableElevation
                            size="large"
                            startIcon={(!!currentUser) ? <Avatar src={profileImage} sx={{ width: 36, height: 36 }} /> : <LoginIcon />}
                            endIcon={(!!currentUser) && <KeyboardArrowDownIcon />}
                            onClick={(!!currentUser) ? handleProfileMenuOpen : () => Router.push("/auth/signin")}
                            sx={{ textTransform: "none" }}
                        >
                            {currentUser ? "Hello, " + currentUser.firstname : "Sign In"}
                        </Button>
                        <IconButton color="inherit" onClick={() => Router.push("/cart")}>
                            <Badge badgeContent={totalUniqueItems} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            onClick={handleMobileMoreMenuOpen}
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={sideNavOpen}
            >
                <DrawerHeader>
                    <IconButton onClick={handleSideNavClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List component="nav">
                    <ListSubheader component="div" sx={{ fontSize: 16, fontWeight: 500 }}>
                        Shop By
                    </ListSubheader>
                    <ListItemButton component="a" href="/products?sortBy=Rating">
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary="Rating" />
                    </ListItemButton>
                    <ListItemButton component="a" href="/products?sortBy=Latest">
                        <ListItemIcon>
                            <FiberNewIcon />
                        </ListItemIcon>
                        <ListItemText primary="Latest" />
                    </ListItemButton>
                    <ListItemButton component="a" href="/products?sortBy=Discount">
                        <ListItemIcon>
                            <DiscountIcon />
                        </ListItemIcon>
                        <ListItemText primary="Discount" />
                    </ListItemButton>
                    <ListItemButton onClick={handleCategoryDropdownClick}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Category" />
                        {categoryDropdownOpen ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />}
                    </ListItemButton>
                    <Collapse in={categoryDropdownOpen} timeout="auto" unmountOnExit>
                        {categories.map((category) => (
                            <List key={category} component="div" disablePadding>
                                <ListItemButton component="a" href={`/products?category=${category}`} sx={{ pl: 9 }}>
                                    <ListItemText secondary={category} />
                                </ListItemButton>
                            </List>
                        ))}
                    </Collapse>
                </List>
                {(!!currentUser && currentUser.roles.includes("admin")) && (
                    <>
                        <Divider />
                        <List component="nav">
                            <ListSubheader component="div" sx={{ fontSize: 16, fontWeight: 500 }}>
                                Admin
                            </ListSubheader>
                            <ListItemButton component="a" href="/admin/categories">
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Categories" />
                            </ListItemButton>
                            <ListItemButton component="a" href="/admin/products">
                                <ListItemIcon>
                                    <InventoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="Products" />
                            </ListItemButton>
                            <ListItemButton component="a" href="/admin/orders">
                                <ListItemIcon>
                                    <LocalShippingIcon />
                                </ListItemIcon>
                                <ListItemText primary="Orders" />
                            </ListItemButton>
                            <ListItemButton component="a" href="/admin/payments">
                                <ListItemIcon>
                                    <PaymentsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Payments" />
                            </ListItemButton>
                        </List>
                    </>
                )}
            </Drawer>
            {renderMobileMoreMenu}
            {renderProfileMenu}
        </Box>
    );
};

export default withCurrentUser(Navigation);