import { UserInput } from "pages/business/components/PaymentForm";
import create from "zustand";

export interface WalletState {
	walletAddress: string;
	setWalletAddress: (wallet: string) => void;
}
export interface transactionState {
	transactions: UserInput[];
	setTransactions: (newTrx: any) => void;
	fixed: UserInput[];
	setFixed: (newTrx: any) => void;
	recurring: UserInput[];
	setRecurring: (newTrx: any) => void;
	stream: UserInput[];
	setStream: (newTrx: any) => void;
}

export const useWallet = create<WalletState>((set) => ({
	walletAddress: "",
	setWalletAddress: (wallet) => set(() => ({ walletAddress: wallet })),
}));

export const useTransactions = create<transactionState>((set) => ({
	transactions: [],
	fixed: [],
	recurring: [],
	stream: [],
	setTransactions: (newTransactions) => set({ transactions: newTransactions }),
	setFixed: (newTrx) => set({ fixed: newTrx, transactions: newTrx }),
	setRecurring: (newTrx) => set({ recurring: newTrx, transactions: newTrx }),
	setStream: (newTrx) => set({ stream: newTrx, transactions: newTrx }),
}));
