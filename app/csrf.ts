import csrf from "csrf";
const tokens = new csrf();
const secret = tokens.secretSync();

export const verifyCsrfToken = (token: string) => {
    return tokens.verify(secret, token);
}

export const generateCsrfToken = () => {
    return tokens.create(secret);
}