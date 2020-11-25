import { Transaction } from 'bitcoinjs-lib';
import React from 'react';
import { Input } from 'bitcoinjs-lib/types/transaction';
import App from '../App';
import { hash_to_hex } from '../Detail/Hex';
import { ContractModel } from './ContractManager';

const { ipcRenderer } = window.require('electron');
type TXID = string;

export function call(method: string, args: any) {
    return fetch(method, {
        method: 'post',
        body: JSON.stringify(args),
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());
}

interface IProps {
    app: App;
    current_contract: ContractModel;
}

interface IState {}

export function update_broadcastable(
    current_contract: ContractModel,
    confirmed_txs: Set<TXID>
) {
    current_contract.txn_models.forEach((tm) => {
        const already_confirmed = confirmed_txs.has(tm.get_txid());
        const inputs_not_locals = tm.tx.ins.every(
            (inp: Input) =>
                !current_contract.txid_map.has_by_txid(hash_to_hex(inp.hash))
        );
        const all_inputs_confirmed = tm.tx.ins.every((inp: Input) =>
            confirmed_txs.has(hash_to_hex(inp.hash))
        );
        if (already_confirmed) {
            tm.set_broadcastable(false);
        } else if (inputs_not_locals) {
            tm.set_broadcastable(true);
        } else if (all_inputs_confirmed) {
            tm.set_broadcastable(true);
        } else {
            tm.set_broadcastable(false);
        }
    });
}

/*
Currently non-functional, needs a server to be running somewhere.

Should be upgraded to a socket managed driver that does not use polling.
*/
export class BitcoinNodeManager extends React.Component<IProps, IState> {
    mounted: boolean;

    next_periodic_check: NodeJS.Timeout | null;

    constructor(props: IProps) {
        super(props);
        this.mounted = false;
        this.next_periodic_check = null;
    }

    componentDidMount() {
        this.mounted = true;
        setTimeout(this.periodic_check.bind(this), 1000);
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.next_periodic_check != null)
            clearTimeout(this.next_periodic_check);
    }

    async periodic_check() {
        const contract = this.props.current_contract;
        if (!contract) {
            this.next_periodic_check = setTimeout(
                this.periodic_check.bind(this),
                1000
            );
        }
        const is_tx_confirmed = await this.check_txs(contract);
        const confirmed_txs: Set<TXID> = new Set();
        if (is_tx_confirmed.length > 0) {
            is_tx_confirmed.forEach((txid: TXID) => confirmed_txs.add(txid));
            update_broadcastable(contract, confirmed_txs);
            this.props.current_contract.process_finality(
                is_tx_confirmed,
                this.props.app.model
            );
            this.props.app.forceUpdate();
        }
        if (this.mounted) {
            this.next_periodic_check = setTimeout(
                this.periodic_check.bind(this),
                5000 * 60
            );
        }
    }

    async broadcast(tx: Transaction) {
        await ipcRenderer.invoke('bitcoin-command', [
            { method: 'getrawtransaction', parameters: [tx.toHex()] },
        ]);
    }

    async fund_out(tx: Transaction): Promise<Transaction> {
        const result = await ipcRenderer.invoke('bitcoin-command', [
            { method: 'fundrawtransaction', parameters: [tx.toHex()] },
        ]);
        const hex: string = result[0].hex;
        return Transaction.fromHex(hex);
    }

    async fetch_utxo(t: TXID, n: number): Promise<any> {
        const txout = await ipcRenderer.invoke('bitcoin-command', [
            { method: 'gettxout', parameters: [t, n] },
        ]);
        console.log(txout);
        return txout;
    }

    async check_txs(current_contract: ContractModel): Promise<Array<TXID>> {
        // TODO: SHould query by WTXID
        const txids = current_contract.txn_models
            .filter((tm) => tm.is_broadcastable())
            .map((tm) => ({
                method: 'getrawtransaction',
                parameters: [tm.get_txid()],
            }));
        if (txids.length > 0) {
            const results = await ipcRenderer.invoke('bitcoin-command', txids);
            console.log('RESULTS', results);
        }
        return [];
    }

    render() {
        return null;
    }
}
