const uuid = require("uuid");
const ursa = require("ursa");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(12);

function verifyUsers(sender, recipients, users) {
    if (!users.includes(sender))
        throw `Invalid sender: ${sender}`;
    for (let rec in recipients) {
        if (!users.includes(rec)) {
            throw `Invalid recipient: ${rec}`
        }
    }
    return true;
}

class Blockchain {
    constructor(tx) {
        this.users = ["mint", ...Array.from(Object.keys(tx))];
        this.chain = new Block("mint", tx, null);
    }
    addUser(user) {
        this.users.push(user);
    }
    addBlock(sender, tx) {
        try {
            let verified = verifyUsers(sender, tx, this.users);
        } catch (e) {
            console.error(e);
            return;
        }
        this.chain = new Block(sender, tx, this.chain);
    }
    validateChain() {
        let graph = {};
        let currBlock = this.chain;
        while (currBlock.prevHash !== "0") {
            let data = JSON.stringify(currBlock.prevBlock.id + currBlock.prevBlock.tx + currBlock.prevBlock.sender);
            let hash = currBlock.prevHash;
            if (!bcrypt.compareSync(data, hash)) {
                throw Error(`Invalid block: ${data}`);
            }
            currBlock = currBlock.prevBlock;
        }
        return true;
    }
}

class Block {
    constructor(sender, tx, prevBlock) {
        this.id = uuid();
        this.prevBlock = prevBlock;
        this.prevHash = !prevBlock ? "0" : bcrypt.hashSync(JSON.stringify(prevBlock.id + prevBlock.tx + prevBlock.sender), salt);
        this.tx = tx;
        this.sender = sender;
    }
}

let benCoin = new Blockchain({
    [uuid()]: 5,
    [uuid()]: 10
});



