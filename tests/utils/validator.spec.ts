/* eslint-disable @typescript-eslint/unbound-method */
import { expect } from "chai";
import validator from "../../src/utils/validator";
import { AccountTypes, IAccount } from "../../src/types/accounts.interface";

describe("Validator Functions:", () => {
    context("required", () => {
        it("should be a function", () => {
            expect(validator.required).to.be.a("function");
        });

        it("should return true if the object contains the provided keys", () => {
            expect(validator.required({ name: "moshe", age: 32 }, ["name"])).to
                .be.true;
        });

        it("should return false if the object doesn't contain the provided keys", () => {
            expect(
                validator.required({ name: "moshe", age: 32 }, [
                    "name",
                    "email",
                ])
            ).to.be.false;
        });
    });

    context("notExist", () => {
        it("should be a function", () => {
            expect(validator.notExist).to.be.a("function");
        });

        it("should return true if the object doesn't contain the provided keys", () => {
            expect(
                validator.notExist({ name: "moshe", age: 32 }, [
                    "email",
                    "password",
                ])
            ).to.be.true;
        });

        it("should return false if the object contains some of the provided keys", () => {
            expect(
                validator.notExist({ name: "moshe", age: 32 }, [
                    "name",
                    "email",
                ])
            ).to.be.false;
        });
    });

    context("isExist", () => {
        it("should be a function", () => {
            expect(validator.isExist).to.be.a("function");
        });

        const account1: IAccount = {
            account_id: 1,
            currency: "USD",
            balance: 10000,
            status: 1,
            type: AccountTypes.Individual,
        };
        const account2: IAccount = {
            account_id: 2,
            currency: "ILS",
            balance: 200000,
            status: 1,
            type: AccountTypes.Business,
        };
        let account3: any;

        it("should return true if all accounts in the array exist", () => {
            expect(validator.isExist([account1, account2])).to.be.true;
        });

        it("should return false if some of the accounts in the array doesn't exist", () => {
            expect(validator.isExist([account1, account2, account3])).to.be
                .false;
        });
    });

    context("isGreaterThan", () => {
        it("should be a function", () => {
            expect(validator.isGreaterThan).to.be.a("function");
        });

        it("should return true if num is greater than threshold", () => {
            expect(validator.isGreaterThan(500, 700)).to.be.true;
        });

        it("should return false if num is smaller than threshold", () => {
            expect(validator.isGreaterThan(500, 300)).to.be.false;
        });
    });

    context("isLessThan", () => {
        it("should be a function", () => {
            expect(validator.isLessThan).to.be.a("function");
        });

        it("should return true if num is less than or equal to limit", () => {
            expect(validator.isLessThan(500, 200)).to.be.true;
        });

        it("should return false if num is greater than limit", () => {
            expect(validator.isLessThan(500, 800)).to.be.false;
        });
    });

    context("isNumeric", () => {
        it("should be a function", () => {
            expect(validator.isNumeric).to.be.a("function");
        });

        it("should return true if the argument is a number", () => {
            expect(validator.isNumeric(100)).to.be.true;
        });

        it("should return false if the argument is not a number", () => {
            expect(validator.isNumeric("hello")).to.be.false;
        });
    });

    context("isPositive", () => {
        it("should be a function", () => {
            expect(validator.isPositive).to.be.a("function");
        });

        it("should return true if the number is positive", () => {
            expect(validator.isPositive(20)).to.be.true;
        });

        it("should return false if the number is not positive", () => {
            expect(validator.isPositive(-20)).to.be.false;
        });
    });

    context("isValidLength", () => {
        it("should be a function", () => {
            expect(validator.isValidLength).to.be.a("function");
        });

        it("should return true is the string has the provided length", () => {
            expect(validator.isValidLength(5, "hello")).to.be.true;
        });

        it("should return false is the string doesn't have the provided length", () => {
            expect(validator.isValidLength(5, "hello world")).to.be.false;
        });
    });

    context("isEmpty", () => {
        it("should be a function", () => {
            expect(validator.isEmpty).to.be.a("function");
        });

        it("should return true if the array is empty", () => {
            expect(validator.isEmpty([])).to.be.true;
        });

        it("should return false if the array is not empty", () => {
            expect(validator.isEmpty([1, 2, 3])).to.be.false;
        });
    });

    context("hasMinSum", () => {
        it("should be a function", () => {
            expect(validator.hasMinSum).to.be.a("function");
        });

        it("should return true if the sum of the array is at least the provided number", () => {
            expect(validator.hasMinSum(10, [2, 4, 6])).to.be.true;
        });

        it("should return false if the sum of the array is less than the provided number", () => {
            expect(validator.hasMinSum(10, [1, 2, 3])).to.be.false;
        });
    });

    context("hasMinimalRemainingBalance", () => {
        it("should be a function", () => {
            expect(validator.hasMinimalRemainingBalance).to.be.a("function");
        });

        it("should return true if the difference of the tuple is greater than the provided number", () => {
            expect(validator.hasMinimalRemainingBalance(100, [[500, 200]])).to
                .be.true;
        });

        it("should return false if the difference of the tuple is less than the provided number", () => {
            expect(validator.hasMinimalRemainingBalance(100, [[500, 450]])).to
                .be.false;
        });
    });
});
