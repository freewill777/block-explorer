import { FC, useEffect, useState } from 'react';
import { Box, Container, Grid, Stack, TextField, Typography, Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
      <Stack gap={2} padding={2}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Stack direction={'row'} gap={3} alignItems={'center'} justifyContent={'space-between'}>
              <TextField
                onChange={(event: any) => setPrompt(event.target.value)}
                value={prompt}
                placeholder="Type your message..."
                size="small"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
              />
              <Button
                onClick={(event) => {
                  ask();
                  event.stopPropagation();
                }}
                variant="contained"
                disabled={loading}
              >
                Ask
              </Button>
              <Stack direction={'row'}>
                <Typography>
                  {!!response?.length && 'Response:'} {response}
                </Typography>
              </Stack>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{response}</Typography>
          </AccordionDetails>
        </Accordion>
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
    </>
  );
};

export default Dashboard;
