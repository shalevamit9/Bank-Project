import { expect } from "chai";
import sinon from "sinon";
import familyValidator from "../../src/modules/family/family.validator";

// ================================
//      YARIV'S EXAMPLES
// ================================

// const myObject = {
//     someMethod: () => "some output value",
// };

// sinon.replace(myObject, "someMethod", sinon.fake.returns("fake value"));

// const fake = sinon.fake.throws(new Error("not enough sugar"));

// // 2 options for the same thing
// expect(fake).to.throw("not enough sugar");
// expect(() => fake()).to.throw("not enough sugar");

// !!! in each describe - write:

/*
 * !!! in each describe - write: !!!
 *          after(sinon.restore);
 * 
 */
// ================================
// ================================


describe("Family Validator Functions:", () => {

    context("#createFamily()", () => {
  
        it("should be a function", () => {
            expect(familyValidator.createFamily).to.be.a("function");
        });
    });

    context("#getFamily()", () => {
  
        it("should be a function", () => {
            expect(familyValidator.getFamily).to.be.a("function");
        });
    });

    context("#addFamilyMembers()", () => {
  
        it("should be a function", () => {
            expect(familyValidator.addFamilyMembers).to.be.a("function");
        });
    });

    context("validate removeFamilyMembers", () => {
  
        it("should be a function", () => {
            expect(familyValidator.removeFamilyMembers).to.be.a("function");
        });
    });
    
    context("validate closeFamilyAccount", () => {
  
        it("should be a function", () => {
            expect(familyValidator.closeFamilyAccount).to.be.a("function");
        });
    });

    context("validate transferToBusiness", () => {
  
        it("should be a function", () => {
            expect(familyValidator.transferToBusiness).to.be.a("function");
        });
    });

});

