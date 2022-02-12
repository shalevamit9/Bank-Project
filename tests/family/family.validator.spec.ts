import { expect } from "chai";
import familyValidator from "../../src/modules/family/family.validator";


describe("Family Validator Functions:", () => {

    context("validate createFamily", () => {
  
        it("should be a function", () => {
            expect(familyValidator.createFamily).to.be.a("function");
        });
    });

    context("validate getFamily", () => {
  
        it("should be a function", () => {
            expect(familyValidator.getFamily).to.be.a("function");
        });
    });

    context("validate addFamilyMembers", () => {
  
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

