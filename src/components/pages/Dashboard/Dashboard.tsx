import { FC, useEffect, useState } from 'react';
import { Box, Container, Grid, Stack, TextField, Typography, Button } from '@mui/material';
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

  useEffect(() => {
    dispatch(fetchLatestBlocks());
    dispatch(fetchLatestTransactions());
  }, [dispatch]);

  const { ask } = useChatbot({ setLoading, setResponse, prompt });

  const {
    latestBlocks: { data: latestBlocks },
    latestTransactions: { data: latestTransactions },
  } = useAppSelector((state) => state);

  return (
    <>
      <Stack
        direction={'row'}
        gap={3}
        padding={4}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <form>
          <Stack direction={'row'} gap={3}>
            <TextField
              onChange={(event: any) => setPrompt(event.target.value)}
              value={prompt}
              placeholder="Type your message..."
              size="small"
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              style={{ width: '220px' }}
            />
            <Button
              onClick={(event) => {
                ask();
                event.stopPropagation();
              }}
              variant="contained"
              disabled={loading}
              type="submit"
            >
              Ask
            </Button>
          </Stack>
        </form>
        <Stack direction={'row'}>
          <Typography>
            {!!response?.length && 'Response:'} {response}
          </Typography>
        </Stack>
      </Stack>
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
        <a href="https://www.cristian-sfetcu.com" target="_blank">
          Cristian Sfetcu
        </a>
      </Typography>
    </>
  );
};

export default Dashboard;
