/* eslint-disable @typescript-eslint/unbound-method */
import { expect } from "chai";
import familyService from "../../src/modules/family/family.service";

describe("Family Service Functions:", () => {
    context("createFamilyAccount", () => {
        it("should be a function", () => {
            expect(familyService.createFamilyAccount).to.be.a("function");
        });
    });

    context("getFamilyById", () => {
        it("should be a function", () => {
            expect(familyService.getFamilyById).to.be.a("function");
        });
    });

    context("addFamilyMembers", () => {
        it("should be a function", () => {
            expect(familyService.addFamilyMembers).to.be.a("function");
        });
    });

    context("removeFamilyMembers", () => {
        it("should be a function", () => {
            expect(familyService.removeFamilyMembers).to.be.a("function");
        });
    });

    context("closeFamilyAccount", () => {
        it("should be a function", () => {
            expect(familyService.closeFamilyAccount).to.be.a("function");
        });
    });

    context("transferToBusiness", () => {
        it("should be a function", () => {
            expect(familyService.transferToBusiness).to.be.a("function");
        });
    });
});
