import type { FC } from 'react';
import {
  Card,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { TransactionResponse } from '../../../services/types';
import { formatEtherWithUnit, truncateAddress } from '../../../utils';
import { NavPaths } from '../../../config';

export interface TransactionsListProps {
  transactions: TransactionResponse[];
  title: string;
}

const TransactionsList: FC<TransactionsListProps> = ({ transactions, title, ...props }) => (
  <Card {...props}>
    <CardHeader title={title} />
    <Table>
      <TableHead className="visually-hidden">
        <TableRow>
          <TableCell />
          <TableCell>Txn Hash</TableCell>
          <TableCell>From/To</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={`tx${transaction.hash}`}>
            <TableCell width={25}>
              <ReceiptIcon />
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="body2">
                <div title={transaction.hash}>
                  <a href={`${NavPaths.TRANSACTION}/${transaction.hash}`}>
                    {truncateAddress(transaction.hash)}
                  </a>
                </div>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" title={transaction.from} variant="body2">
                From {truncateAddress(transaction.from)}
              </Typography>
              {transaction.to && (
                <Typography color="textSecondary" title={transaction.to} variant="body2">
                  To {truncateAddress(transaction.to)}
                </Typography>
              )}
            </TableCell>

            <TableCell width={100}>
              <Chip label={formatEtherWithUnit(transaction.value)} variant="outlined" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Card>
);

export default TransactionsList;
