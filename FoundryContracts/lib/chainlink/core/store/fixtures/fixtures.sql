INSERT INTO users (email, hashed_password, token_hashed_secret, created_at, updated_at) VALUES (
    'apiuser@chainlink.test',
    '$2a$10$bUMgzjxp1Jtaq4nt5ICPB.fWsfVP6FpdxXB1ZOsI0t9je0JOIkpRW', -- hash of literal string '16charlengthp4SsW0rD1!@#_'
    '1eCP/w0llVkchejFaoBpfIGaLRxZK54lTXBCT22YLW+pdzE4Fafy/XO5LoJ2uwHi',
    '2019-01-01',
    '2019-01-01'
);

INSERT INTO evm_chains (id, created_at, updated_at) VALUES (0, NOW(), NOW());

INSERT INTO evm_nodes (name, evm_chain_id, ws_url, http_url, send_only, created_at, updated_at) VALUES (
    'eth-test-ws-only-0',
    0,
    'ws://example.invalid',
    null,
    false,
    NOW(),
    NOW()
);

-- This disabled chain is inserted to avoid foreign key errors for simulated blockchain tests using chain ID 1337
INSERT INTO evm_chains (id, created_at, updated_at, enabled) VALUES (1337, NOW(), NOW(), false);
