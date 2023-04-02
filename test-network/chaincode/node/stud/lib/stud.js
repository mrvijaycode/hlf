'use strict';

const { Contract } = require('fabric-contract-api');

class testContract extends Contract {

    async checkEntityType(ctx, id) {
        try {
            let entityState = await ctx.stub.getState(id);
            if (!entityState || entityState.length === 0) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    async addMarks(ctx, studentInfo) {

        try {
            let studMarks = JSON.parse(studentInfo);
            if (await this.checkEntityType(ctx, studMarks["id"])) {
                throw new Error(`Fulfillment exists`);
            }

            studMarks["hash"] = ctx.stub.getTxID();
            await ctx.stub.putState(studMarks["id"], Buffer.from(JSON.stringify(studMarks)));
            return studMarks["hash"].toString();

        } catch (error) {
            let jsonResp = {};
            jsonResp.error = 'Failed to decode JSON of: ' + studMarks["id"];
            throw new Error(jsonResp);
        }
    }

    async queryMarks(ctx, studentId) {
        let marksAsBytes = await ctx.stub.getState(studentId);
        if (!marksAsBytes || marksAsBytes.toString().length <= 0) {
            throw new Error('Student this Id does not exist:');
        }
        let marks = JSON.parse(marksAsBytes.toString());
        return JSON.stringify(marks);
    }

    async deleteMarks(ctx, studentId) {
        await ctx.stub.deleteState(studentId);
        console.log('Student marks deleted from the ledger..')
    }

}

module.exports = testContract;
