package com.example.securevoteledger.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.response.PollingTransactionReceiptProcessor;
import org.web3j.utils.Convert;

import java.math.BigInteger;
import java.util.Collections;

@Service
public class EthereumService {

    private final Web3j web3j;
    private final Credentials credentials;
    private final String contractAddress;

    public EthereumService(
        @Value("${ethereum.rpcUrl:}") String rpcUrl,
        @Value("${ethereum.privateKey:}") String privateKey,
        @Value("${ethereum.contractAddress:}") String contractAddress
    ) {

        if (privateKey == null || privateKey.isBlank() || privateKey.equals("dummy")) {
            System.out.println("Ethereum disabled - no valid private key");
            this.web3j = null;
            this.credentials = null;
            this.contractAddress = null;
            return;
        }

        this.web3j = Web3j.build(new HttpService(rpcUrl));
        this.credentials = Credentials.create(privateKey);
        this.contractAddress = contractAddress;
    }

    public void storeVoteHash(String voteHash) {

        try {

            System.out.println("📤 Sending vote hash to Ethereum...");

            Function function = new Function(
                    "storeVote",
                    Collections.singletonList(new Utf8String(voteHash)),
                    Collections.emptyList()
            );

            String encodedFunction = FunctionEncoder.encode(function);

            RawTransactionManager transactionManager =
                new RawTransactionManager(web3j, credentials);

            EthSendTransaction transactionResponse =
                    transactionManager.sendTransaction(
                            Convert.toWei("20", Convert.Unit.GWEI).toBigInteger(),
                            BigInteger.valueOf(3_000_000),
                            contractAddress,
                            encodedFunction,
                            BigInteger.ZERO
                    );

            if (transactionResponse.hasError()) {
                System.out.println("❌ Ethereum Error: " +
                        transactionResponse.getError().getMessage());
                return;
            }

            String txHash = transactionResponse.getTransactionHash();

            System.out.println("⏳ Waiting for transaction receipt...");

            PollingTransactionReceiptProcessor receiptProcessor =
                    new PollingTransactionReceiptProcessor(web3j, 1000, 15);

            TransactionReceipt receipt =
                    receiptProcessor.waitForTransactionReceipt(txHash);

            System.out.println("✅ Stored on Ethereum!");
            System.out.println("TX Hash: " + receipt.getTransactionHash());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}