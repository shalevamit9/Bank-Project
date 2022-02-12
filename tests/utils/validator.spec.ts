import { expect } from "chai";
import validator from "../../src/utils/validator";


describe("Validator Functions:", () => {

    context("required", () => {
  
        it("should be a function", () => {
            expect(validator.required).to.be.a("function");
        });
    });

    context("notExist", () => {
  
        it("should be a function", () => {
            expect(validator.notExist).to.be.a("function");
        });
    });

    context("isExist", () => {
  
        it("should be a function", () => {
            expect(validator.isExist).to.be.a("function");
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

        it("should return true if num is greater than threshold", () => {
            expect(validator.isGreaterThan(500, 700)).to.be.true;
        });

        it("should return false if num is smaller than threshold", () => {
            expect(validator.isGreaterThan(500, 300)).to.be.false;
        });
    });

    context("isNumeric", () => {
  
        it("should be a function", () => {
            expect(validator.isNumeric).to.be.a("function");
        });
    });

    context("isPositive", () => {
  
        it("should be a function", () => {
            expect(validator.isPositive).to.be.a("function");
        });
    });

    context("isValidLength", () => {
  
        it("should be a function", () => {
            expect(validator.isValidLength).to.be.a("function");
        });
    });

    context("isEmpty", () => {
  
        it("should be a function", () => {
            expect(validator.isEmpty).to.be.a("function");
        });
    });

    context("hasMinSum", () => {
  
        it("should be a function", () => {
            expect(validator.hasMinSum).to.be.a("function");
        });
    });

    context("hasMinimalRemainingBalance", () => {
  
        it("should be a function", () => {
            expect(validator.hasMinimalRemainingBalance).to.be.a("function");
        });
    });

});

