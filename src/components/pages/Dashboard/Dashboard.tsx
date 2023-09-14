import { FC, useEffect, useState } from 'react';
import { Box, Container, Grid, Stack, TextField, Typography, Button, Link } from '@mui/material';
import { TransactionsList } from '../../organisms/TransactionsList';
import { BlocksList } from '../../organisms/BlocksList';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { fetchLatestBlocks } from '../../../services/latestBlocks';
import { fetchLatestTransactions } from '../../../services/latestTransactions';
import useChatbot from '../../../hooks/openai';

const Dashboard: FC = () => {
  const dispatch = useAppDispatch();

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>('');
  const [loading, setLoading] = useState(false);

  const { ask, startAsk } = useChatbot({ setLoading, setResponse, prompt });

  useEffect(() => {
    dispatch(fetchLatestBlocks());
    dispatch(fetchLatestTransactions());
  }, [dispatch]);

  useEffect(() => {
    startAsk({ __setLoading: setLoading, __setResponse: setResponse, __prompt: 'Hey there' });
  }, []);

  const {
    latestBlocks: { data: latestBlocks },
    latestTransactions: { data: latestTransactions },
  } = useAppSelector((state) => state);

  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={4} pb={4} pt={4} alignContent={'center'}>
          <Grid item md={4} xs={12}>
            <form>
              <Stack direction={'row'} gap={3}>
                <TextField
                  onChange={(event: any) => setPrompt(event.target.value)}
                  value={prompt}
                  placeholder="Type your message..."
                  size="small"
                  style={{ width: '250px' }}
                />
                <Button
                  size="small"
                  onClick={ask}
                  variant="contained"
                  disabled={loading}
                  type="submit"
                >
                  Ask
                </Button>
              </Stack>
            </form>
          </Grid>
          <Grid item md={8} xs={12} alignItems={'center'}>
            <Typography style={{ marginTop: '10px' }}>{response}</Typography>
          </Grid>
        </Grid>
      </Container>
      <Box component="main">
        <Container maxWidth="xl">
          <Grid container spacing={4} pb={4} pt={4}>
            <Grid item md={6} xs={12}>
              {latestBlocks?.blocks && (
                <BlocksList title="Latest Blocks" blocks={latestBlocks.blocks} />
              )}
            </Grid>
            <Grid item md={6} xs={12}>
              {latestTransactions?.transactions && (
                <TransactionsList
                  title="Latest Transactions"
                  transactions={latestTransactions.transactions}
                />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Typography padding={4}>
        Created by{' '}
        <Link href="https://www.cristian-sfetcu.com" target="_blank">
          Cristian Sfetcu
        </Link>
      </Typography>
    </>
  );
};

export default Dashboard;
