const uuid = require("uuid");
const ursa = require("ursa");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

class Blockchain {
    constructor(tx) {
        this.users = ["mint", ...Array.from(Object.keys(tx))];
        this.chain = new Block("mint", tx);
    }
    addBlock(block) {
        this.chain = block;
    }
    validateChain() {
        let currBlock;
        do {
            currBlock = this.chain;
        } while (!currBlock.prevHash === "0") {
            let data = JSON.stringify(currBlock.prevBlock);
            let hash = currBlock.prevHash;
            if (!bcrypt.compareSync(data, hash)) {
                return false;
            }
            currBlock = currBlock.prevBlock;
        }
        return true;
    }
}

class Block {
    constructor(sender, tx, prevBlock = null) {
        //id
        this.id = uuid();
        //prev block
        this.prevBlock = prevBlock;
        //hash of prev block
        this.prevHash = !prevBlock ? "0" : bcrypt.hashSync(JSON.stringify(prevBlock), 10);
        this.tx = tx;
        this.sender = sender;
    }
}
