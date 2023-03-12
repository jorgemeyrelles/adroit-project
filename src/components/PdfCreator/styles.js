/* eslint-disable import/prefer-default-export */
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '105px 1fr',
    gap: 16,

    width: '100%',
  },
  sidebar: {
    width: 105,
    padding: 10,
    border: '1px solid #EEEEEE',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    textAlign: '-webkit-center',
  },
  contentEmpty: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '4rem',
  },
  content: {
    display: 'grid',
    alignContent: 'flex-start',
    gridTemplateColumns: 'repeat(3, 1fr)',
    marginLeft: '1.25rem',
    gap: 16,
  },
  table: {
    minWidth: 650,
  },
}));

export { useStyles };
