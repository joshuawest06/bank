import { useCallback, useEffect, useMemo, useState } from 'react';
import { Contract } from 'ethers';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { useEthersSigner } from '../hooks/useEthersSigner';
import { useZamaInstance } from '../hooks/useZamaInstance';
import {
  FIXED_TERM_BANK,
  MOCK_USDT,
  TERM_OPTIONS,
  type TermOption,
} from '../config/contracts';
import '../styles/BankApp.css';

type DepositView = {
  id: bigint;
  months: number;
  principal: bigint;
  interest: bigint;
  startTimestamp: bigint;
  maturityTimestamp: bigint;
  withdrawn: boolean;
  termLabel: string;
};

type DecryptionContext = {
  userAddress: `0x${string}`;
  keyPair: { publicKey: string; privateKey: string };
  signature: string;
  startTimestamp: string;
  durationDays: string;
  contractAddresses: string[];
};

export function BankApp() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const signer = useEthersSigner();
  const {
    instance: fheInstance,
    isLoading: isFheInitializing,
    error: fheError,
  } = useZamaInstance();

  const [balance, setBalance] = useState('--');
  const [mintAmount, setMintAmount] = useState('100');
  const [depositAmount, setDepositAmount] = useState('100');
  const [selectedTerm, setSelectedTerm] = useState<TermOption>(TERM_OPTIONS[0]);
  const [deposits, setDeposits] = useState<DepositView[]>([]);
  const [currentTime, setCurrentTime] = useState<bigint>(0n);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<bigint | null>(null);
  const [decryptionContext, setDecryptionContext] = useState<DecryptionContext | null>(null);
  const [isBalanceDecrypting, setIsBalanceDecrypting] = useState(false);

  const previewInterest = useMemo(() => {
    try {
      const amount = parseUnits(depositAmount || '0', MOCK_USDT.decimals);
      if (amount <= 0n) {
        return '0.00';
      }

      const interest = (amount * BigInt(selectedTerm.months)) / 100n;
      return formatUnits(interest, MOCK_USDT.decimals);
    } catch (err) {
      return '0.00';
    }
  }, [depositAmount, selectedTerm]);

  const resetMessages = () => {
    setStatusMessage(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    setDecryptionContext(null);
    setBalance('--');
  }, [address]);

  const ensureSigner = useCallback(async () => {
    const signerInstance = await signer;
    if (!signerInstance) {
      throw new Error('Please connect a wallet to continue');
    }
    return signerInstance;
  }, [signer]);

  const ensureDecryptionContext = useCallback(async (): Promise<DecryptionContext> => {
    if (!fheInstance) {
      throw new Error('FHE instance unavailable');
    }

    const signerInstance = await signer;
    if (!signerInstance) {
      throw new Error('Signer unavailable');
    }

    const userAddress = (await signerInstance.getAddress()) as `0x${string}`;

    if (decryptionContext && decryptionContext.userAddress === userAddress) {
      return decryptionContext;
    }

    const keyPair = fheInstance.generateKeypair();
    const startTimestamp = Math.floor(Date.now() / 1000).toString();
    const durationDays = '7';
    const contractAddresses = [MOCK_USDT.address];

    const eip712 = fheInstance.createEIP712(
      keyPair.publicKey,
      contractAddresses,
      startTimestamp,
      durationDays
    );

    const signature = await signerInstance.signTypedData(
      eip712.domain,
      {
        UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
      },
      eip712.message
    );

    const context: DecryptionContext = {
      userAddress,
      keyPair,
      signature,
      startTimestamp,
      durationDays,
      contractAddresses,
    };

    setDecryptionContext(context);
    return context;
  }, [decryptionContext, fheInstance, signer]);

  const decryptTokenHandle = useCallback(
    async (handle: string): Promise<bigint> => {
    if (!fheInstance) {
      throw new Error('FHE instance unavailable');
    }

      const context = await ensureDecryptionContext();
      const normalizedHandle = handle.toLowerCase() as `0x${string}`;

      const result = await fheInstance.userDecrypt(
        [
          {
            handle: normalizedHandle,
            contractAddress: MOCK_USDT.address,
          },
        ],
        context.keyPair.privateKey,
        context.keyPair.publicKey,
        context.signature,
        context.contractAddresses,
        context.userAddress,
        context.startTimestamp,
        context.durationDays
      );

      const decrypted = result[normalizedHandle];
      if (typeof decrypted !== 'bigint') {
        throw new Error('Failed to decrypt token balance');
      }

      return decrypted;
    },
    [ensureDecryptionContext, fheInstance]
  );

  const fetchData = useCallback(async () => {
    if (!address || !publicClient) {
      setBalance('--');
      setDeposits([]);
      return;
    }

    setIsLoading(true);

    try {
      const account = address as `0x${string}`;

      const [balanceHandle, depositIds, latestBlock] = await Promise.all([
        publicClient.readContract({
          address: MOCK_USDT.address,
          abi: MOCK_USDT.abi,
          functionName: 'confidentialBalanceOf',
          args: [account],
        }) as Promise<string>,
        publicClient.readContract({
          address: FIXED_TERM_BANK.address,
          abi: FIXED_TERM_BANK.abi,
          functionName: 'getUserDepositIds',
          args: [account],
        }) as Promise<readonly bigint[]>,
        publicClient.getBlock({ blockTag: 'latest' }),
      ]);

      const now = latestBlock?.timestamp ?? BigInt(Math.floor(Date.now() / 1000));
      setCurrentTime(now);

      if (balanceHandle && fheInstance && signer) {
        try {
          setIsBalanceDecrypting(true);
          const decrypted = await decryptTokenHandle(balanceHandle);
          setBalance(formatUnits(decrypted, MOCK_USDT.decimals));
        } catch (decryptionError) {
          console.error('Balance decryption failed', decryptionError);
          setBalance('--');
        } finally {
          setIsBalanceDecrypting(false);
        }
      } else {
        setBalance('--');
      }

      const ids = Array.isArray(depositIds) ? depositIds : [];

      const depositViews = await Promise.all(
        ids.map(async (id) => {
          const [rawDeposit, maturity] = await Promise.all([
            publicClient.readContract({
              address: FIXED_TERM_BANK.address,
              abi: FIXED_TERM_BANK.abi,
              functionName: 'getDeposit',
              args: [id],
            }) as Promise<{
              owner: `0x${string}`;
              amount: bigint;
              startTimestamp: bigint;
              duration: bigint;
              months: number;
              withdrawn: boolean;
            }>,
            publicClient.readContract({
              address: FIXED_TERM_BANK.address,
              abi: FIXED_TERM_BANK.abi,
              functionName: 'maturityTimestamp',
              args: [id],
            }) as Promise<bigint>,
          ]);

          const months = typeof rawDeposit.months === 'number'
            ? rawDeposit.months
            : Number(rawDeposit.months);

          const interest = (rawDeposit.amount * BigInt(months)) / 100n;
          const term = TERM_OPTIONS.find((option) => option.months === months) ?? TERM_OPTIONS[0];

          return {
            id,
            months,
            principal: rawDeposit.amount,
            interest,
            startTimestamp: BigInt(rawDeposit.startTimestamp),
            maturityTimestamp: maturity,
            withdrawn: rawDeposit.withdrawn,
            termLabel: term.label,
          } satisfies DepositView;
        })
      );

      depositViews.sort((a, b) => (a.id > b.id ? -1 : 1));
      setDeposits(depositViews);
      setErrorMessage(null);
    } catch (err) {
      console.error('Failed to load account data', err);
      setErrorMessage('Unable to load balances right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [address, decryptTokenHandle, fheInstance, publicClient, signer]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleMint = useCallback(async () => {
    resetMessages();

    if (!isConnected) {
      setErrorMessage('Connect a wallet to mint tokens');
      return;
    }

    let parsedAmount: bigint;
    try {
      parsedAmount = parseUnits(mintAmount || '0', MOCK_USDT.decimals);
    } catch (err) {
      setErrorMessage('Enter a valid mint amount');
      return;
    }

    if (parsedAmount <= 0n) {
      setErrorMessage('Mint amount must be greater than zero');
      return;
    }

    setIsMinting(true);

    try {
      const signerInstance = await ensureSigner();
      const token = new Contract(MOCK_USDT.address, MOCK_USDT.abi, signerInstance);
      const tx = await token.mint(parsedAmount);
      await tx.wait();
      setStatusMessage(`Minted ${mintAmount} mUSDT successfully`);
      await fetchData();
    } catch (err: any) {
      console.error('Mint failed', err);
      setErrorMessage(err?.message ?? 'Failed to mint tokens');
    } finally {
      setIsMinting(false);
    }
  }, [ensureSigner, fetchData, isConnected, mintAmount]);

  const ensureOperator = useCallback(
    async (signerInstance: Awaited<ReturnType<typeof ensureSigner>>, bankAddress: `0x${string}`) => {
      if (!publicClient) {
        throw new Error('Public client unavailable, check your connection');
      }

      const signerAddress = (await signerInstance.getAddress()) as `0x${string}`;
      const hasOperator = await publicClient.readContract({
        address: MOCK_USDT.address,
        abi: MOCK_USDT.abi,
        functionName: 'isOperator',
        args: [signerAddress, bankAddress],
      });

      if (!hasOperator) {
        const token = new Contract(MOCK_USDT.address, MOCK_USDT.abi, signerInstance);
        const expiry = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
        const approvalTx = await token.setOperator(bankAddress, expiry);
        await approvalTx.wait();
        return true;
      }

      return false;
    },
    [publicClient]
  );

  const handleDeposit = useCallback(async () => {
    resetMessages();

    if (!isConnected || !address) {
      setErrorMessage('Connect a wallet to create a deposit');
      return;
    }

    if (!publicClient) {
      setErrorMessage('Public client unavailable, check your connection');
      return;
    }

    let amountUnits: bigint;
    try {
      amountUnits = parseUnits(depositAmount || '0', MOCK_USDT.decimals);
    } catch (err) {
      setErrorMessage('Enter a valid deposit amount');
      return;
    }

    if (amountUnits <= 0n) {
      setErrorMessage('Deposit amount must be greater than zero');
      return;
    }

    setIsDepositing(true);

    try {
      const signerInstance = await ensureSigner();
      const token = new Contract(MOCK_USDT.address, MOCK_USDT.abi, signerInstance);
      const bank = new Contract(FIXED_TERM_BANK.address, FIXED_TERM_BANK.abi, signerInstance);
      const bankAddress = (await bank.getAddress()) as `0x${string}`;

      const operatorGranted = await ensureOperator(signerInstance, bankAddress);

      const tx = await bank.deposit(amountUnits, selectedTerm.value);
      await tx.wait();

      const principalText = formatUnits(amountUnits, MOCK_USDT.decimals);
      const approvalText = operatorGranted ? ' Operator approval granted. ' : '';
      setStatusMessage(
        `${approvalText}Deposited ${principalText} mUSDT for ${selectedTerm.label}`.trim()
      );
      await fetchData();
    } catch (err: any) {
      console.error('Deposit failed', err);
      setErrorMessage(err?.message ?? 'Failed to create deposit');
    } finally {
      setIsDepositing(false);
    }
  }, [
    address,
    depositAmount,
    ensureOperator,
    ensureSigner,
    fetchData,
    isConnected,
    publicClient,
    selectedTerm.label,
    selectedTerm.value,
  ]);

  const handleWithdraw = useCallback(
    async (depositId: bigint) => {
      resetMessages();

      if (!isConnected) {
        setErrorMessage('Connect a wallet to withdraw');
        return;
      }

      setWithdrawingId(depositId);

      try {
        const signerInstance = await ensureSigner();
        const bank = new Contract(FIXED_TERM_BANK.address, FIXED_TERM_BANK.abi, signerInstance);
        const tx = await bank.withdraw(depositId);
        await tx.wait();
        setStatusMessage(`Withdrawal for deposit #${depositId.toString()} completed`);
        await fetchData();
      } catch (err: any) {
        console.error('Withdraw failed', err);
        setErrorMessage(err?.message ?? 'Failed to withdraw deposit');
      } finally {
        setWithdrawingId(null);
      }
    },
    [ensureSigner, fetchData, isConnected]
  );

  const formatDate = (timestamp: bigint) => {
    if (timestamp === 0n) {
      return '-';
    }

    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString();
  };

  const balanceNote = useMemo(() => {
    if (!isConnected) {
      return 'Connect wallet to view balance';
    }
    if (isFheInitializing) {
      return 'Initializing Zama relayer client';
    }
    if (fheError) {
      return 'Failed to initialize Zama relayer';
    }
    if (!fheInstance) {
      return 'Zama relayer unavailable';
    }
    if (isBalanceDecrypting) {
      return 'Decrypting ciphertext...';
    }
    if (!decryptionContext) {
      return 'Sign the decrypt request to view balance';
    }
    return 'Balance decrypted via Zama relayer';
  }, [decryptionContext, fheInstance, isBalanceDecrypting, isConnected]);

  return (
    <div className="bank-app">
      <section className="bank-intro">
        <h2>Earn predictable returns with mockUSDT</h2>
        <p>
          Mint tokens freely, choose a fixed-term deposit, and collect interest once your
          position matures. Every month adds 1% yield on the locked principal.
        </p>
      </section>

      {statusMessage && <div className="status-banner success">{statusMessage}</div>}
      {errorMessage && <div className="status-banner error">{errorMessage}</div>}

      <section className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Wallet balance</span>
          <span className="stat-value">{balance} mUSDT</span>
          <span className="stat-note">{balanceNote}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Selected term</span>
          <span className="stat-value">{selectedTerm.label}</span>
          <span className="stat-note">Total yield: {selectedTerm.months}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Projected interest</span>
          <span className="stat-value">{previewInterest} mUSDT</span>
          <span className="stat-note">Based on deposit amount</span>
        </div>
      </section>

      <section className="actions-grid">
        <div className="action-card">
          <div className="action-headline">
            <h3>Mint mockUSDT</h3>
            <p>Mint tokens to your wallet before opening a fixed-term position.</p>
          </div>
          <label className="form-label" htmlFor="mint-amount">
            Amount (mUSDT)
          </label>
          <input
            id="mint-amount"
            className="form-input"
            value={mintAmount}
            onChange={(event) => setMintAmount(event.target.value)}
            placeholder="100"
            inputMode="decimal"
          />
          <button
            type="button"
            className="primary-button"
            onClick={handleMint}
            disabled={!isConnected || isMinting}
          >
            {isMinting ? 'Minting...' : 'Mint tokens'}
          </button>
        </div>

        <div className="action-card">
          <div className="action-headline">
            <h3>Open a fixed-term deposit</h3>
            <p>Select a duration and deposit your mockUSDT to earn 1% per month.</p>
          </div>

          <span className="form-label">Term</span>
          <div className="term-options">
            {TERM_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`term-option ${selectedTerm.value === option.value ? 'active' : ''}`}
                onClick={() => setSelectedTerm(option)}
              >
                <span className="term-label">{option.label}</span>
                <span className="term-sub">{option.months}% total interest</span>
              </button>
            ))}
          </div>

          <label className="form-label" htmlFor="deposit-amount">
            Deposit amount (mUSDT)
          </label>
          <input
            id="deposit-amount"
            className="form-input"
            value={depositAmount}
            onChange={(event) => setDepositAmount(event.target.value)}
            placeholder="100"
            inputMode="decimal"
          />

          <div className="preview-line">
            <span>Projected interest:</span>
            <strong>{previewInterest} mUSDT</strong>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={handleDeposit}
            disabled={!isConnected || isDepositing}
          >
            {isDepositing ? 'Depositing...' : 'Confirm deposit'}
          </button>
        </div>
      </section>

      <section className="deposits-section">
        <div className="section-header">
          <h3>Your deposits</h3>
          <button
            type="button"
            className="secondary-button"
            onClick={() => void fetchData()}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {!isLoading && deposits.length === 0 && (
          <div className="empty-state">
            <span>No deposits yet.</span>
            <p>Mint mockUSDT and open your first position to start earning.</p>
          </div>
        )}

        {isLoading && deposits.length === 0 && (
          <div className="empty-state">
            <span>Loading your deposits...</span>
          </div>
        )}

        {deposits.length > 0 && (
          <div className="deposit-list">
            {deposits.map((deposit) => {
              const principal = formatUnits(deposit.principal, MOCK_USDT.decimals);
              const interest = formatUnits(deposit.interest, MOCK_USDT.decimals);
              const matured =
                deposit.withdrawn || (currentTime !== 0n && currentTime >= deposit.maturityTimestamp);

              return (
                <div className="deposit-card" key={deposit.id.toString()}>
                  <div className="deposit-meta">
                    <div>
                      <span className="meta-label">Principal</span>
                      <span className="meta-value">{principal} mUSDT</span>
                    </div>
                    <div>
                      <span className="meta-label">Interest</span>
                      <span className="meta-value">{interest} mUSDT</span>
                    </div>
                    <div>
                      <span className="meta-label">Term</span>
                      <span className="meta-value">{deposit.termLabel}</span>
                    </div>
                  </div>

                  <div className="deposit-dates">
                    <div>
                      <span className="meta-label">Started</span>
                      <span className="meta-value">{formatDate(deposit.startTimestamp)}</span>
                    </div>
                    <div>
                      <span className="meta-label">Matures</span>
                      <span className={`meta-value ${matured ? 'matured' : ''}`}>
                        {formatDate(deposit.maturityTimestamp)}
                      </span>
                    </div>
                    <div>
                      <span className="meta-label">Status</span>
                      <span className="meta-value">
                        {deposit.withdrawn ? 'Withdrawn' : matured ? 'Matured' : 'Locked'}
                      </span>
                    </div>
                  </div>

                  <div className="deposit-actions">
                    <span className="deposit-id">#{deposit.id.toString()}</span>
                    <button
                      type="button"
                      className="secondary-button"
                      disabled={!matured || deposit.withdrawn || withdrawingId === deposit.id}
                      onClick={() => void handleWithdraw(deposit.id)}
                    >
                      {withdrawingId === deposit.id ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
