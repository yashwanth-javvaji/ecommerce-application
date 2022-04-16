// Material UI
// Components
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
// Icons
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

// Custom
// Utils
import { specialCharacters } from '../../utils/auth/password-strength';


const PasswordStrength = ({ passwordStrength }) => {
  const { score, label, color, attributes, warning } = passwordStrength;

  return (
    <Grid container spacing={0} component={Paper} elevation={2} m={0} mt={1} p={1} sx={{ width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
      <Grid item xs p={1}>
        <LinearProgress variant='determinate' value={score * 25} />
      </Grid>
      <Grid item xs='auto' p={1}>
        <Typography variant='overline' style={{ color, fontWeight: 700 }}>{label}</Typography>
      </Grid>
      {(!!warning) && (
        <Grid item xs={12} p={1}>
          <Typography variant='body2' style={{ color: '#ff9800' }}>{warning}</Typography>
        </Grid>
      )}
      {Object.entries(attributes).map(([key, value], index) => {
        const color = value ? 'green' : 'red';

        return (
          <Grid key={key} item xs={12} px={1} py={0.75} sx={{ display: 'flex', alignItems: 'center' }}>
            {(!!value) ? <CheckIcon sx={{ color }} /> : <CloseIcon sx={{ color }} />}
            <Typography variant="body2" ml={1} style={{ color, lineHeight: 1.25 }}>
              {key}
            </Typography>
            {(index + 1 === Object.keys(attributes).length) && (
              <Tooltip title={specialCharacters.join(", ")}>
                <IconButton>
                  <InfoIcon fontSize="small" sx={{ color }}  />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PasswordStrength;